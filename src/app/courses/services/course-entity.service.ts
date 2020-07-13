
import { Injectable, OnDestroy } from "@angular/core";
import {
  DefaultDataService,
  HttpUrlGenerator,
  DefaultDataServiceConfig,
  EntityDispatcher,
  EntityDispatcherFactory,
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityOp
} from "@ngrx/data";
import { HttpClient } from "@angular/common/http";
import { Observable, of, merge, Subscription, pipe } from "rxjs";
import { map, tap, delay } from "rxjs/operators";
import { CourseEntityName, LessonEntityName } from "./course-entity.metadata";
import { normalize } from 'normalizr';
import { EntitySchemas, coursesKey } from './data-schema';
import { Lesson } from '../model/lesson';
import { Course } from "../model/course";
import { NormalizedType } from 'src/app/utility-types';
import { LessonCacheDispatcherService } from './lesson-cache-dispatcher.service';
import { upsertUsers } from './user/user-entity.actions';
import { Store } from '@ngrx/store';
import { User } from '../model/user';


//#region mock SignalR broadcasts
const broadcastArray: Observable<Course[]> = of([
  {
    category: "lala",
    url: 'hello-world',
    description: "Hello world",
    longDescription: "This was just (simulated) pushed from SignalR",
    lessons: [9764],
    id: 234234
  },
  // Note, that the missing properties are not altered (nulled out) in the store.
  {
    id: 4,
    description: "Update1 - NgRx (with NgRx Data) - The Complete Guide",
    longDescription: "This was just updated from SignalR --- Learn the modern Ngrx Ecosystem, including NgRx Data, Store, Effects, Router Store, Ngrx Entity, and Dev Tools."
  }
] as Course[]).pipe(delay(5000));

const broadcastSingle1: Observable<Course> = of(
  {
    id: 4,
    description: "Update2 - NgRx (with NgRx Data) - The Complete Guide",
    longDescription: "This was another just updated from SignalR --- Learn the modern Ngrx Ecosystem, including NgRx Data, Store, Effects, Router Store, Ngrx Entity, and Dev Tools."
  } as Course
).pipe(delay(8000));

const broadcastSingle2: Observable<Course> = of(
  {
    id: 4,
    description: "Update3 - NgRx (with NgRx Data) - The Complete Guide",
    longDescription: "This was yet another just updated from SignalR --- Learn the modern Ngrx Ecosystem, including NgRx Data, Store, Effects, Router Store, Ngrx Entity, and Dev Tools.",
    lessons: [
      {
        "id": 13,
        "description": "New Lesson for The Complete Guid",
        "duration": "1:33",
        "seqNo": 7,
        "author": {
          "name": "John",
          "id": 666
        }
      }
    ]
  } as Course
).pipe(delay(10000));

const mockSignalRBroadcastArray = merge(broadcastArray);
const mockSignalRBroadcastSingles = merge(broadcastSingle1, broadcastSingle2);
//#endregion


@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<NormalizedType<Course>> {
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
export class CoursesDataService extends DefaultDataService<Course> implements OnDestroy {
  subscriptions = new Subscription();
  courseDispatcher: EntityDispatcher<NormalizedType<Course>>;
  constructor(
    readonly http: HttpClient,
    readonly httpUrlGenerator: HttpUrlGenerator,
    readonly entityDispatcherFactory: EntityDispatcherFactory,
    readonly lessonDispatcher: LessonCacheDispatcherService,
    readonly store: Store<any>
  ) {
    super(CourseEntityName, http, httpUrlGenerator, courseDataServiceConfig);
    this.courseDispatcher = entityDispatcherFactory.create(CourseEntityName);
  }

  subscribeToSignalRUpdates(): void {
    const courseArrayUpsertBroadcasts = mockSignalRBroadcastArray.pipe(
      this.normalizeAndDispatchCoursesRelatedEntities('Course DataService getAll()'),
      map(e => {
        const c = Object.values(e.entities[coursesKey]);
        if (Array.isArray(e.result)) {
          this.courseDispatcher.upsertManyInCache(c);
        } else {
          this.courseDispatcher.upsertOneInCache(c[0]);
        }
      })
    ).subscribe();

    const courseSingleUpsertBroadcasts = mockSignalRBroadcastSingles.pipe(
      this.normalizeAndDispatchCoursesRelatedEntities('Course DataService getAll()'),
      map(e => {
        const c = Object.values(e.entities[coursesKey]);
        if (Array.isArray(e.result)) {
          this.courseDispatcher.upsertManyInCache(c);
        } else {
          this.courseDispatcher.upsertOneInCache(c[0]);
        }
      })
    ).subscribe();

    this.subscriptions.add(courseArrayUpsertBroadcasts);
    this.subscriptions.add(courseSingleUpsertBroadcasts);
  }

  getAll(): Observable<Course[]> {
    const normalizedCourses = super.getAll().pipe(
      this.normalizeAndDispatchCoursesRelatedEntities('Course DataService getAll()'),
      map(nc => Object.values(nc.entities.courses))
    );

    return normalizedCourses;

  }
  normalizeAndDispatchCoursesRelatedEntities = (tag: string) => pipe(
    map((courses: Course | Course[]) => {
      return Array.isArray(courses) ? this.normalizeCourses(courses) : this.normalizeCourse(courses);
    }),
    tap(nc => {
      this.lessonDispatcher.upsertToCache(nc.entities, tag);
      if (nc.entities.users) {
        this.store.dispatch(upsertUsers({ users: Object.values(nc.entities.users) }));
      }
    })
  );

  public normalizeCourses(courses: Course[]) {
    return normalize(courses, EntitySchemas.courses);
  }

  public normalizeCourse(course: Course) {
    return normalize(course, EntitySchemas.course);
  }

  ngOnDestroy(): void {
    this.unSubscribeAll();
  }

  private unSubscribeAll() {
    this.subscriptions.unsubscribe();
  }
}
