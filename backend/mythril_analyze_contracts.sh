#!/bin/bash

/home/matteowsl/.local/bin/myth analyze ./contracts/NFTMarketplace.sol -o jsonv2 --solc-json solc-json.json > NFTMarketplace_analyze_result.json
/home/matteowsl/.local/bin/myth analyze ./contracts/ERC6956.sol -o jsonv2 --solc-json solc-json.json > ERC6956_analyze_result.json
/home/matteowsl/.local/bin/myth analyze ./contracts/ERC6956Full.sol -o jsonv2 --solc-json solc-json.json > ERC6956Full_analyze_result.json