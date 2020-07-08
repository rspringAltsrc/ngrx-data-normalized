import { Injectable } from "@angular/core";
import {
  EntityDispatcherFactory,
  EntityDispatcher,
  EntityActionOptions,
  MergeStrategy
} from "@ngrx/data";
import { LessonEntityName } from "../course-entity.metadata";
import { of, Subscription, Observable } from "rxjs";
import { delay } from "rxjs/operators";
import { Lesson } from '../model/lesson';

@Injectable({
  providedIn: "root"
})
export class LessonCacheDispatcherService {
  lessonDispatcher: EntityDispatcher<Lesson>;
  subscriptions = new Subscription();

  mockSignalRBroadcast: Observable<Lesson> = of({
    id: 9764,
    author: {
      id: 9999
    },
    course: {
      id: 234234
    },
    description: 'How to dispatch data',
    duration: '1:10',
    seqNo: 1
  } as Lesson).pipe(delay(7000));

  constructor(readonly entityDispatcherFactory: EntityDispatcherFactory) {
    this.lessonDispatcher = entityDispatcherFactory.create(LessonEntityName);
  }

  subscribeToSignalRUpdates(): void {
    const addOne = this.mockSignalRBroadcast.subscribe(e => {
      this.lessonDispatcher.addOneToCache(e, {
        mergeStrategy: MergeStrategy.OverwriteChanges
      });
    });

    this.subscriptions.add(addOne);
  }

  unSubscribeAll() {
    this.subscriptions.unsubscribe();
  }
}
