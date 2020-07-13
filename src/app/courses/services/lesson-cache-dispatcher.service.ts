import { Injectable } from "@angular/core";
import {
  EntityDispatcherFactory,
  EntityDispatcher,
  EntityActionOptions,
  MergeStrategy,
  EntityOp
} from "@ngrx/data";
import { LessonEntityName } from "./course-entity.metadata";
import { of, Subscription, Observable, pipe } from "rxjs";
import { delay, map, tap } from "rxjs/operators";
import { Lesson } from '../model/lesson';
import { Store } from '@ngrx/store';
import { normalize } from 'normalizr';
import { EntitySchemas, lessonsKey } from './data-schema';
import { upsertUsers } from './user/user-entity.actions';

const mockSignalRBroadcast: Observable<Lesson> = of({
  id: 9764,
  author: {
    id: 9999,
    name: 'Roger'
  },
  course: {
    id: 234234
  },
  description: 'How to dispatch data',
  duration: '1:10',
  seqNo: 1
} as Lesson).pipe(delay(7000));

@Injectable({
  providedIn: "root"
})
export class LessonCacheDispatcherService {
  lessonDispatcher: EntityDispatcher<Lesson>;
  subscriptions = new Subscription();

  constructor(
    readonly entityDispatcherFactory: EntityDispatcherFactory,
    readonly store: Store<any>
  ) {
    this.lessonDispatcher = entityDispatcherFactory.create(LessonEntityName);
  }

  /** Used post normalization */
  upsertToCache(entities: any | Lesson[], tag: string) {
    if (entities.lessons) {
      const lessons = Object.values(entities.lessons);
      this.lessonDispatcher.createAndDispatch(EntityOp.UPSERT_MANY, lessons, { tag: `Lessons ${tag}` })
    }
  }



  subscribeToSignalRUpdates(): void {
    const addOne = mockSignalRBroadcast.pipe(
      this.normalizeAndDispatchLessonRelatedEntities('Lesson DataService SignalR push'),
      map(e => {
        const c = Object.values(e.entities[lessonsKey]);
        if (Array.isArray(e.result)) {
          this.lessonDispatcher.upsertManyInCache(c, {
            mergeStrategy: MergeStrategy.OverwriteChanges
          });
        } else {
          this.lessonDispatcher.upsertOneInCache(c[0], {
            mergeStrategy: MergeStrategy.OverwriteChanges
          });
        }
      })
    ).subscribe();

    this.subscriptions.add(addOne);
  }

  normalizeAndDispatchLessonRelatedEntities = (tag: string) => pipe(
    map((lessons: Lesson | Lesson[]) => {
      return Array.isArray(lessons) ? this.normalizeLessons(lessons) : this.normalizeLesson(lessons);
    }),
    tap(nc => {
      this.upsertToCache(nc.entities, tag);
      if (nc.entities.users) {
        this.store.dispatch(upsertUsers({ users: Object.values(nc.entities.users) }));
      }
    })
  );

  public normalizeLessons(lessons: Lesson[]) {
    return normalize(lessons, EntitySchemas.lessons);
  }

  public normalizeLesson(lesson: Lesson) {
    return normalize(lesson, EntitySchemas.lesson);
  }
  unSubscribeAll() {
    this.subscriptions.unsubscribe();
  }
}
