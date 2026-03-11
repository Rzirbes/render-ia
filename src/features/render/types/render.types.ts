import { FormStatus } from "react-dom";

export type RenderPresetId =
  | "daylight_9am"
  | "blue_hour"
  | "exterior_daylight_locked";

export type RenderStatus = "PENDING" | "PROCESSING" | "DONE" | "ERROR";

export type CreateRenderPayload = {
  originalImageUrl: string;
  originalImagePath: string;
  prompt?: string;
  presetId?: RenderPresetId;
  creditsToUse?: number;
  clientRequestId?: string;
  originalImageMimeType?: string;
};

export type RenderItem = {
  id: string;
  userId: string;
  status: RenderStatus;
  originalImageUrl: string;
  originalImagePath: string;
  sourceImageMimeType: string | null;
  generatedImageUrl: string | null;
  outputImagePath: string | null;
  prompt: string | null;
  presetId: RenderPresetId | null;
  creditsUsed: number;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RenderItemList = {
  id: string;
  userId: string;
  status: RenderStatus;

  originalImageUrl: string;
  generatedImageUrl: string | null;

  prompt: string | null;
  presetId: RenderPresetId | null;
  creditsUsed: number;

  traceId: string | null;
  clientRequestId: string | null;
  providerJobId: string | null;
  providerRequestId: string | null;

  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;

  errorCode: string | null;
  errorMessage: string | null;

  createdAt: string;
  updatedAt: string;

  originalImagePath?: string;
  sourceImageMimeType?: string | null;
  outputImagePath?: string | null;
};

export type ListRendersResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: RenderItemList[];
};

export type UploadRenderImageResponse = {
  url: string;
  path: string;
  mimeType: string;
};

export type RenderActionParams = {
  presetId: RenderPresetId;
  setStatus: React.Dispatch<React.SetStateAction<FormStatus>>;
  setResult: React.Dispatch<React.SetStateAction<RenderItem | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export type EditRenderPayload = {
  prompt?: string;
  presetId?: RenderPresetId;
};
