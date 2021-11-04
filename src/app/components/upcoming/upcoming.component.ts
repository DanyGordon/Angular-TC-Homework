import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, first, map, takeUntil } from 'rxjs/operators';

import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class UpcomingComponent implements OnInit, OnDestroy {
  @ViewChild('matPaginator') set setPaginator(mp: MatPaginator) {
    if(mp) {
      this.paginator = mp;
      if(this.queryParams.page) {
        setTimeout(() => this.paginator.pageIndex = this.queryParams.page - 1);
      } else  {
        setTimeout(() => this.paginator.pageIndex = 0);
      }
    }
  };

  public loading: Boolean = true;
  public error: any;
  public imgUrl: string = environment.IMG_URL + '/w500';

  private paginator!: MatPaginator;

  public topRatedMovie$!: Observable<any>;
  public upcomingMovies$!: Observable<any>;

  private queryParams!: Params;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.queryParams = params;
      if(!Object.keys(this.queryParams).length) {
        this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1 }});
      }
      
      this.upcomingMovies$ = this.movieService.getUpcomingMovies(this.queryParams)
        .pipe(first(), finalize(() => setTimeout(() => this.loading = false)), catchError(err => this.setError(err)));
    });

    this.topRatedMovie$ = this.movieService.getTopRatedMovies()
      .pipe(map(res => res.results[0]), first(), catchError(err => this.setError(err)));
  }

  public updateList($event: any): void {
    this.updateQueryParams({ page: $event.pageIndex + 1 });
    this.paginator.pageIndex = $event.pageIndex;
  }

  private updateQueryParams(patch: any): void {
    this.loading = true;
    this.router.navigate([], { relativeTo: this.route, queryParams: { ...this.queryParams, ...patch }});
  }

  private setError(err: any): Observable<any> {
    this.error = err.message;
    return of(err);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
