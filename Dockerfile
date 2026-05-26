# Stage 1: Build Go binary
FROM golang:1.25-alpine AS go-builder
WORKDIR /build
COPY backend-go/go.mod backend-go/go.sum ./
RUN GOPROXY=https://goproxy.cn,direct go mod download
COPY backend-go/*.go ./
RUN GOPROXY=https://goproxy.cn,direct CGO_ENABLED=0 GOOS=linux go build -o /server .

# Stage 2: Runtime
FROM alpine:latest
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=go-builder /server .
COPY dist/ ./dist/
EXPOSE 8092
CMD ["/app/server"]
