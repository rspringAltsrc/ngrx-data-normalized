import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { map, tap, filter, first } from 'rxjs/operators';
import { CourseEntityService } from '../services/course-entity.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  courses$ = this.coursesService.entities$;

  loaded$ = this.coursesService.loaded$.pipe(
    tap(loaded => {
      if (!loaded) {
        this.coursesService.getAll();
      }
    }),
    filter(loaded => !!loaded),
    first()
  )

  constructor(
    private coursesService: CourseEntityService) {
  }

  addPrefilledCourse() {
    const prefilledCourse: Course = {
      id: 2657,
      category: "nothin",
      description: "Manually Added",
      longDescription:
        "This is a prefilled course manually added by click using all of the data services.",
    };

    this.coursesService.add(prefilledCourse, { skip: true });
    // Shorthand
    // this.coursesService.addOneToCache(prefilledCourse);
  }

}
