import app from "../../app";
import supertest from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Course, User } from "../../entities";

describe("Register A New Course", () => {
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

  it("should register a new course into database", async () => {
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

    const courseData: Partial<Course> = {
      courseName: "Javascript",
      duration: "3 months",
    };

    const res = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + tokenResponse.body.token)
      .send(courseData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
