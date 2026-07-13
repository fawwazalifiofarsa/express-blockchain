import type { User } from "../modules/users/user.types.js";
import type { Asset } from "../modules/assets/asset.types.js";

interface MemoryDatabase {
  users: User[];
  assets: Asset[];
}

export const memoryDatabase: MemoryDatabase = {
  users: [],
  assets: [],
};
