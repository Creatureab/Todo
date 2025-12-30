import { NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as {
      email: string
      password: string
    }

    const user = await registerUser(email, password)

    return NextResponse.json(
      { message: "User created", userId: user._id },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    )
  }
}
