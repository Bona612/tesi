#!/bin/bash

# Load .env file directly (only works if variables are in correct format)
set -o allexport
source .env
set +o allexport

# Authenticate
npx graph auth --studio "$SUBGRAPH_DEPLOY_KEY"

# Generate Typescript code
npx graph codegen 

# Build the subgraph
npx graph build


# Deploy
DEPLOY_OUTPUT=$(npx graph deploy --studio erc6956full)

# Print DEPLOY_OUTPUT to the terminal
echo "Deployment Output:"
echo "$DEPLOY_OUTPUT"

# this does not work
SUBGRAPH_STUDIO_ENDPOINT=$(echo "$DEPLOY_OUTPUT" | 
  sed 's/\x1b\[0m//g' |
  sed -n -e '/Subgraph endpoints:/,/Queries (HTTP):/s/.*Queries (HTTP):[[:space:]]*//p' | 
  sed 's/[[:space:]].*//')
# Print SUBGRAPH_STUDIO_ENDPOINT to the terminal
echo "Subgraph Studio Endpoint:"
echo "$SUBGRAPH_STUDIO_ENDPOINT"

# File path to the .env file
ENV_FILE="../frontend/.env"

# Append the endpoint URL to the .env file
if grep -q '^SUBGRAPH_STUDIO_ENDPOINT=' "$ENV_FILE"; then
  # Replace the existing SUBGRAPH_STUDIO_ENDPOINT
  sed -i "s|^SUBGRAPH_STUDIO_ENDPOINT=.*|SUBGRAPH_STUDIO_ENDPOINT=$SUBGRAPH_STUDIO_ENDPOINT|" "$ENV_FILE"
else
  # Add a new SUBGRAPH_STUDIO_ENDPOINT entry
  echo "SUBGRAPH_STUDIO_ENDPOINT=$SUBGRAPH_STUDIO_ENDPOINT" >> "$ENV_FILE"
fi

# Print confirmation
echo "Deployment endpoint URL saved to  "$ENV_FILE" file: $SUBGRAPH_STUDIO_ENDPOINT"