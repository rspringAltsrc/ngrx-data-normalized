import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { CoursesCardListComponent } from "./courses-card-list/courses-card-list.component";
import { CourseComponent } from "./course/course.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import {
  EntityDataService,
  EntityDefinitionService,
  EntityCacheEffects,
  EntityEffects,
  EntityServices
} from "@ngrx/data";

import { CourseEntityService } from "./services/course-entity.service";
import { CoursesDataService } from "./services/courses-data.service";
import { LessonEntityService } from "./services/lesson-entity.service";
import { courseEntityMetadata, CourseEntityName } from "./course-entity.metadata";
import { CourseCacheDispatcherService } from "./services/course-cache-dispatcher.service";
import { LessonCacheDispatcherService } from './services/lesson-cache-dispatcher.service';
import { CourseEntityEffects } from './services/course-entity.effects';
import { EffectsModule } from '@ngrx/effects';
import { AppEntityServices } from './services/app-entity-services';
import { CourseSelectors } from './services/course-entity.selectors';

export const coursesRoutes: Routes = [
  {
    path: "",
    component: HomeComponent,
    // resolve: {
    //   courses: CoursesResolver
    // }
  },
  {
    path: ":courseUrl",
    component: CourseComponent,
    // resolve: {
    //   courses: CoursesResolver
    // }
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    RouterModule.forChild(coursesRoutes)
  ],
  declarations: [HomeComponent, CoursesCardListComponent, CourseComponent],
  exports: [HomeComponent, CoursesCardListComponent, CourseComponent],
  providers: [
    CourseEntityService,
    LessonEntityService,
    CoursesDataService,
    AppEntityServices,
    CourseSelectors,
    { provide: EntityServices, useExisting: AppEntityServices }
  ]
})
export class CoursesModule {
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
