#!/bin/bash

# Clean
npx hardhat clean

# Compile contracts
npx hardhat compile

# Typechain generation
npx hardhat typechain

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --network)
      NETWORK="$2"
      shift # past argument
      shift # past value
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if the network is provided
if [ -z "$NETWORK" ]; then
  echo "Usage: $0 --network <network>"
  exit 1
fi

# Deploy contracts
# npx hardhat ignition deploy ignition/modules/ERC6956FullModule.ts --network $NETWORK
# npx hardhat ignition deploy ignition/modules/NFTMarketplaceModule.ts --network $NETWORK
npx hardhat run scripts/deploy.ts --network $NETWORK
