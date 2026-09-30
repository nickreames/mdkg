#include <sys/types.h>
#include <sys/stat.h>
#include <sys/acl.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

static void die(const char *label) { perror(label); exit(1); }
static void must(int ok, const char *label) { if (!ok) { fprintf(stderr, "%s\n", label); exit(1); } }
static void make_dir(const char *p) { if (mkdir(p, 0700) != 0) die(p); }
static void create_file(const char *p, const char *data) {
  int fd = open(p, O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW, 0600);
  if (fd < 0) die("create file");
  size_t len = strlen(data);
  if (write(fd, data, len) != (ssize_t)len) die("write file");
  if (close(fd) != 0) die("close file");
}
static void read_text_fd(int fd, char *out, size_t capacity) {
  ssize_t count = read(fd, out, capacity - 1);
  if (count < 0) die("read fd");
  out[count] = 0;
}

static void run_race(const char *base) {
  char root[PATH_MAX], trusted[PATH_MAX], moved[PATH_MAX], outside[PATH_MAX];
  char inside_file[PATH_MAX], outside_file[PATH_MAX], outside_new[PATH_MAX];
  snprintf(root, sizeof root, "%s/root", base);
  snprintf(trusted, sizeof trusted, "%s/root/trusted", base);
  snprintf(moved, sizeof moved, "%s/root/moved", base);
  snprintf(outside, sizeof outside, "%s/outside", base);
  snprintf(inside_file, sizeof inside_file, "%s/root/trusted/item", base);
  snprintf(outside_file, sizeof outside_file, "%s/outside/item", base);
  snprintf(outside_new, sizeof outside_new, "%s/outside/new", base);
  make_dir(root); make_dir(trusted); make_dir(outside);
  create_file(inside_file, "inside"); create_file(outside_file, "outside");
  int root_fd = open(root, O_RDONLY | O_DIRECTORY | O_NOFOLLOW);
  int trusted_fd = openat(root_fd, "trusted", O_RDONLY | O_DIRECTORY | O_NOFOLLOW);
  if (root_fd < 0 || trusted_fd < 0) die("open directories");
  if (renameat(root_fd, "trusted", root_fd, "moved") != 0) die("swap rename");
  if (symlinkat(outside, root_fd, "trusted") != 0) die("swap link");

  char before[128], outside_after[128], replacement[128];
  int fd = openat(trusted_fd, "item", O_RDONLY | O_NOFOLLOW);
  if (fd < 0) die("openat read");
  read_text_fd(fd, before, sizeof before); close(fd);
  must(strcmp(before, "inside") == 0, "descriptor read escaped original directory");

  fd = openat(trusted_fd, "item", O_WRONLY | O_APPEND | O_NOFOLLOW);
  if (fd < 0 || write(fd, "+append", 7) != 7) die("openat append");
  close(fd);
  fd = openat(trusted_fd, "new", O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW, 0600);
  if (fd < 0 || write(fd, "new", 3) != 3) die("openat create");
  close(fd);
  must(access(outside_new, F_OK) == -1 && errno == ENOENT, "descriptor create escaped original directory");

  fd = openat(trusted_fd, "tmp", O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW, 0600);
  if (fd < 0 || write(fd, "replacement", 11) != 11) die("openat temp");
  close(fd);
  if (renameat(trusted_fd, "tmp", trusted_fd, "item") != 0) die("renameat replacement");
  fd = openat(trusted_fd, "item", O_RDONLY | O_NOFOLLOW);
  if (fd < 0) die("openat replacement read");
  read_text_fd(fd, replacement, sizeof replacement); close(fd);
  must(strcmp(replacement, "replacement") == 0, "descriptor replacement missed original directory");
  if (unlinkat(trusted_fd, "item", 0) != 0) die("unlinkat");
  fd = open(outside_file, O_RDONLY | O_NOFOLLOW);
  if (fd < 0) die("outside read");
  read_text_fd(fd, outside_after, sizeof outside_after); close(fd);
  must(strcmp(outside_after, "outside") == 0, "outside item changed");
  close(trusted_fd); close(root_fd);
  printf("{\"primitive\":\"descriptor-relative\",\"read\":\"inside\",\"create\":\"inside-only\",\"append\":\"inside-only\",\"replace\":\"inside-only\",\"remove\":\"inside-only\",\"outside\":\"unchanged\"}\n");
}

static void run_metadata(const char *source, const char *temp) {
  int source_fd = open(source, O_RDONLY | O_NOFOLLOW);
  if (source_fd < 0) die("metadata source open");
  struct stat original, prepared;
  if (fstat(source_fd, &original) != 0) die("metadata source stat");
  int temp_fd = open(temp, O_WRONLY | O_CREAT | O_EXCL | O_NOFOLLOW, 0600);
  if (temp_fd < 0) die("metadata temp open");
  if (fchown(temp_fd, original.st_uid, original.st_gid) != 0) die("metadata owner/group");
  if (fchmod(temp_fd, original.st_mode & 07777) != 0) die("metadata mode");
  errno = 0;
  acl_t permissions = acl_get_fd(source_fd);
  if (!permissions && errno != ENOENT) die("metadata source acl");
  if (permissions && acl_set_fd(temp_fd, permissions) != 0) die("metadata temp acl");
  if (fstat(temp_fd, &prepared) != 0) die("metadata prepared stat");
  must(prepared.st_uid == original.st_uid && prepared.st_gid == original.st_gid,
       "owner/group mismatch before content write");
  must((prepared.st_mode & 07777) == (original.st_mode & 07777),
       "mode mismatch before content write");
  errno = 0;
  acl_t prepared_acl = acl_get_fd(temp_fd);
  if (!prepared_acl && errno != ENOENT) die("metadata prepared acl");
  char *old_text = NULL, *new_text = NULL;
  if (permissions && prepared_acl) {
    ssize_t old_len = 0, new_len = 0;
    old_text = acl_to_text(permissions, &old_len);
    new_text = acl_to_text(prepared_acl, &new_len);
    must(old_text && new_text && old_len == new_len && memcmp(old_text, new_text, old_len) == 0,
         "acl mismatch before content write");
  } else {
    must(!permissions && !prepared_acl, "acl presence mismatch before content write");
  }
  const char *replacement = "replacement";
  if (write(temp_fd, replacement, strlen(replacement)) != (ssize_t)strlen(replacement)) die("metadata write");
  if (fsync(temp_fd) != 0) die("metadata fsync");
  if (old_text) acl_free(old_text);
  if (new_text) acl_free(new_text);
  if (prepared_acl) acl_free(prepared_acl);
  if (permissions) acl_free(permissions);
  close(source_fd); close(temp_fd);
  printf("{\"primitive\":\"metadata-before-bytes\",\"mode\":%d,\"uid\":%u,\"gid\":%u,\"acl_equal\":true}\n",
         (int)(prepared.st_mode & 07777), prepared.st_uid, prepared.st_gid);
}

int main(int argc, char **argv) {
  if (argc == 3 && strcmp(argv[1], "race") == 0) { run_race(argv[2]); return 0; }
  if (argc == 4 && strcmp(argv[1], "metadata") == 0) { run_metadata(argv[2], argv[3]); return 0; }
  fprintf(stderr, "usage: native_probe race <owned-base> | metadata <source> <new-temp>\n");
  return 2;
}
