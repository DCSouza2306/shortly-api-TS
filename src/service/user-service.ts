import { users } from "@prisma/client";
import { duplicatedEmail } from "../errors/duplicated-email-error";
import userRepository from "../repositories/users-repository";
import bcrypt from "bcrypt";

async function postUser(user: CreateUserParams) {
 await validateUniqueEmail(user.email);

 const passwordHash = await bcrypt.hash(user.password, 12);

 user = { ...user, password: passwordHash };

 await userRepository.create(user);
}

async function validateUniqueEmail(email: string) {
 const emailAlreadyRegistred = await userRepository.findByEmail(email);
 if (emailAlreadyRegistred) {
  throw duplicatedEmail();
 }
}

export type CreateUserParams = Pick<users, "name" | "email" | "password">;

const userService = {
 postUser,
};

export default userService;