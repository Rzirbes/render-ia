import { NextResponse } from "next/server";
import {
  deleteRender,
  getRender,
} from "@/features/render/server/render.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const render = await getRender(id);

    return NextResponse.json(render);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao buscar render.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const result = await deleteRender(id);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Erro ao remover render.",
      },
      { status: 500 },
    );
  }
}
