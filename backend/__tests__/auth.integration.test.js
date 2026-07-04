const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const authRoutes = require("../routes/auth");
const errorHandler = require("../middleware/errorHandler");

let mongod;
let app;

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret-for-integration-tests";

  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  app.use(errorHandler);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe("POST /api/auth/register", () => {
  test("registers a new user and returns a JWT token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("jane@example.com");
    expect(res.body).not.toHaveProperty("password");
  });

  test("rejects registration with an invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "not-an-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });

  test("rejects registration with a password under 6 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "jane2@example.com",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/password/i);
  });

  test("rejects duplicate email registration", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Jane Doe",
      email: "dupe@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/register").send({
      name: "Someone Else",
      email: "dupe@example.com",
      password: "password456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      name: "Login Test",
      email: "login@example.com",
      password: "correctpassword",
    });
  });

  test("logs in with correct credentials and returns a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "correctpassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("rejects login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  test("rejects login for a non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "whatever123",
    });

    expect(res.status).toBe(401);
  });
});
