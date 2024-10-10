FROM golang:1.22.5-alpine

# Install curl
RUN apk update && apk add curl

WORKDIR /app

COPY ./src /app

# Download Go modules
# COPY src/go.mod src/go.sum ./
RUN go mod download

# RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

EXPOSE 8080

CMD ["go", "run", "."]
# CMD ["/docker-gs-ping"]