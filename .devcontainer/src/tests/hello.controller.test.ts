import request from "supertest";
import app from "../app";

describe("GET /api/hello", () => {
  it("should return a hello message", async () => {
    const res = await request(app).get("/api/hello");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Hello from Dev Container API!" });
  });
});
