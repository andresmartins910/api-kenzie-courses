import app from "../../app";
import supertest from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities";

describe("Get All Users", () => {
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

  it("should return all users from database", async () => {
    const userData: Partial<User> = {
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
      password: "123456",
      isAdm: true,
    };

    const userResponse = await supertest(app).post("/users").send(userData);

    const credentials: Partial<User> = {
      email: "test@test.com",
      password: "123456",
    };

    const tokenResponse = await supertest(app).post("/login").send(credentials);

    const res = await supertest(app)
      .get(`/users`)
      .set("Authorization", "Bearer " + tokenResponse.body.token);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([]));
  });
});
