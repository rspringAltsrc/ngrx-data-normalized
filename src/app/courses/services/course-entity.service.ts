import { Injectable } from "@angular/core";
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from "@ngrx/data";
import { Course } from "../model/course";
import { CourseEntityName } from "../course-entity.metadata";
import { Lesson } from '../model/lesson';

export interface INormalizedCourses {
  entities: {
    courses: Record<number, Course>,
    lessons: Record<number, Lesson>
  };
}

@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(CourseEntityName, serviceElementsFactory);
  }

}
