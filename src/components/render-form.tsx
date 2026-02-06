"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, ImagePlus, Trash2, Wand2 } from "lucide-react";
import { RENDER_PRESETS, type RenderPresetId } from "@/lib/render-presets";

export default function RenderForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [presetId, setPresetId] = useState<RenderPresetId>("daylight_9am");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function setFile(file: File) {
    setImage(file);

    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
  }

  function handlePickImage() {
    inputRef.current?.click();
  }

  function handleRemoveImage() {
    setImage(null);

    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return null;
    });

    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleGenerate() {
    if (!image) {
      alert("Selecione uma imagem primeiro.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);
      formData.append("presetId", presetId);

      const res = await fetch("/api/render", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.error ?? "Erro ao gerar render.");
        return;
      }

      if (data.image) {
        setPreview(`data:image/png;base64,${data.image}`);
      } else {
        alert("Modelo não retornou imagem.");
      }
    } finally {
      setLoading(false);
    }
  }

  const presetEntries = useMemo(
    () => (Object.keys(RENDER_PRESETS) as RenderPresetId[]).map((id) => [id, RENDER_PRESETS[id]] as const),
    []
  );

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-950">
      <div className="w-full max-w-4xl space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-50">Render IA CurvaCursos</h1>
          <p className="text-sm text-zinc-300">
            Envie uma foto e escolha um preset do render.
          </p>
        </header>

        {/* Card: Upload + Preview */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-white/10 grid place-items-center border border-white/10">
                <ImagePlus className="size-5 text-zinc-100" />
              </div>
              <div>
                <p className="font-semibold text-zinc-50">Imagem</p>
                <p className="text-xs text-zinc-300">
                  JPG/PNG/WebP • até onde sua API aceitar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* input escondido e controlado */}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />

              <button
                type="button"
                onClick={handlePickImage}
                className="px-4 py-2 rounded-xl bg-zinc-50 text-zinc-900 font-semibold hover:opacity-90 transition"
              >
                {preview ? "Alterar foto" : "Selecionar foto"}
              </button>

              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={!preview}
                className="px-4 py-2 rounded-xl border border-white/15 text-zinc-100 hover:bg-white/10 transition disabled:opacity-40 disabled:hover:bg-transparent inline-flex items-center gap-2"
              >
                <Trash2 className="size-4" />
                Remover
              </button>
            </div>
          </div>

          {preview ? (
            <div className="space-y-3">
              <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                <Image
                  src={preview}
                  alt="preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="text-xs text-zinc-300">
                {loading ? "Gerando render..." : image ? `Arquivo selecionado: ${image.name}` : "Preview atual"}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-zinc-300">
              Clique em <span className="text-zinc-50 font-semibold">Selecionar foto</span> para começar.
            </div>
          )}
        </section>

        {/* Card: Presets */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-zinc-50">Preset</p>
              <p className="text-xs text-zinc-300">Escolha uma iluminação base.</p>
            </div>
            <span className="text-xs text-zinc-300">
              Selecionado: <span className="text-zinc-50 font-semibold">{RENDER_PRESETS[presetId].label}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {presetEntries.map(([id, preset]) => {
              const selected = presetId === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPresetId(id)}
                  className={[
                    "px-3 py-2 rounded-2xl border transition inline-flex items-center gap-2",
                    "text-sm",
                    selected
                      ? "bg-zinc-50 text-zinc-900 border-zinc-50 ring-2 ring-zinc-200/40"
                      : "border-white/15 text-zinc-100 hover:bg-white/10",
                  ].join(" ")}
                >
                  {selected ? <Check className="size-4" /> : <span className="size-4" />}
                  {preset.label}
                </button>
              );
            })}
          </div>
        </section>

      {/* Card: Prompt */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-xl space-y-3">
          <div>
            <p className="font-semibold text-zinc-50">Prompt</p>
            <p className="text-xs text-zinc-300">
              Ex: “Render fotorealista, iluminação sunset, materiais modernos, vegetação tropical, lente 24mm…”
            </p>
          </div>

          <textarea
            placeholder="Descreva o render..."
            className="w-full border border-white/10 bg-black/30 text-zinc-50 rounded-2xl p-4 resize-none h-32 outline-none focus:ring-2 focus:ring-white/20"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </section>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={loading || !image}
          className="w-full rounded-2xl py-3 font-semibold transition inline-flex items-center justify-center gap-2
                     bg-zinc-50 text-zinc-900 hover:opacity-90
                     disabled:opacity-50 disabled:hover:opacity-50"
        >
          <Wand2 className="size-5" />
          {loading ? "Gerando..." : "Gerar Render IA"}
        </button>

        {!image && (
          <p className="text-center text-xs text-zinc-400">
            Selecione uma foto para liberar o botão de gerar.
          </p>
        )}
      </div>
    </main>
  );
}
