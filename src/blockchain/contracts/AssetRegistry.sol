// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AssetRegistry {
    struct Registration {
        bytes32 metadataHash;
        address owner;
        uint256 registeredAt;
    }

    mapping(bytes32 => Registration) private registrations;

    event AssetRegistered(
        string assetId,
        bytes32 indexed metadataHash,
        address indexed owner,
        uint256 registeredAt
    );

    function registerAsset(
        string calldata assetId,
        bytes32 metadataHash
    ) external {
        bytes32 assetKey = keccak256(bytes(assetId));
        require(registrations[assetKey].registeredAt == 0, "Asset already registered");

        registrations[assetKey] = Registration({
            metadataHash: metadataHash,
            owner: msg.sender,
            registeredAt: block.timestamp
        });

        emit AssetRegistered(assetId, metadataHash, msg.sender, block.timestamp);
    }

    function getRegistration(
        string calldata assetId
    ) external view returns (Registration memory) {
        return registrations[keccak256(bytes(assetId))];
    }
}
