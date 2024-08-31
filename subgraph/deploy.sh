#!/bin/bash

# Authenticate
npx graph auth --studio 02eb27dea06d8c328be8c1bda0776657

# Generate Typescript code
# --output-dir __generated__
npx graph codegen

# Build the subgraph
npx graph build


# TO TEST

# Deploy
# DEPLOY_OUTPUT=$(npx graph deploy --node https://api.staging.thegraph.com/deploy/ --ipfs https://api.staging.thegraph.com/ipfs/ azf20/very-cool-subgraph)
DEPLOY_OUTPUT=$(npx graph deploy --studio erc6956full)
# Print DEPLOY_OUTPUT to the terminal
echo "Deployment Output:"
echo "$DEPLOY_OUTPUT"

# this does not work
# SUBGRAPH_STUDIO_ENDPOINT=$(echo "$DEPLOY_OUTPUT" | grep -oP '(?<=Queries \(HTTP\):\s*)https://[^\s,]+')
SUBGRAPH_STUDIO_ENDPOINT=$(echo "$DEPLOY_OUTPUT" | grep -oP '(?<=Subgraph endpoints: Queries \(HTTP\):\t)http://[^\s,]+')
# SUBGRAPH_STUDIO_ENDPOINT=$(echo "$DEPLOY_OUTPUT" | grep -oP '(?<=Subgraph endpoints: Queries \(HTTP\): )https://[^\s,]+')
# SUBGRAPH_STUDIO_ENDPOINT=$(echo "$DEPLOY_OUTPUT" | grep -o 'https://api\.studio\.thegraph\.com/query/[0-9]*/erc6956full/v[0-9]\+\.[0-9]\+.[0-9]\+')
# Print SUBGRAPH_STUDIO_ENDPOINT to the terminal
echo "Subgraph Studio Endpoint:"
echo "$SUBGRAPH_STUDIO_ENDPOINT"

# Append the endpoint URL to the .env file
if grep -q '^SUBGRAPH_STUDIO_ENDPOINT=' ../frontend/.env; then
  # Replace the existing SUBGRAPH_STUDIO_ENDPOINT
  sed -i "s|^SUBGRAPH_STUDIO_ENDPOINT=.*|SUBGRAPH_STUDIO_ENDPOINT=$SUBGRAPH_STUDIO_ENDPOINT|" ../frontend/.env
else
  # Add a new SUBGRAPH_STUDIO_ENDPOINT entry
  echo "SUBGRAPH_STUDIO_ENDPOINT=$SUBGRAPH_STUDIO_ENDPOINT" >> ../frontend/.env
fi

# Print confirmation
echo "Deployment endpoint URL saved to ../frontend/.env file: $SUBGRAPH_STUDIO_ENDPOINT"