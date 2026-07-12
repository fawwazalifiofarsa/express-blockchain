export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export type PublicUser = Omit<User, "passwordHash">;

export type CreateUserInput = Omit<User, "id" | "createdAt">;
