import * as yup from "yup";

const registerCourseToUserSchema = yup.object().shape({
  courseId: yup.string().required(),
});

export default registerCourseToUserSchema;
