import { memoryDatabase } from "../../database/memory.database.js";
import { generateId } from "../../common/utils/generate-id.js";
import type { CreateUserInput, User } from "./user.types.js";

export class UserRepository {
  findById(id: string): User | undefined {
    return memoryDatabase.users.find((user) => user.id === id);
  }

  findByEmail(email: string): User | undefined {
    return memoryDatabase.users.find((user) => user.email === email);
  }

  create(input: CreateUserInput): User | undefined {
    if (this.findByEmail(input.email)) {
      return undefined;
    }

    const user: User = {
      id: generateId(),
      ...input,
      createdAt: new Date(),
    };

    memoryDatabase.users.push(user);
    return user;
  }
}

export const userRepository = new UserRepository();
