import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const ORDER_ACCESS_TOKEN_HEADER = "x-order-access-token";

export function createOrderAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOrderAccessToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function verifyOrderAccessToken(
  suppliedToken: string | null | undefined,
  storedHash: string | null | undefined,
): boolean {
  if (!suppliedToken || !storedHash || !/^[a-f0-9]{64}$/i.test(storedHash)) {
    return false;
  }

  const suppliedHash = Buffer.from(hashOrderAccessToken(suppliedToken), "hex");
  const expectedHash = Buffer.from(storedHash.toLowerCase(), "hex");

  return (
    suppliedHash.length === expectedHash.length &&
    timingSafeEqual(suppliedHash, expectedHash)
  );
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
