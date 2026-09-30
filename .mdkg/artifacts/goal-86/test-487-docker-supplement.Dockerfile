# Harness-only supplement. The retained package and baked read-only graphs stay unchanged.
ARG QUALIFICATION_BASE
FROM ${QUALIFICATION_BASE}
COPY --chown=10001:10001 capsule/ /capsule/
USER 10001:10001
