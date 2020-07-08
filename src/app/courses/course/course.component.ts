import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { merge } from "rxjs";
import {
  tap,
  scan
} from "rxjs/operators";
import { CourseSelectors } from '../services/course-entity.selectors';
import { AppEntityServices } from '../services/app-entity-services';

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {
  courseUrl = this.route.snapshot.paramMap.get("courseUrl");

  course$ = this.courseSelectors.selectCourseByUrl$(this.courseUrl).pipe(
    tap(c => {
      if (this.nextPage == 0) {
        this.loadLessonsPage(c);
      }
    })
  );

  loading$ = merge(
    this.appService.lessonService.loading$,
    this.appService.courseService.loading$
  ).pipe(
    scan((a, c) => a && c, false));

  lessons$ = this.courseSelectors.selectDenormalizedCourse$(this.courseUrl);

  displayedColumns = ["seqNo", "description", "duration", "author"];

  nextPage = 0;

  constructor(
    private courseSelectors: CourseSelectors,
    private appService: AppEntityServices,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // This would be handled with a component effect
    this.appService.courseService.getWithQuery({ url: this.courseUrl });
  }

  loadLessonsPage(course: Course) {
    this.appService.lessonService.getWithQuery({
      courseId: course && course.id.toString(),
      pageNumber: this.nextPage.toString(),
      pageSize: "1"
    });

    this.nextPage += 1;
  }
}
