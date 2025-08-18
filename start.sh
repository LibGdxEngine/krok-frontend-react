#!/bin/bash

# Set your Docker image name
IMAGE_NAME="krok-app"

# Set your container name
CONTAINER_NAME="krok-container"

# Set the network name
NETWORK_NAME="reverseproxy_nw"

# Run the Docker container
docker run -d --name "$CONTAINER_NAME" --network "$NETWORK_NAME" -p 3002:3002 "$IMAGE_NAME"