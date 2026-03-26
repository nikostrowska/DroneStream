FROM bluenviron/mediamtx:1 AS mediamtx
FROM alpine:3.23

COPY --from=mediamtx /mediamtx /
COPY --from=mediamtx /mediamtx.yml /

# add anything you need.
RUN apk add --no-cache gstreamer-tools

ENTRYPOINT [ "/mediamtx" ]
