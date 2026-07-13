# Asset Registration API

A TypeScript and Express API for registering users and assets, hashing asset metadata deterministically, and recording registrations through either a simulated blockchain adapter or an ABI-based Ethereum contract call.

The project currently uses in-memory storage. Users and assets are lost whenever the server restarts.

## Requirements

- Node.js 22.13.0 or newer
- npm
- A local Hardhat node or another Ethereum-compatible JSON-RPC endpoint only when using real blockchain mode
- A funded private key and deployed `AssetRegistry` contract only when using real blockchain mode

## Setup

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env`, then adjust its values:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
BLOCKCHAIN_MODE=simulated
ETHEREUM_RPC_URL=
ETHEREUM_PRIVATE_KEY=
ASSET_REGISTRY_CONTRACT_ADDRESS=
```

Start the development server:

```bash
npm run dev
```

Build and run the compiled application:

```bash
npm run build
npm start
```

The default API address is `http://localhost:3000`.

## Commands

```bash
npm run dev    # Run the TypeScript server in watch mode
npm run build  # Compile TypeScript into dist/
npm start      # Run the compiled server
npm test       # Run integration and utility tests serially
```

## API documentation

Swagger UI is available at:

```text
http://localhost:3000/api/docs
```

The generated OpenAPI 3.0 specification is available at:

```text
http://localhost:3000/api/docs.json
```

## API routes

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | None | Check API availability |
| `POST` | `/api/auth/register` | None | Register a user |
| `POST` | `/api/auth/login` | None | Log in and receive a JWT |
| `GET` | `/api/users/me` | Bearer JWT | Retrieve the authenticated user |
| `POST` | `/api/assets` | Bearer JWT | Register an asset |
| `GET` | `/api/assets` | None | Retrieve all assets |
| `GET` | `/api/assets/:id` | None | Retrieve one asset |

Successful and error responses use a shared envelope:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

```json
{
  "success": false,
  "message": "Resource not found"
}
```

Validation errors additionally contain an `errors` object with Zod field errors.

## Request examples

### Health check

```bash
curl http://localhost:3000/api/health
```

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fawwaz",
    "email": "fawwaz@example.com",
    "password": "Password123!"
  }'
```

Registration passwords must be 8–72 characters and contain lowercase, uppercase, numeric, and special characters. Passwords are stored as bcrypt hashes and are never returned by the API.

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fawwaz@example.com",
    "password": "Password123!"
  }'
```

The JWT is returned at `data.token` and expires after one hour.

### Current user

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <token>"
```

### Register an asset

```bash
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Warehouse Certificate",
    "description": "Primary ownership certificate",
    "metadata": {
      "serial": 42,
      "location": "Jakarta"
    }
  }'
```

`ownerId` is always taken from the verified JWT. Supplying `ownerId` in the request is rejected. A registered asset includes:

- A UUID asset ID
- The normalized request fields
- A deterministic `metadataHash`
- A simulated or real `transactionHash`
- A `blockchainStatus`
- The authenticated owner's user ID
- An ISO 8601 creation timestamp

### Fetch assets

```bash
curl http://localhost:3000/api/assets
curl http://localhost:3000/api/assets/<asset-id>
```

## Architecture

```text
src/
├── blockchain/       Solidity contract, ABI, and blockchain adapter
├── common/           Shared errors and utilities
├── config/           Environment parsing and validation
├── database/         Process-local in-memory data store
├── docs/             OpenAPI composition and shared definitions
├── middleware/       Authentication, validation, and error handling
├── modules/
│   ├── auth/         Registration and login
│   ├── users/        User repository and current-user endpoint
│   └── assets/       Asset domain and module-owned OpenAPI definitions
├── routes/            Base API router
├── app.ts             Express middleware and route composition
└── server.ts          HTTP server entry point
```

Hardhat is configured through [`hardhat.config.ts`](hardhat.config.ts), and [`ignition/modules/AssetRegistry.ts`](ignition/modules/AssetRegistry.ts) owns the reproducible contract deployment.

Requests pass through Express middleware and Zod validation before reaching controllers. Controllers delegate business behavior to services. Services use repositories for storage and the blockchain adapter for registration. Errors are passed to one centralized error handler through the async-handler utility.

The OpenAPI configuration follows the same ownership boundaries: auth, user, and asset definitions live inside their modules, while only generic response definitions are shared centrally.

## Metadata hashing

Metadata is recursively normalized by sorting object keys using deterministic code-unit ordering. Array order is preserved. The normalized JSON is hashed with SHA-256 and encoded as a 32-byte hexadecimal value prefixed with `0x`.

Equivalent objects therefore produce the same hash even when their keys were supplied in a different order. Different array ordering remains significant.

## Blockchain modes

### Simulated mode

```env
BLOCKCHAIN_MODE=simulated
```

This is the default and requires no Ethereum configuration. The API calculates the real deterministic metadata hash, generates a cryptographically random 32-byte transaction-shaped hash locally, and stores the asset as `registered`. No network request or on-chain transaction occurs.

### Real mode

```env
BLOCKCHAIN_MODE=real
ETHEREUM_RPC_URL=https://your-rpc-endpoint.example
ETHEREUM_PRIVATE_KEY=0x...
ASSET_REGISTRY_CONTRACT_ADDRESS=0x...
```

Real mode requires all three Ethereum values. Startup fails with a clear error when they are missing or when the private key or contract address has an invalid hexadecimal length.

In real mode, the adapter:

1. Creates an `ethers.JsonRpcProvider`.
2. Connects an `ethers.Wallet`.
3. Creates an `ethers.Contract` using the included ABI.
4. Calls `registerAsset(assetId, metadataHash)`.
5. Waits for the transaction receipt.
6. Stores the confirmed receipt hash with the asset.

The wallet must be funded on the configured network, and `ASSET_REGISTRY_CONTRACT_ADDRESS` must point to a deployed compatible contract.

The backend keeps two different ownership concepts:

- `ownerId` in the API asset record is the authenticated application user's UUID from the JWT.
- `owner` in the Solidity registration is the Ethereum address of the backend signer configured through `ETHEREUM_PRIVATE_KEY`.

The current API does not assign a separate Ethereum wallet to each application user.

### Local real-mode flow with Hardhat and Ignition

The repository includes Hardhat 3 configuration in [`hardhat.config.ts`](hardhat.config.ts) and an Ignition deployment module in [`ignition/modules/AssetRegistry.ts`](ignition/modules/AssetRegistry.ts). Hardhat compiles contracts from `src/blockchain/contracts` with Solidity 0.8.28.

Start the local Hardhat JSON-RPC node in the first terminal:

```bash
npx hardhat node
```

The node listens at `http://127.0.0.1:8545`, uses chain ID `31337`, and prints its development accounts and private keys. These keys are public development credentials and must never be used on a public network or with real funds.

While the node remains running, deploy the contract from a second terminal:

```bash
npx hardhat ignition deploy ignition/modules/AssetRegistry.ts --network localhost
```

Ignition records the local deployment under `ignition/deployments/chain-31337`. Copy the `AssetRegistryModule#AssetRegistry` value from `deployed_addresses.json`. The currently recorded local deployment address is:

```text
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Configure the API's `.env` using the local RPC URL, one private key printed by `npx hardhat node`, and the deployed address:

```env
BLOCKCHAIN_MODE=real
ETHEREUM_RPC_URL=http://127.0.0.1:8545
ETHEREUM_PRIVATE_KEY=<hardhat-development-private-key>
ASSET_REGISTRY_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Restart the API after changing `.env`:

```bash
npm run dev
```

Register and log in as an API user, then call `POST /api/assets` with the returned JWT. The complete real-mode flow is:

1. The API derives `ownerId` from the JWT and creates a UUID asset ID.
2. Metadata is stably serialized and hashed with SHA-256.
3. The backend signer calls `registerAsset(assetId, metadataHash)` through the included ABI.
4. The Solidity contract stores the metadata hash, signer address, and block timestamp.
5. The API waits for the transaction receipt.
6. The API stores the asset metadata, metadata hash, confirmed transaction hash, blockchain status, and application owner ID in memory.

Restarting `npx hardhat node` creates a fresh local chain. Redeploy the contract and refresh `ASSET_REGISTRY_CONTRACT_ADDRESS` when the previous deployment is no longer present on the new node.

## Solidity contract

[`AssetRegistry.sol`](src/blockchain/contracts/AssetRegistry.sol) records a metadata hash, registering wallet, and block timestamp under a key derived from the string asset ID. Its registration function is:

```solidity
function registerAsset(string calldata assetId, bytes32 metadataHash) external
```

The function rejects duplicate asset IDs and emits `AssetRegistered`. The TypeScript ABI uses the same `string, bytes32` arguments. Hardhat compiles the contract, and the included Ignition module deploys it without constructor arguments. For another Ethereum-compatible network, configure Hardhat or deploy with equivalent tooling, then provide that network's RPC URL, funded signer key, and deployed address to the API.

## Tests

Run:

```bash
npm test
```

The suite covers registration, duplicate email rejection, login, incorrect credentials, standard error envelopes, JWT-protected asset creation, JWT-derived ownership, listing, lookup, missing assets, and deterministic metadata hashing.

Tests use simulated blockchain mode and clear the in-memory database between cases. They run serially to avoid sharing process-global state concurrently.