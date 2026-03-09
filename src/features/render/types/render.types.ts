export type RenderPresetId = "daylight_9am" | "blue_hour";

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
