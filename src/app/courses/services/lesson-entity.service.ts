import { Injectable } from "@angular/core";
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  QueryParams,
  EntityActionOptions
} from "@ngrx/data";
import { Lesson } from "../model/lesson";
import { LessonEntityName } from "./course-entity.metadata";
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { User } from '../model/user';
export interface INormalizedLessons {
  entities: {
    courses: Record<number, Course>,
    users: Record<number, User>
  };
}
@Injectable()
export class LessonEntityService extends EntityCollectionServiceBase<Lesson> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory
  ) {
    super('Lesson', serviceElementsFactory);
  }

}
