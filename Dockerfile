FROM alpine:latest

ARG PB_VERSION=0.20.7

RUN apk add --no-cache \
    ca-certificates

# add PocketBase
ADD ./pocketbase /pb/pocketbase
ADD ./pb_data /pb_data

EXPOSE 8080

# Create a volume for the PocketBase data
VOLUME /pb_data

# start PocketBase
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb_data"]
