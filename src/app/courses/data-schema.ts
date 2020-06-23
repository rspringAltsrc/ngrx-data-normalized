import { schema } from 'normalizr';
import { Course } from './model/course';
import { Lesson } from './model/lesson';
import { User } from './model/user';

export const coursesKey = 'courses';
export const lessonsKey = 'lessons';
export const usersKey = 'users';

const course = new schema.Entity<Course>(coursesKey);
const courses = new schema.Array<Course>(course);
const lesson = new schema.Entity<Lesson>(lessonsKey);
const lessons = new schema.Array<Lesson>(lesson);
const user = new schema.Entity<User>(usersKey);
const users = new schema.Array<User>(user);


course.define({
    lessons
});

lesson.define({
    course,
    author: user
})

export const EntitySchemas = {
    course, courses,
    lesson, lessons,
    user, users
}
