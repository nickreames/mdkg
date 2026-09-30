FROM ubuntu@sha256:224a1869083a311ef3f13648a154ba79832fbef6364d31493642ca03082da254
ARG TARGETARCH
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends git ca-certificates xz-utils && rm -rf /var/lib/apt/lists/*
COPY runtimes/ /runtime-inputs/
RUN set -eu; case "$TARGETARCH" in amd64) nodearch=x64;; arm64) nodearch=arm64;; *) exit 1;; esac; \
    for version in 24.18.0 24.15.0 26.0.0; do \
      tar -xJf "/runtime-inputs/node-v${version}-linux-${nodearch}.tar.xz" -C /opt; \
    done; \
    ln -s "/opt/node-v24.18.0-linux-${nodearch}" /opt/node; \
    groupadd --gid 10001 mdkg && useradd --uid 10001 --gid 10001 --create-home mdkg && \
    mkdir -p /private/tmp && chown 10001:10001 /private/tmp
COPY --chown=10001:10001 capsule/ /capsule/
COPY runtime-downloads.json /capsule/runtime-downloads.json
COPY published-mdkg-0.5.2.tgz /capsule/published-mdkg-0.5.2.tgz
ENV PATH="/opt/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ENV MDKG_REAL_NPM="/opt/node/lib/node_modules/npm/bin/npm-cli.js"
ENV MDKG_PUBLISHED_052_TARBALL="/capsule/published-mdkg-0.5.2.tgz"
ENV MDKG_EXPECTED_CANDIDATE_SHA256="6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca"
USER 10001:10001
WORKDIR /capsule
RUN --network=none node /capsule/.mdkg/artifacts/goal-86/test-487-docker-readonly.cjs --prepare
CMD ["node", "/capsule/.mdkg/artifacts/goal-86/test-487-docker-runner.cjs"]
