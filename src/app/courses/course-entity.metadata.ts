import { compareCourses } from "./model/course";
import { EntityMetadataMap } from "@ngrx/data";
import { compareLessons } from "./model/lesson";

export const CourseEntityName = "Course";
export const LessonEntityName = "Lesson";
export const UserEntityName = "User";

export const courseEntityMetadata: EntityMetadataMap = {
  [CourseEntityName]: {
    sortComparer: compareCourses,
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  },
  [LessonEntityName]: {
    sortComparer: compareLessons
  },
  [UserEntityName]: {
    sortComparer: compareLessons
  }
};
