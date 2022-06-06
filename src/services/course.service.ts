import { Request } from "express";
import { courseRepository, userRepository } from "../repositories";
import { AssertsShape } from "yup/lib/object";
import { Course } from "../entities";
import {
  serializedAdminCoursesSchema,
  serializedCourseSchema,
  serializedStudentsCoursesSchema,
} from "../schemas";
import mailerService from "./mailer.service";

class CourseService {
  createCourse = async ({ validated }: Request): Promise<AssertsShape<any>> => {
    const course = await courseRepository.save(validated as Course);
    return await serializedCourseSchema.validate(course, {
      stripUnknown: true,
    });
  };

  readAllCourses = async ({ decoded }): Promise<AssertsShape<any>> => {
    let newList = [];
    const courses = await courseRepository.listAll();
    const loggedUser = await userRepository.retrieve({ id: decoded.id });
    if (loggedUser.isAdm) {
      for (const element of courses) {
        newList.push({
          id: element.id,
          courseName: element.courseName,
          duration: element.duration,
          students: await element.students,
        });
      }
      return await serializedAdminCoursesSchema.validate(newList, {
        stripUnknown: true,
      });
    }
    return await serializedStudentsCoursesSchema.validate(courses, {
      stripUnknown: true,
    });
  };

  updateCourse = async ({ validated, params }): Promise<AssertsShape<any>> => {
    const course = await courseRepository.update(params.id, {
      ...(validated as Course),
    });
    const updatedCourse = await courseRepository.retrieve({ id: params.id });
    return await serializedCourseSchema.validate(updatedCourse, {
      stripUnknown: true,
    });
  };

  registerCourseToUser = async ({
    validated,
    decoded,
  }): Promise<AssertsShape<any>> => {
    const { courseId } = validated;

    const course = await courseRepository.retrieve({ id: courseId });
    const user = await userRepository.retrieve({ id: decoded.id });

    course.students = [...course.students, user];

    await courseRepository.save(course);

    const emailStructure = {
      from: "sender@email.com",
      to: `${user.email}`,
      subject: "Registration confirmation",
      text: `Hi, ${user.firstName} ${user.lastName}!\nYou were successfully registered to the ${course.courseName} course.`,
    };

    mailerService.confirmationEmail(emailStructure);

    return {
      message: `${user.firstName} ${user.lastName} was successfully registered to the ${course.courseName} course. A confirmation e-mail was sent.`,
    };
  };
}

export default new CourseService();
