#!/bin/bash

# Define paths
TEMPLATE_PATH="subgraph.template.yaml"
OUTPUT_PATH="subgraph.yaml"
ERC6956Full_ADDRESS_JSON_PATH="./abis/ERC6956Full_address.json"
NFTMarketplace_ADDRESS_JSON_PATH="./abis/NFTMarketplace_address.json"

# Read the JSON file and extract values using jq
ERC6956Full_ADDRESS=$(jq -r '.address' "$ERC6956Full_ADDRESS_JSON_PATH")
NFTMarketplace_ADDRESS=$(jq -r '.address' "$NFTMarketplace_ADDRESS_JSON_PATH")

# Read the template file
TEMPLATE=$(<"$TEMPLATE_PATH")

# Replace placeholders with values from JSON
RESULT=$(echo "$TEMPLATE" | sed \
  -e "s/{{ERC6956Full_ADDRESS}}/${ERC6956Full_ADDRESS}/g" \
  -e "s/{{NFTMarketplace_ADDRESS}}/${NFTMarketplace_ADDRESS}/g")

# Write the result to the output file
echo "$RESULT" > "$OUTPUT_PATH"

echo "Generated $OUTPUT_PATH from $TEMPLATE_PATH using $CONFIG_PATH"
