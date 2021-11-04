import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, of, Subject } from 'rxjs';
import { catchError, finalize, first, map, takeUntil } from 'rxjs/operators';

import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
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
  public movies$!: Observable<any>;
  private queryParams!: Params;

  public searchFormControl = new FormControl('', [Validators.required]);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.queryParams = params;
      if(!Object.keys(this.queryParams).length) {
        this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1, query: '' }});
      }
      this.searchFormControl.setValue(this.queryParams.query);
      this.movies$ = this.movieService.searchMovies(this.queryParams)
        .pipe(first(), finalize(() => this.loading = false), catchError(err => this.setError(err)));
    });

    this.topRatedMovie$ = this.movieService.getTopRatedMovies()
      .pipe(map(res => res.results[0]), first(), catchError(err => this.setError(err)));
  }

  public search($event: any) {
    $event.preventDefault();
    if(!this.searchFormControl.valid) {
      this.searchFormControl.markAsTouched();
      return;
    }
    if(this.searchFormControl.value === this.queryParams.query) {
      return;
    }
    
    this.updateQueryParams({ page: 1, query: this.searchFormControl.value })
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
    this.error = err.error.errors[0];
    return of(err);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
