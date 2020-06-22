import { Course } from "./course";
import { User } from "./user";


export interface Lesson {
    id: number;
    description: string;
    duration: string;
    seqNo: number;
    course: Course;
    author: User;
}


export function compareLessons(l1:Lesson, l2: Lesson) {

  const compareCourses = l1.course.id - l2.course.id;

  if (compareCourses > 0) {
    return 1;
  }
  else if (compareCourses < 0){
    return -1;
  }
  else {
    return l1.seqNo - l2.seqNo;
  }

}
