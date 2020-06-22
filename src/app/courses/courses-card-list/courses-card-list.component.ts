import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseEntityService } from '../services/course-entity.service';

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
    private courseService: CourseEntityService) {
  }

  deleteCourse(courseId: number) {

    this.courseService.delete(courseId)
      .subscribe(
        () => console.log("Delete completed"),
        err => console.log("Deleted failed", err)
      );


  }

}









