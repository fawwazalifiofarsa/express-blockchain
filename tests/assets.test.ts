import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import request from "supertest";

import app from "../src/app.js";
import { memoryDatabase } from "../src/database/memory.database.js";

const user = {
  name: "Asset Owner",
  email: "owner@example.com",
  password: "Password123!",
};

async function registerAndLogin(): Promise<{ token: string; userId: string }> {
  const registration = await request(app)
    .post("/api/auth/register")
    .send(user)
    .expect(201);
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email: user.email, password: user.password })
    .expect(200);

  return {
    token: login.body.data.token,
    userId: registration.body.data.id,
  };
}

describe("asset API", () => {
  beforeEach(() => {
    memoryDatabase.users.length = 0;
    memoryDatabase.assets.length = 0;
  });

  it("rejects asset creation without a JWT", async () => {
    const response = await request(app)
      .post("/api/assets")
      .send({ name: "Certificate", metadata: {} })
      .expect(401);

    assert.deepEqual(response.body, {
      success: false,
      message: "Authentication required",
    });
  });

  it("registers an asset owned by the authenticated user", async () => {
    const { token, userId } = await registerAndLogin();
    const response = await request(app)
      .post("/api/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Certificate",
        description: "Ownership certificate",
        metadata: { serial: 42 },
      })
      .expect(201);

    assert.equal(response.body.data.ownerId, userId);
    assert.equal(response.body.data.blockchainStatus, "registered");
    assert.match(response.body.data.metadataHash, /^0x[a-f0-9]{64}$/);
    assert.match(response.body.data.transactionHash, /^0x[a-f0-9]{64}$/);
    assert.equal(memoryDatabase.assets.length, 1);
  });

  it("fetches all assets", async () => {
    const { token } = await registerAndLogin();
    await request(app)
      .post("/api/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Certificate", metadata: { serial: 42 } })
      .expect(201);

    const response = await request(app).get("/api/assets").expect(200);

    assert.equal(response.body.success, true);
    assert.equal(response.body.data.length, 1);
    assert.equal(response.body.data[0].name, "Certificate");
  });

  it("fetches one asset by ID", async () => {
    const { token } = await registerAndLogin();
    const created = await request(app)
      .post("/api/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Certificate", metadata: { serial: 42 } })
      .expect(201);

    const response = await request(app)
      .get(`/api/assets/${created.body.data.id}`)
      .expect(200);

    assert.equal(response.body.data.id, created.body.data.id);
  });

  it("returns 404 for an unknown asset", async () => {
    const response = await request(app)
      .get("/api/assets/00000000-0000-4000-8000-000000000000")
      .expect(404);

    assert.deepEqual(response.body, {
      success: false,
      message: "Asset not found",
    });
  });

  it("rejects client-controlled ownership", async () => {
    const { token } = await registerAndLogin();
    const response = await request(app)
      .post("/api/assets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Certificate",
        metadata: {},
        ownerId: "00000000-0000-4000-8000-000000000000",
      })
      .expect(400);

    assert.equal(response.body.success, false);
    assert.equal(response.body.message, "Validation failed");
    assert.equal(memoryDatabase.assets.length, 0);
  });
});
