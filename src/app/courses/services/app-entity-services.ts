import { Injectable } from '@angular/core';
import { EntityServicesBase, EntityServicesElements } from '@ngrx/data';
import { CourseEntityService } from './course-entity.service';
import { LessonEntityService } from './lesson-entity.service';
import { Lesson } from '../model/lesson';
import { LessonEntityName, CourseEntityName } from './course-entity.metadata';
import { Course } from '../model/course';

@Injectable()
export class AppEntityServices extends EntityServicesBase {
    constructor(
        elements: EntityServicesElements,

        // Inject custom services, register them with the EntityServices, and expose in API.
        readonly courseEntityService: CourseEntityService,
        readonly lessonEntityService: LessonEntityService
    ) {
        super(elements);
        this.registerEntityCollectionServices([courseEntityService, lessonEntityService]);
    }

    /** get the (default) Lessons service */
    get lessonService() {
        return this.getEntityCollectionService<Lesson>(LessonEntityName);
    }
    get courseService() {
        return this.getEntityCollectionService<Course>(CourseEntityName);
    }
}