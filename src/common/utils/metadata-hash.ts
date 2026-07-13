import { createHash } from "node:crypto";

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [key: string]: JsonValue };

function normalizeJson(value: unknown): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Metadata numbers must be finite");
    }

    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeJson);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) =>
          left < right ? -1 : left > right ? 1 : 0,
        )
        .map(([key, entryValue]) => [key, normalizeJson(entryValue)]),
    );
  }

  throw new TypeError("Metadata must contain only JSON-compatible values");
}

export function stableSerializeMetadata(
  metadata: Record<string, unknown>,
): string {
  return JSON.stringify(normalizeJson(metadata));
}

export function generateMetadataHash(
  metadata: Record<string, unknown>,
): string {
  const serializedMetadata = stableSerializeMetadata(metadata);
  return `0x${createHash("sha256").update(serializedMetadata).digest("hex")}`;
}
