/**
 * Executado com `pnpm test` (node:test + type stripping nativo do Node >= 22.18).
 * Testa apenas lógica pura: sem DOM, rede ou API real.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  generateClientRequestId,
  resolveCreateAttempt,
} from "./create-request.ts";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function counterIds() {
  let n = 0;
  return () => `key-${++n}`;
}

test("nova solicitação gera chave nova e ainda sem upload", () => {
  const file = new File(["a"], "a.png");
  const attempt = resolveCreateAttempt(
    null,
    { file, prompt: "p", presetId: "daylight_9am" },
    counterIds(),
  );
  assert.equal(attempt.clientRequestId, "key-1");
  assert.equal(attempt.uploaded, null);
});

test("retry com os mesmos dados reutiliza a mesma chave e o upload", () => {
  const file = new File(["a"], "a.png");
  const newId = counterIds();
  const first = resolveCreateAttempt(
    null,
    { file, prompt: "p", presetId: "daylight_9am" },
    newId,
  );
  first.uploaded = { url: "u", path: "p", mimeType: "image/png" };

  const retry = resolveCreateAttempt(
    first,
    { file, prompt: "p", presetId: "daylight_9am" },
    newId,
  );

  assert.equal(retry, first);
  assert.equal(retry.clientRequestId, "key-1");
  assert.deepEqual(retry.uploaded, first.uploaded);
});

test("arquivo, prompt ou preset diferente => nova solicitação", () => {
  const file = new File(["a"], "a.png");
  const newId = counterIds();
  const pending = resolveCreateAttempt(
    null,
    { file, prompt: "p", presetId: "x" },
    newId,
  );
  pending.uploaded = { url: "u", path: "p", mimeType: "image/png" };

  const changes = [
    { file, prompt: "outro", presetId: "x" },
    { file, prompt: "p", presetId: "y" },
    // mesmo conteúdo, mas outro File: o usuário selecionou de novo
    { file: new File(["a"], "a.png"), prompt: "p", presetId: "x" },
  ];

  for (const input of changes) {
    const next = resolveCreateAttempt(pending, input, newId);
    assert.notEqual(next.clientRequestId, pending.clientRequestId);
    assert.equal(next.uploaded, null);
  }
});

test("depois de criação confirmada (pending = null) os mesmos dados recebem outra chave", () => {
  const file = new File(["a"], "a.png");
  const newId = counterIds();
  const input = { file, prompt: "p", presetId: "x" };
  const a = resolveCreateAttempt(null, input, newId);
  const b = resolveCreateAttempt(null, input, newId);
  assert.notEqual(a.clientRequestId, b.clientRequestId);
});

test("generateClientRequestId gera UUID v4 único e dentro do limite da API (128)", () => {
  const ids = new Set(
    Array.from({ length: 1000 }, () => generateClientRequestId()),
  );
  assert.equal(ids.size, 1000);
  for (const id of ids) {
    assert.match(id, UUID_V4);
    assert.ok(id.length <= 128);
  }
});

test("generateClientRequestId funciona sem crypto.randomUUID (contexto não seguro)", () => {
  const cryptoObj = globalThis.crypto as { randomUUID?: unknown };
  const original = cryptoObj.randomUUID;
  cryptoObj.randomUUID = undefined;
  try {
    assert.match(generateClientRequestId(), UUID_V4);
  } finally {
    cryptoObj.randomUUID = original;
  }
});
