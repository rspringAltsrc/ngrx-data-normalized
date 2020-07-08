import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Course } from "../model/course";
import { AppEntityServices } from '../services/app-entity-services';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent {

  @Input()
  courses: Course[];

  constructor(
    private appEntityServices: AppEntityServices) {
  }

  deleteCourse(courseId: number) {

    this.appEntityServices.courseService.delete(courseId)
      .subscribe(
        () => console.log("Delete completed"),
        err => console.log("Deleted failed", err)
      );


  }

}









