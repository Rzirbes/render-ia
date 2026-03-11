"use client";

import type { RenderItem } from "@/features/render/types/render.types";
import {
  editRenderService,
  processRenderService,
} from "../client/render.service";
import RenderFormBase from "./render-form-base";
import { useSWRConfig } from "swr";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

type RenderEditFormProps = {
  renderId: string;
  previewSrc: string;
  onSuccess?: (result: RenderItem) => void;
};

export default function RenderEditForm({
  renderId,
  previewSrc,
  onSuccess,
}: RenderEditFormProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  const { mutate } = useSWRConfig();
  const { mutateUser } = useCurrentUser();

  return (
    <RenderFormBase
      mode="edit"
      allowFileUpload={false}
      previewSrc={previewSrc}
      onSubmit={async ({
        prompt,
        presetId,
        setStatus,
        setResult,
        setError,
      }) => {
        try {
          setError(null);
          setResult(null);

          setStatus("creating");
          const created = await editRenderService(renderId, {
            prompt: prompt || undefined,
            presetId,
          });
          await Promise.all([mutateUser(), mutate("renders")]);
          setStatus("processing");
          const processed = await processRenderService(created.id);
          console.log("EDIT PROCESSED", processed);

          const finalResult = {
            ...processed,
            generatedImageUrl: processed.generatedImageUrl
              ? processed.generatedImageUrl.startsWith("http")
                ? processed.generatedImageUrl
                : `${apiUrl}${processed.generatedImageUrl}`
              : null,
          };

          setResult(finalResult);
          onSuccess?.(finalResult);

          await Promise.all([mutateUser(), mutate("renders")]);

          setStatus("done");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Erro ao editar render.",
          );
          setStatus("error");
        }
      }}
    />
  );
}
