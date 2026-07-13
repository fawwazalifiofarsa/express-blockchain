import { defineConfig } from "hardhat/config";
import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";

export default defineConfig({
  plugins: [hardhatIgnitionEthers],
  solidity: {
    version: "0.8.28",
  },
  paths: {
    sources: "./src/blockchain/contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
});
