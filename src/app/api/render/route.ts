import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import type { Part } from "@google/genai";
import { RENDER_PRESETS, type RenderPresetId } from "@/lib/render-presets";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function isPresetId(v: unknown): v is RenderPresetId {
  return typeof v === "string" && v in RENDER_PRESETS;
}

type InlineDataLike = { inlineData?: { data?: unknown; mimeType?: unknown } };

function hasInlineImageData(
  part: Part
): part is Part & { inlineData: { data: string; mimeType?: string } } {
  const p = part as unknown as InlineDataLike;
  return typeof p.inlineData?.data === "string" && p.inlineData.data.length > 0;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("image") as File | null;
    const userPrompt = (formData.get("prompt") as string | null) ?? "";
    const presetIdRaw = formData.get("presetId"); // ✅ vem do front

    if (!file) {
      return NextResponse.json({ error: "Imagem obrigatória" }, { status: 400 });
    }

    // ✅ fallback seguro
    const presetId: RenderPresetId = isPresetId(presetIdRaw)
      ? presetIdRaw
      : "daylight_9am";

    const preset = RENDER_PRESETS[presetId];

    const buffer = Buffer.from(await file.arrayBuffer()).toString("base64");

    const finalPrompt = [
      preset.systemPrompt,
      userPrompt?.trim() ? `\n\nPEDIDOS DO USUÁRIO:\n${userPrompt.trim()}` : "",
    ].join("");

    const contents = [
      { text: finalPrompt },
      {
        inlineData: {
          mimeType: file.type,
          data: buffer,
        },
      },
    ];

    type GenConfig = {
        responseModalities: ("TEXT" | "IMAGE")[];
        imageConfig?: {
            aspectRatio?: "1:1" | "4:3" | "16:9";
            imageSize?: "1K" | "2K" | "4K";
        };
        };

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

    type TextPartLike = { text?: unknown };


    if (!imgPart) {
      const text = parts
    .map((p) => (p as TextPartLike).text)
    .filter((t): t is string => typeof t === "string" && t.length > 0)
    .join("\n") || null;

      return NextResponse.json(
        { error: "Modelo não retornou imagem", text },
        { status: 502 }
      );
    }

    return NextResponse.json({
      image: imgPart.inlineData.data,
      presetId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro na renderização IA" }, { status: 500 });
  }
}
