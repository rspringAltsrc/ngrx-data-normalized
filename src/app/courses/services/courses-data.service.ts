import { Injectable } from "@angular/core";
import {
  DefaultDataService,
  HttpUrlGenerator,
  DefaultDataServiceConfig,
  EntityOp
} from "@ngrx/data";
import { Course } from "../model/course";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, delay } from "rxjs/operators";
import { CourseEntityName } from "../course-entity.metadata";

const courseDataServiceConfig: DefaultDataServiceConfig = {
  // This is where the api server root path can be set
  // root: 'https://my-api-domain.com/api',

  // These delays are to simulate local server communication delays
  getDelay: 500,
  saveDelay: 500
};

@Injectable()
export class CoursesDataService extends DefaultDataService<Course> {
  constructor(
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super(CourseEntityName, http, httpUrlGenerator, courseDataServiceConfig);
  }
  getAll(): Observable<Course[]> {
    return super.getAll().pipe(map(cs => cs.map(c => this.mapCourse(c))));
  }

  mapCourse(course: Course) {
    // Here we can manipulate the incoming entity before it's save to the store.
    return { ...course, description: course.description + " lol" };
  }
}
