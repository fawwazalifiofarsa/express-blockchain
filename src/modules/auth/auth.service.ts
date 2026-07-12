import { AppError } from "../../common/errors/app-error.js";
import { generateToken } from "../../common/utils/jwt.js";
import { hashPassword } from "../../common/utils/password.js";
import { verifyPassword } from "../../common/utils/password.js";
import {
  userRepository,
  type UserRepository,
} from "../users/user.repository.js";
import type { PublicUser, User } from "../users/user.types.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export class AuthService {
  constructor(private readonly users: UserRepository = userRepository) {}

  async register(input: RegisterInput): Promise<PublicUser> {
    const passwordHash = await hashPassword(input.password);
    const user = this.users.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    if (!user) {
      throw new AppError("Email is already registered", 409);
    }

    return toPublicUser(user);
  }

  async login(input: LoginInput): Promise<{ token: string; user: PublicUser }> {
    const user = this.users.findByEmail(input.email);

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      token: generateToken(user.id),
      user: toPublicUser(user),
    };
  }
}

export const authService = new AuthService();
