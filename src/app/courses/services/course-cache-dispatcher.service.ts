import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import {
  EntityDispatcherFactory,
  EntityDispatcher,
  MergeStrategy
} from "@ngrx/data";
import { CourseEntityName } from "../course-entity.metadata";
import { of, Subscription, Observable, merge } from "rxjs";
import { delay, map } from "rxjs/operators";
import { EntitySchemas, coursesKey } from '../data-schema';
import { normalize } from 'normalizr';
import { NormalizedType } from 'src/app/utility-types';

@Injectable({
  providedIn: "root"
})
export class CourseCacheDispatcherService {
  courseDispatcher: EntityDispatcher<NormalizedType<Course>>;
  subscriptions = new Subscription();

  broadcast1: Observable<Course | Course[]> = of([
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

  broadcast2 = of(
    {
      id: 4,
      description: "Update2 - NgRx (with NgRx Data) - The Complete Guide",
      longDescription: "This was another just updated from SignalR --- Learn the modern Ngrx Ecosystem, including NgRx Data, Store, Effects, Router Store, Ngrx Entity, and Dev Tools."
    }
  ).pipe(delay(8000));

  broadcast3 = of(
    {
      id: 4,
      description: "Update3 - NgRx (with NgRx Data) - The Complete Guide",
      longDescription: "This was yet another just updated from SignalR --- Learn the modern Ngrx Ecosystem, including NgRx Data, Store, Effects, Router Store, Ngrx Entity, and Dev Tools."
    }
  ).pipe(delay(10000));

  mockSignalRBroadcast = merge(this.broadcast1, this.broadcast2, this.broadcast3);

  constructor(readonly entityDispatcherFactory: EntityDispatcherFactory) {
    this.courseDispatcher = entityDispatcherFactory.create(CourseEntityName);
  }

  subscribeToSignalRUpdates(): void {
    const courseUpsertBroadcasts = this.mockSignalRBroadcast.pipe(
      map(e => Array.isArray(e) ? normalize(e, EntitySchemas.courses) : normalize(e, EntitySchemas.course)),
      map(e => {
        const c = Object.values(e.entities[coursesKey]);
        if (Array.isArray(e.result)) {
          this.courseDispatcher.upsertManyInCache(c);
        } else {
          this.courseDispatcher.upsertOneInCache(c[0]);
        }
      })
    ).subscribe();

    this.subscriptions.add(courseUpsertBroadcasts);
  }

  unSubscribeAll() {
    this.subscriptions.unsubscribe();
  }
}
