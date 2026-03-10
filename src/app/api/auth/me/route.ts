import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
    }

    if (!API_URL) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_API_URL não configurada" },
        { status: 500 },
      );
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(data ?? { message: "Erro ao buscar usuário" }, {
        status: response.status,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Erro em /api/auth/me:", error);

    return NextResponse.json(
      { message: "Erro interno ao buscar usuário" },
      { status: 500 },
    );
  }
}
