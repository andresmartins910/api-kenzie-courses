import app from "../../app";
import supertest from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { User } from "../../entities";

describe("Update User Data", () => {
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

  it("should update the user data", async () => {
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

    const dataToUpdate: Partial<User> = {
      firstName: "Another",
      lastName: "Name",
    };

    const res = await supertest(app)
      .patch(`/users/${userResponse.body.id}`)
      .set("Authorization", "Bearer " + tokenResponse.body.token)
      .send(dataToUpdate);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("firstName");
  });
});
