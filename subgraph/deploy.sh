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
NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT=$(echo "$DEPLOY_OUTPUT" | 
  sed 's/\x1b\[0m//g' |
  sed -n -e '/Subgraph endpoints:/,/Queries (HTTP):/s/.*Queries (HTTP):[[:space:]]*//p' | 
  sed 's/[[:space:]].*//')
NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT="https://api.studio.thegraph.com/query/88554/erc6956full/version/latest"
# Print NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT to the terminal
echo "Subgraph Studio Endpoint:"
echo "$NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT"

# File path to the .env file
ENV_FILE="../frontend/.env"

# Append the endpoint URL to the .env file
if grep -q '^NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT=' "$ENV_FILE"; then
  # Replace the existing NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT
  sed -i "s|^NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT=.*|NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT=$NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT|" "$ENV_FILE"
else
  # Add a new NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT entry
  echo "NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT=$NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT" >> "$ENV_FILE"
fi

# Print confirmation
echo "Deployment endpoint URL saved to  "$ENV_FILE" file: $NEXT_PUBLIC_SUBGRAPH_STUDIO_ENDPOINT"