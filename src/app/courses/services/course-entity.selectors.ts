import { createSelector, Store } from '@ngrx/store';
import { CourseEntityName, LessonEntityName } from './course-entity.metadata';
import { Injectable } from '@angular/core';
import { EntitySelectorsFactory, EntityCache } from '@ngrx/data';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { denormalize } from 'normalizr';
import { EntitySchemas } from './data-schema';


@Injectable({
    providedIn: "root"
})
export class CourseSelectors {
    constructor(
        private readonly entitySelectorsFactory: EntitySelectorsFactory,
        private readonly store: Store<EntityCache>
    ) { }

    private setCollectionSelectors() {
        return {
            courseSelectors: this.entitySelectorsFactory.create<Course>(CourseEntityName),
            lessonSelectors: this.entitySelectorsFactory.create<Lesson>(LessonEntityName)
        };
    }

    createSelectCourse = (courseUrl: string) => createSelector(
        this.setCollectionSelectors().courseSelectors.selectEntities,
        (courses) => courses.find(course => course.url == courseUrl)
    );

    createCourseLesson = (courseUrl: string) => createSelector(
        this.createSelectCourse(courseUrl),
        this.setCollectionSelectors().lessonSelectors.selectEntityMap,
        (course, lessons) => {
            const denormalizedCourse = denormalize(
                course,
                EntitySchemas.course,
                {
                    courses: [course],
                    lessons
                }
            ) as Course;
            return denormalizedCourse.lessons;
        }
    );

    selectCourseByUrl$(courseUrl: string) {
        return this.store.select(this.createSelectCourse(courseUrl));
    }

    selectDenormalizedCourse$(courseUrl: string) {
        return this.store.select(this.createCourseLesson(courseUrl));
    }
}