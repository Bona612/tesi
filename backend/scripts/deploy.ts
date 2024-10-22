import hre, { artifacts } from "hardhat";
import ERC6956FullModule from '../ignition/modules/ERC6956FullModule';
import NFTMarketplaceModule from '../ignition/modules/NFTMarketplaceModule';
import { Contract } from "ethers";
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';


async function changeDirectoryPermission(directorypath: string) {
  // Check the platform
  if (process.platform === 'linux' || process.platform === 'darwin') {
    // Unix-like system (Linux, macOS)
    // const directoryPath = '/path/to/directory'; // Adjust the path to your directory
    exec(`chmod -R +rw ${directorypath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
  } else if (process.platform === 'win32') {
      // Windows
      // const directoryPath = 'C:\\Path\\To\\Directory'; // Adjust the path to your directory
      exec(`icacls "${directorypath}" /grant Everyone:F /t`, (error, stdout, stderr) => {
          if (error) {
              console.error(`Error: ${error.message}`);
              return;
          }
          if (stderr) {
              console.error(`stderr: ${stderr}`);
              return;
          }
          console.log(`stdout: ${stdout}`);
      });
  } else {
      console.error('Unsupported operating system');
  }
}


async function copyDirectoryRecursive(source: string, destination: string) {
  try {
    changeDirectoryPermission(source);
    changeDirectoryPermission("../frontend");
    if (fs.existsSync(destination)) {
      await fs.promises.rm(destination, { recursive: true }); // Remove existing directory
    } else {
      console.log(`Destination directory '${destination}' does not exist.`);
    }    
    
  } catch (error) {
    console.log("catch");
    if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error; // Throw error if it's not a 'directory does not exist' error
    }
  }

  try {
    await fs.promises.mkdir(destination, { recursive: true });
    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const sourcePath = `${source}/${file}`;
      const destPath = `${destination}/${file}`;
      const stat = await fs.promises.stat(sourcePath);
      if (stat.isDirectory()) {
        await copyDirectoryRecursive(sourcePath, destPath);
      } else {
        await fs.promises.copyFile(sourcePath, destPath);
      }
    }
    console.log('Directory copied successfully');
  } catch (error) {
    console.error('Error copying directory:', error);
  }
}




async function main() {
  const { erc6956full } = await hre.ignition.deploy(ERC6956FullModule);
  const { nftmarketplace } = await hre.ignition.deploy(NFTMarketplaceModule);

  console.log(`ERC6956FullModule deployed to: ${await erc6956full.getAddress()}`);
  console.log(`NFTMarketplaceModule deployed to: ${await nftmarketplace.getAddress()}`);

  // Save copies of each contracts abi and address to the frontend.
  await saveFrontendFiles(erc6956full , "ERC6956Full");
  await saveFrontendFiles(nftmarketplace , "NFTMarketplace");
  
  await copyDirectoryRecursive("typechain", "../frontend/typechain");

  await saveTheGraphFiles(erc6956full , "ERC6956Full");
  await saveTheGraphFiles(nftmarketplace , "NFTMarketplace");
}

async function saveFrontendFiles(contract: Contract, name: string) {
  
  const contractsDir = __dirname + "/../../frontend/contractsData";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}_address.json`,
    JSON.stringify({ address: await contract.getAddress() }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

async function saveTheGraphFiles(contract: Contract, name: string) {
  
  const contractsDir = __dirname + "/../../subgraph/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}_address.json`,
    JSON.stringify({ address: await contract.getAddress() }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    })

