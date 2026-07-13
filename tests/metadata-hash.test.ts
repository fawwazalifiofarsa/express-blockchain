import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  generateMetadataHash,
  stableSerializeMetadata,
} from "../src/common/utils/metadata-hash.js";

describe("metadata hashing", () => {
  it("serializes equivalent metadata deterministically", () => {
    const first = {
      serial: 42,
      location: { city: "Jakarta", country: "ID" },
      tags: ["legal", "primary"],
    };
    const reordered = {
      tags: ["legal", "primary"],
      location: { country: "ID", city: "Jakarta" },
      serial: 42,
    };

    assert.equal(
      stableSerializeMetadata(first),
      stableSerializeMetadata(reordered),
    );
    assert.equal(generateMetadataHash(first), generateMetadataHash(reordered));
  });

  it("returns a 32-byte hexadecimal hash", () => {
    assert.match(generateMetadataHash({ serial: 42 }), /^0x[a-f0-9]{64}$/);
  });

  it("changes the hash when metadata changes", () => {
    assert.notEqual(
      generateMetadataHash({ serial: 42 }),
      generateMetadataHash({ serial: 43 }),
    );
  });
});
