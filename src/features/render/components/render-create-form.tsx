"use client";

import { useState } from "react";
import type { RenderItem } from "@/features/render/types/render.types";
import {
  createRenderService,
  processRenderService,
  uploadRenderImageService,
} from "../client/render.service";
import RenderFormBase from "./render-form-base";
import RenderEditForm from "./render-edit-form";

export default function RenderCreateForm() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const [selectedRender, setSelectedRender] = useState<RenderItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <RenderFormBase
        mode="create"
        allowFileUpload
        onEditClick={(result) => {
          setSelectedRender(result);
          setIsEditModalOpen(true);
        }}
        onSubmit={async ({
          file,
          prompt,
          presetId,
          setStatus,
          setResult,
          setError,
        }) => {
          if (!file) {
            setError("Selecione uma imagem antes de gerar o render.");
            setStatus("error");
            return;
          }

          try {
            setError(null);
            setResult(null);

            setStatus("uploading");
            const uploaded = await uploadRenderImageService(file);

            setStatus("creating");
            const created = await createRenderService({
              originalImageUrl: uploaded.url,
              originalImagePath: uploaded.path,
              originalImageMimeType: uploaded.mimeType,
              presetId,
              prompt: prompt || undefined,
            });

            setStatus("processing");
            const processed = await processRenderService(created.id);

            const finalResult = {
              ...processed,
              generatedImageUrl: processed.generatedImageUrl?.startsWith("http")
                ? processed.generatedImageUrl
                : `${apiUrl}${processed.generatedImageUrl}`,
            };

            setResult(finalResult);
            setStatus("done");
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Erro ao processar render.",
            );
            setStatus("error");
          }
        }}
      />

      {isEditModalOpen && selectedRender ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Editar render
              </h2>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-sm text-zinc-400 hover:text-white"
              >
                Fechar
              </button>
            </div>

            <RenderEditForm
              renderId={selectedRender.id}
              previewSrc={selectedRender.generatedImageUrl ?? ""}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}