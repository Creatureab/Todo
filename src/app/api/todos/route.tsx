import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { Todo } from "@/model/Todo";

export async function GET(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  const todos = await Todo.find({ userId: user?.userId }).sort({ createdAt: -1 });
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  const { title } = await req.json();
  const todo = await Todo.create({
    userId: user?.userId,
    title,
    status: "pending",
    completed: false
  });

  return NextResponse.json(todo, { status: 201 });
}