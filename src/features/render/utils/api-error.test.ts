/**
 * Executado com `pnpm test` (node:test). Usa Response nativo do Node; sem rede.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  ApiError,
  IDEMPOTENCY_KEY_REUSED,
  RENDER_PROCESSING,
  isApiErrorCode,
  isTransientError,
  parseApiResponse,
} from "./api-error.ts";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status });
}

async function rejection(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (err) {
    assert.ok(err instanceof ApiError);
    return err;
  }
  throw new Error("esperava rejeição");
}

test("2xx devolve o corpo", async () => {
  assert.deepEqual(await parseApiResponse(json(201, { id: "r1" }), "fb"), {
    id: "r1",
  });
});

test("409 RENDER_PROCESSING vira ApiError com status, code e mensagem amigável", async () => {
  const err = await rejection(
    parseApiResponse(
      json(409, {
        statusCode: 409,
        code: RENDER_PROCESSING,
        message: "Render em processamento não pode ser removido.",
      }),
      "fb",
    ),
  );
  assert.equal(err.status, 409);
  assert.equal(err.code, RENDER_PROCESSING);
  assert.match(err.message, /ainda está sendo gerado/);
  assert.ok(isApiErrorCode(err, RENDER_PROCESSING));
  assert.equal(isTransientError(err), false);
});

test("409 IDEMPOTENCY_KEY_REUSED tem mensagem amigável e não é repetido", async () => {
  const err = await rejection(
    parseApiResponse(json(409, { code: IDEMPOTENCY_KEY_REUSED, message: "x" }), "fb"),
  );
  assert.equal(err.code, IDEMPOTENCY_KEY_REUSED);
  assert.match(err.message, /gerar novamente/);
  assert.equal(isTransientError(err), false);
});

test("mensagens de validação em array são unidas; sem corpo usa o fallback", async () => {
  const validation = await rejection(
    parseApiResponse(json(400, { message: ["a", "b"] }), "fb"),
  );
  assert.equal(validation.message, "a b");
  assert.equal(validation.code, null);

  const empty = await rejection(
    parseApiResponse(new Response("", { status: 500 }), "fb"),
  );
  assert.equal(empty.message, "fb");
});

test("corpo texto (não JSON) vira a mensagem", async () => {
  const err = await rejection(
    parseApiResponse(new Response("Bad Gateway", { status: 502 }), "fb"),
  );
  assert.equal(err.message, "Bad Gateway");
  assert.equal(err.status, 502);
});

test("transitórios: falha de rede e 408/502/503/504; demais não", () => {
  assert.ok(isTransientError(new TypeError("fetch failed")));
  for (const status of [408, 502, 503, 504]) {
    assert.ok(isTransientError(new ApiError(status, "x")), String(status));
  }
  for (const status of [400, 401, 403, 404, 409, 500]) {
    assert.equal(isTransientError(new ApiError(status, "x")), false, String(status));
  }
  assert.equal(isTransientError(new Error("x")), false);
});
