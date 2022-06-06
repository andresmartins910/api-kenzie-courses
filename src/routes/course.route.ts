import { Router } from "express";
import { courseController } from "../controllers";
import {
  validateSchema,
  validateToken,
  verifyPermission,
} from "../middlewares";
import {
  courseSchema,
  courseUpdateSchema,
  registerCourseToUserSchema,
} from "../schemas";

const courseRouter = Router();

courseRouter.get("/courses", validateToken, courseController.readAll);
courseRouter.post(
  "/courses",
  validateToken,
  verifyPermission,
  validateSchema(courseSchema),
  courseController.createCourse
);
courseRouter.post(
  "/courses/register",
  validateToken,
  verifyPermission,
  validateSchema(registerCourseToUserSchema),
  courseController.registerCourseToUser
);
courseRouter.patch(
  "/courses/:id",
  validateToken,
  verifyPermission,
  validateSchema(courseUpdateSchema),
  courseController.updateCourse
);

export default courseRouter;
