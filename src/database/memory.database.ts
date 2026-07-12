import type { User } from "../modules/users/user.types.js";

interface MemoryDatabase {
  users: User[];
}

export const memoryDatabase: MemoryDatabase = {
  users: [],
};
