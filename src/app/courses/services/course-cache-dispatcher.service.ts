import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import {
  EntityDispatcherFactory,
  EntityDispatcher
} from "@ngrx/data";
import { CourseEntityName } from "../course-entity.metadata";
import { of, Subscription, Observable } from "rxjs";
import { delay } from "rxjs/operators";
import { INormalizedCourses } from './course-entity.service';

@Injectable({
  providedIn: "root"
})
export class CourseCacheDispatcherService {
  courseDispatcher: EntityDispatcher<Course>;
  subscriptions = new Subscription();

  mockSignalRBroadcast: Observable<Course> = of({
    category: "lala",
    url: 'hello-world',
    description: "Hello world",
    longDescription: "This was just (simulated) pushed from SignalR",
    lessons: [9764],
    id: 234234
  } as Course).pipe(delay(5000));

  constructor(readonly entityDispatcherFactory: EntityDispatcherFactory) {
    this.courseDispatcher = entityDispatcherFactory.create(CourseEntityName);
  }

  subscribeToSignalRUpdates(): void {
    const addOne = this.mockSignalRBroadcast.subscribe(e => {
      this.courseDispatcher.addOneToCache(e);
    });

    this.subscriptions.add(addOne);
  }

  unSubscribeAll() {
    this.subscriptions.unsubscribe();
  }
}
