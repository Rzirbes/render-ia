import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import type { Part } from "@google/genai";
import {
  RENDER_PRESETS,
  type RenderPresetId,
} from "@/features/render/server/render-presets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada no servidor.");
  return new GoogleGenAI({ apiKey });
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Erro na renderização IA";
  }
}

function isPresetId(v: unknown): v is RenderPresetId {
  return typeof v === "string" && v in RENDER_PRESETS;
}

type InlineDataLike = { inlineData?: { data?: unknown; mimeType?: unknown } };

function hasInlineImageData(
  part: Part,
): part is Part & { inlineData: { data: string; mimeType?: string } } {
  const p = part as unknown as InlineDataLike;
  return typeof p.inlineData?.data === "string" && p.inlineData.data.length > 0;
}

type GenConfig = {
  responseModalities: ("TEXT" | "IMAGE")[];
  imageConfig?: {
    aspectRatio?: "1:1" | "4:3" | "16:9";
    imageSize?: "1K" | "2K" | "4K";
  };
};

type TextPartLike = { text?: unknown };

export async function POST(req: Request) {
  try {
    const ai = getAi();

    const formData = await req.formData();

    const file = formData.get("image") as File | null;
    const userPrompt = ((formData.get("prompt") as string | null) ?? "").trim();
    const presetIdRaw = formData.get("presetId");

    if (!file) {
      return NextResponse.json(
        { error: "Imagem obrigatória" },
        { status: 400 },
      );
    }

    const presetId: RenderPresetId = isPresetId(presetIdRaw)
      ? presetIdRaw
      : "daylight_9am";

    const preset = RENDER_PRESETS[presetId];

    const buffer = Buffer.from(await file.arrayBuffer()).toString("base64");

    const requestText =
      userPrompt || "Improve realism only. Do not add new objects.";

    const finalPrompt = [
      preset.systemPrompt.trim(),
      "",
      "You are an image editor. Your job is to apply ONLY the requested change(s) and keep everything else IDENTICAL.",
      "",
      "HARD CONSTRAINTS:",
      "- Keep camera, perspective, framing, geometry, furniture, textures, and all objects exactly the same.",
      "- Do NOT change the room layout, walls, floor, ceiling, windows, curtains, TV, plants, lighting style (unless requested), or background.",
      "- No new decor unless explicitly requested.",
      "- Apply minimal pixel changes necessary to satisfy the request.",
      "- If the request conflicts with constraints, do the closest minimal edit.",
      "",
      "REQUEST:",
      requestText,
      "",
      "Return IMAGE only.",
    ].join("\n");

    const contents = [
      { text: finalPrompt },
      {
        inlineData: {
          mimeType: file.type,
          data: buffer,
        },
      },
    ];

    const config: GenConfig = {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: preset.aspectRatio ?? "16:9",
        imageSize: preset.imageSize ?? "2K",
      },
    };

    const response = await ai.models.generateContent({
      model: preset.model ?? "gemini-3-pro-image-preview",
      contents,
      config,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find(hasInlineImageData);

    if (!imgPart) {
      const text =
        parts
          .map((p) => (p as TextPartLike).text)
          .filter((t): t is string => typeof t === "string" && t.length > 0)
          .join("\n") || null;

      return NextResponse.json(
        { error: "Modelo não retornou imagem", text },
        { status: 502 },
      );
    }

    return NextResponse.json({
      image: imgPart.inlineData.data,
      presetId,
    });
  } catch (error: unknown) {
    console.error(error);
    const message = getErrorMessage(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
