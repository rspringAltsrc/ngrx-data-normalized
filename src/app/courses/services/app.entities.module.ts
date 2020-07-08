import { NgModule } from "@angular/core";
import {
    EntityDataService,
    EntityDefinitionService,
    EntityServices
} from "@ngrx/data";

import { courseEntityMetadata, CourseEntityName } from "./course-entity.metadata";
import { CourseCacheDispatcherService } from "./course-cache-dispatcher.service";
import { LessonCacheDispatcherService } from './lesson-cache-dispatcher.service';
import { AppEntityServices } from './app-entity-services';
import { LessonEntityService } from './lesson-entity.service';
import { CourseSelectors } from './course-entity.selectors';
import { CourseEntityService, CoursesDataService } from './course-entity.service';



@NgModule({
    providers: [
        LessonEntityService,
        CourseEntityService,
        CoursesDataService,
        AppEntityServices,
        CourseSelectors,
        { provide: EntityServices, useExisting: AppEntityServices }
    ]
})
export class AppEntitiesModule {
    constructor(
        eds: EntityDefinitionService,
        entityDataService: EntityDataService,
        coursesDataService: CoursesDataService,
        courseCacheDispatcherService: CourseCacheDispatcherService,
        lessonCacheDispatcherService: LessonCacheDispatcherService
    ) {
        eds.registerMetadataMap(courseEntityMetadata);

        entityDataService.registerService(CourseEntityName, coursesDataService);

        courseCacheDispatcherService.subscribeToSignalRUpdates();
        lessonCacheDispatcherService.subscribeToSignalRUpdates();
    }
}
