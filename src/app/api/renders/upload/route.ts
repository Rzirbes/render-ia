import { NextResponse } from "next/server";
import { uploadRenderImage } from "@/features/render/server/render.service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Arquivo não enviado." },
        { status: 400 },
      );
    }

    const result = await uploadRenderImage(file);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao enviar imagem.",
      },
      { status: 500 },
    );
  }
}
