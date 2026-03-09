import { NextRequest, NextResponse } from "next/server";
import {
  createRender,
  listRenders,
} from "@/features/render/server/render.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.originalImageUrl ||
      !body.originalImagePath ||
      !body.originalImageMimeType
    ) {
      return NextResponse.json(
        { message: "Dados da imagem incompletos." },
        { status: 400 },
      );
    }

    const render = await createRender({
      originalImageUrl: body.originalImageUrl,
      originalImagePath: body.originalImagePath,
      originalImageMimeType: body.originalImageMimeType,
      presetId: body.presetId,
      prompt: body.prompt,
      creditsToUse: body.creditsToUse,
      clientRequestId: body.clientRequestId,
    });

    return NextResponse.json(render, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao criar render.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);

    const renders = await listRenders(page, pageSize);

    return NextResponse.json(renders);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao listar renders.",
      },
      { status: 500 },
    );
  }
}
