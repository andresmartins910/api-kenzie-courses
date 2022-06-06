import app from "../../app";
import supertest from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities";

describe("User Login", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization...", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should return a token if credentials are correct", async () => {
    const userData: Partial<User> = {
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
      password: "123456",
    };

    const credentials: Partial<User> = {
      email: "test@test.com",
      password: "123456",
    };

    await supertest(app).post("/users").send(userData);
    const res = await supertest(app).post("/login").send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should throw an error if credentials are incorrect", async () => {
    const userData: Partial<User> = {
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
      password: "123456",
    };

    const credentials: Partial<User> = {
      email: "test@test.com",
      password: "12345",
    };

    await supertest(app).post("/users").send(userData);
    const res = await supertest(app).post("/login").send(credentials);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
  });
});
