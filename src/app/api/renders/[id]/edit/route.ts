import { editRender } from "@/features/render/server/render.service";
import { renderErrorResponse } from "@/features/render/server/route-error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const render = await editRender(id, {
      prompt: body.prompt,
      presetId: body.presetId,
    });

    return NextResponse.json(render);
  } catch (error) {
    return renderErrorResponse(error, "Erro ao editar render.");
  }
}
