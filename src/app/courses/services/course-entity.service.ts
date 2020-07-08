
import { Injectable } from "@angular/core";
import {
  DefaultDataService,
  HttpUrlGenerator,
  DefaultDataServiceConfig,
  EntityDispatcher,
  EntityDispatcherFactory,
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from "@ngrx/data";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CourseEntityName, LessonEntityName } from "./course-entity.metadata";
import { normalize } from 'normalizr';
import { EntitySchemas } from './data-schema';
import { Lesson } from '../model/lesson';
import { Course } from "../model/course";

// export interface INormalizedCourses  NormalizedType<Course> {
//   entities: {
//     courses: Record<number, Course>,
//     lessons: Record<number, Lesson>
//   };
// }

@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super(CourseEntityName, serviceElementsFactory);
  }

}


const courseDataServiceConfig: DefaultDataServiceConfig = {
  // This is where the api server root path can be set
  // root: 'https://my-api-domain.com/api',

  // These delays are to simulate local server communication delays
  getDelay: 500,
  saveDelay: 500
};

@Injectable()
export class CoursesDataService extends DefaultDataService<Course> {
  lessonDispatcher: EntityDispatcher<Lesson>;
  constructor(
    readonly http: HttpClient,
    readonly httpUrlGenerator: HttpUrlGenerator,
    readonly entityDispatcherFactory: EntityDispatcherFactory
  ) {
    super(CourseEntityName, http, httpUrlGenerator, courseDataServiceConfig);
    this.lessonDispatcher = entityDispatcherFactory.create(LessonEntityName);
  }
  getAll(): Observable<Course[]> {
    const normalizedCourses = super.getAll().pipe(
      map(cs => {
        return this.normalizeCourses(cs);
      }),
      tap(nc => {
        this.lessonDispatcher.addManyToCache(Object.values(nc.entities.lessons));
      }),
      map(nc => Object.values(nc.entities.courses))
    );

    return normalizedCourses;

  }

  public normalizeCourses(courses: Course[]) {
    return normalize(courses, EntitySchemas.courses);
  }
}
