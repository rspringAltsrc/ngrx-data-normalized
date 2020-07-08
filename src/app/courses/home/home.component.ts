import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Course } from '../model/course';
import { tap, filter, first } from 'rxjs/operators';
import { AppEntityServices } from '../services/app-entity-services';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  courses$ = this.appEntityServices.courseService.entities$;
  lessons$ = this.appEntityServices.lessonService.entities$;

  loaded$ = this.appEntityServices.courseService.loaded$.pipe(
    tap(loaded => {
      if (!loaded) {
        this.appEntityServices.courseService.getAll();
      }
    }),
    filter(loaded => !!loaded),
    first()
  )

  constructor(
    private appEntityServices: AppEntityServices,
    private courseEntityServices: CourseEntityService) {
  }

  addPrefilledCourse() {
    const prefilledCourse: Course = {
      id: 2657,
      category: "nothin",
      description: "Manually Added",
      longDescription:
        "This is a prefilled course manually added by click using all of the data services.",
    };

    this.courseEntityServices.add(prefilledCourse, { skip: true });
    // Shorthand
    // this.coursesService.addOneToCache(prefilledCourse);
  }

}
