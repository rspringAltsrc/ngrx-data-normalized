import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import {
  EntityDispatcherFactory,
  EntityDispatcher
} from "@ngrx/data";
import { CourseEntityName } from "../course-entity.metadata";
import { of, Subscription } from "rxjs";
import { delay, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CourseCacheDispatcherService {
  courseDispatcher: EntityDispatcher<Course>;
  subscriptions = new Subscription();

  mockSignalRBroadcast = of({
    category: "lala",
    description: "Hello world",
    longDescription: "This was just (simulated) pushed from SignalR",
    id: 234234
  }).pipe(delay(5000));

  constructor(readonly entityDispatcherFactory: EntityDispatcherFactory) {
    this.courseDispatcher = entityDispatcherFactory.create(CourseEntityName);
  }

  init(): void {
    this.subscribeToSignalR();
  }

  subscribeToSignalR() {
    const addOne = this.mockSignalRBroadcast.subscribe(e => {
      this.courseDispatcher.addOneToCache(e);
    });

    this.subscriptions.add(addOne);
  }
  unSubscribeAll() {
    this.subscriptions.unsubscribe();
  }
}
