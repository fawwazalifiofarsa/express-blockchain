import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import express from "express";
import request from "supertest";

import app from "../src/app.js";
import { asyncHandler } from "../src/common/utils/async-handler.js";
import { memoryDatabase } from "../src/database/memory.database.js";
import { errorHandler } from "../src/middleware/error-handler.js";

const validUser = {
  name: "Fawwaz",
  email: "fawwaz@example.com",
  password: "Password123!",
};

describe("authentication API", () => {
  beforeEach(() => {
    memoryDatabase.users.length = 0;
    memoryDatabase.assets.length = 0;
  });

  it("registers a user without exposing the password hash", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send(validUser)
      .expect(201);

    assert.equal(response.body.success, true);
    assert.equal(response.body.message, "User registered successfully");
    assert.equal(response.body.data.email, validUser.email);
    assert.equal("passwordHash" in response.body.data, false);
    assert.equal(memoryDatabase.users.length, 1);
    assert.notEqual(memoryDatabase.users[0].passwordHash, validUser.password);
  });

  it("rejects a duplicate normalized email", async () => {
    await request(app).post("/api/auth/register").send(validUser).expect(201);

    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...validUser, email: " FAWWAZ@EXAMPLE.COM " })
      .expect(409);

    assert.deepEqual(response.body, {
      success: false,
      message: "Email is already registered",
    });
    assert.equal(memoryDatabase.users.length, 1);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(validUser).expect(201);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password })
      .expect(200);

    assert.equal(response.body.success, true);
    assert.equal(response.body.message, "Login successful");
    assert.match(response.body.data.token, /^[^.]+\.[^.]+\.[^.]+$/);
    assert.equal("passwordHash" in response.body.data.user, false);
  });

  it("rejects incorrect login credentials with the standard error envelope", async () => {
    await request(app).post("/api/auth/register").send(validUser).expect(201);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: "Incorrect123!" })
      .expect(401);

    assert.deepEqual(response.body, {
      success: false,
      message: "Invalid email or password",
    });
  });

  it("returns validation errors using the standard error envelope", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ name: "", email: "invalid", password: "weak" })
      .expect(400);

    assert.equal(response.body.success, false);
    assert.equal(response.body.message, "Validation failed");
    assert.ok(response.body.errors.body.fieldErrors);
  });

  it("returns a standard 404 response for unknown routes", async () => {
    const response = await request(app).get("/api/unknown").expect(404);

    assert.deepEqual(response.body, {
      success: false,
      message: "Resource not found",
    });
  });

  it("hides unexpected error details behind the standard 500 envelope", async () => {
    const failingApp = express();
    failingApp.get(
      "/failure",
      asyncHandler(async () => {
        throw new Error("Sensitive internal detail");
      }),
    );
    failingApp.use(errorHandler);

    const originalConsoleError = console.error;
    console.error = () => undefined;

    try {
      const response = await request(failingApp).get("/failure").expect(500);
      assert.deepEqual(response.body, {
        success: false,
        message: "Internal server error",
      });
    } finally {
      console.error = originalConsoleError;
    }
  });
});
