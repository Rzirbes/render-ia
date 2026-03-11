import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordServer } from "@/features/auth/server/forgot-password.server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = await forgotPasswordServer({
      email: body.email,
      locale: body.locale,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao solicitar recuperação de senha.";

    return NextResponse.json(
      {
        message,
      },
      { status: 500 },
    );
  }
}
