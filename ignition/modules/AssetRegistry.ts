import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AssetRegistryModule", (module) => {
  const assetRegistry = module.contract("AssetRegistry");

  return {
    assetRegistry,
  };
});
