import { Injectable, InjectionToken, Inject } from "@angular/core";
import {
  DefaultDataService,
  HttpUrlGenerator,
  DefaultDataServiceConfig,
  EntityDispatcher,
  EntityDispatcherFactory
} from "@ngrx/data";
import { Course } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CourseEntityName, LessonEntityName } from "../course-entity.metadata";
import { INormalizedCourses } from './course-entity.service';
import { normalize } from 'normalizr';
import { EntitySchemas } from '../data-schema';
import { LessonCacheDispatcherService } from './lesson-cache-dispatcher.service';
import { Lesson } from '../model/lesson';

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

  public normalizeCourses(courses: Course[]): INormalizedCourses {
    return normalize(courses, EntitySchemas.courses);
  }

  mapCourse(course: Course) {
    // Here we can manipulate the incoming entity before it's save to the store.
    return { ...course, description: course.description + " lol" };
  }
}
