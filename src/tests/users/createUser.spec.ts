import app from "../../app";
import supertest from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities";

describe("Create User", () => {
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

  it("should insert a new user into the database if all fields are correct", async () => {
    const userData: Partial<User> = {
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
      password: "123456",
    };

    const res = await supertest(app).post("/users").send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("should throw an error if a field is missing", async () => {
    const userData: Partial<User> = {
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
    };

    const res = await supertest(app).post("/users").send(userData);

    expect(res.status).toBe(400);
  });
});
