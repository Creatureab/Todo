import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/model/User";
import type { HydratedDocument } from "mongoose";

type UserDoc = HydratedDocument<{
  email: string;
  password: string;
}>;

export async function registerUser(
  email: string,
  password: string
): Promise<UserDoc> {
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user; // ✅ THIS FIXES IT
}
