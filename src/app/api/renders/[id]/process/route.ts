import { NextResponse } from "next/server";
import { processRender } from "@/features/render/server/render.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const render = await processRender(id);

    return NextResponse.json(render);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao processar render.",
      },
      { status: 500 },
    );
  }
}
