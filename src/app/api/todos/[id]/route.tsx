import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { Todo } from "@/model/Todo";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  const { completed, status } = await req.json();

  const update: any = {};
  if (status) {
    update.status = status;
    update.completed = status === "completed";
  } else if (completed !== undefined) {
    update.completed = completed;
    update.status = completed ? "completed" : "pending";
  }

  const todo = await Todo.findOneAndUpdate(
    { _id: (await params).id, userId: user?.userId },
    update,
    { new: true }
  );

  return NextResponse.json(todo);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  await Todo.deleteOne({ _id: (await params).id, userId: user?.userId });

  return NextResponse.json({ success: true });
}