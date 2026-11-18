/**
 * Controle da chave de idempotência (`clientRequestId`) da criação de render.
 *
 * Uma "solicitação lógica" = um clique em gerar com um arquivo, prompt e
 * preset. A chave é gerada uma vez e reutilizada:
 * - nos retries automáticos da chamada de criação (falha transitória);
 * - num novo clique do usuário depois de uma falha, se os dados forem os
 *   mesmos (mesmo File, prompt e preset): se a primeira tentativa chegou a
 *   criar o render, a API devolve o mesmo render em vez de cobrar outro.
 *   O upload já feito também é reaproveitado, para o payload ser idêntico.
 *
 * Uma nova solicitação intencional recebe chave nova: depois de uma criação
 * confirmada, ao mudar arquivo/prompt/preset, ao limpar o formulário ou se a
 * API recusar a chave (IDEMPOTENCY_KEY_REUSED).
 */

export type UploadedImage = { url: string; path: string; mimeType: string };

export type CreateRequestInput = {
  file: File;
  prompt: string;
  presetId: string;
};

export type CreateRequestAttempt = CreateRequestInput & {
  clientRequestId: string;
  uploaded: UploadedImage | null;
};

export function generateClientRequestId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  // Fallback (contexto não seguro, ex.: http em IP da rede local).
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
    .slice(6, 8)
    .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

function sameInput(a: CreateRequestInput, b: CreateRequestInput): boolean {
  return a.file === b.file && a.prompt === b.prompt && a.presetId === b.presetId;
}

/**
 * Reaproveita a tentativa pendente (não confirmada) se os dados forem os
 * mesmos; caso contrário inicia uma nova solicitação com chave nova.
 */
export function resolveCreateAttempt(
  pending: CreateRequestAttempt | null,
  input: CreateRequestInput,
  newId: () => string = generateClientRequestId,
): CreateRequestAttempt {
  if (pending && sameInput(pending, input)) {
    return pending;
  }
  return { ...input, clientRequestId: newId(), uploaded: null };
}
