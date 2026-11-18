import { NextResponse } from "next/server";
import { renderErrorResponse } from "@/features/render/server/route-error";
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
    return renderErrorResponse(error, "Erro ao enviar imagem.");
  }
}
