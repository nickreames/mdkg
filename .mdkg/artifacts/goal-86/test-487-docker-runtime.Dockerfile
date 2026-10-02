# Node26 loader prerequisite only; no mdkg payload or host dependency change.
ARG QUALIFICATION_BASE
FROM ${QUALIFICATION_BASE}
USER 0:0
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends libatomic1 && rm -rf /var/lib/apt/lists/*
USER 10001:10001
