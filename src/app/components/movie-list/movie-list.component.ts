import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, Subject, of } from 'rxjs';
import { catchError, finalize, first, map, takeUntil } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit, OnDestroy {
  @ViewChild('matPaginator') set setPaginator(mp: MatPaginator) {
    if(mp) {
      this.paginator = mp;
      this.paginator.initialized.pipe(takeUntil(this.destroy$)).subscribe(() => {
        if(this.queryParams.page) {
          setTimeout(() => this.paginator.pageIndex = this.queryParams.page - 1)
        } else  {
          setTimeout(() => this.paginator.pageIndex = 0);
        }
      })
    }
  };

  private paginator!: MatPaginator;

  public readonly imgUrl = environment.IMG_URL + '/w500';

  private queryParams: any;

  public loading: Boolean = true;
  public error: any;

  public topRatedMovie$!: Observable<any>;
  public movies$!: Observable<any>;
  public genres$!: Observable<any>;

  public selectedGenres: any;
  public realeseYear: any;
  public includeAdult: boolean = false;
  public voteCount: number = 0;
  public averageVotes: number = 0.5;
  public selectedSort: any;

  private autoTicks = false;
  private showTicks = false;
  private tickInterval = 1;

  public sortOptions = [
    { value: 'popularity.desc', viewValue: 'Sort descending by Popularity (default)' },
    { value: 'release_date.desc', viewValue: 'Sort descending by Release Date' },
    { value: 'release_date.asc', viewValue: 'Sort ascending by Release Date' },
    { value: 'primary_release_date.desc', viewValue: 'Sort descending by Primary Release Date' },
    { value: 'primary_release_date.asc', viewValue: 'Sort ascending by Primary Release Date' },
    { value: 'vote_average.desc', viewValue: 'Sort descending by Vote Average' },
    { value: 'vote_count.decs', viewValue: 'Sort descending by Vote Count' },
    { value: 'revenue.desc', viewValue: 'Sort descending by Revenue' },
  ]

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.queryParams = params;
      this.checkQueryParams();
      this.movies$ = this.movieService.getMovies(this.queryParams)
        .pipe(first(), finalize(() => setTimeout(() => this.loading = false)), catchError(err => this.setError(err)));
    });

    this.topRatedMovie$ = this.movieService.getTopRatedMovies()
      .pipe(map(res => res.results[0]), catchError(err =>  this.setError(err)));

    this.genres$ = this.movieService.getGenres()
      .pipe(map(res => res.genres), first(), catchError(err =>  this.setError(err)));
  }

  public setFilterAndSort($event: any): void {
    $event.preventDefault();
    const params: any = { ...this.queryParams };

    if(this.selectedGenres && this.selectedGenres.length) {
      params['with_genres'] = this.selectedGenres.join(',');
    } else {
      params['with_genres'] = null;
    }

    if(this.realeseYear) {
      params['primary_release_date.gte'] = this.realeseYear;
    } else {
      params['primary_release_date.gte'] = null;
    }

    if(this.includeAdult) {
      params['include_adult'] = this.includeAdult;
    } else {
      params['include_adult'] = null;
    }

    if(this.voteCount && this.voteCount >= 1) {
      params['vote_count.gte'] = this.voteCount;
    } else {
      params['vote_count.gte'] = null;
    }

    if(this.averageVotes && this.averageVotes >= 1) {
      params['vote_average.gte'] = this.averageVotes;
    } else {
      params['vote_average.gte'] = null;
    }

    if(this.selectedSort) {
      params['sort_by'] = this.selectedSort;
    } else {
      params['sort_by'] = null;
    }

    params.page = 1;
    this.paginator.pageIndex = 0
    this.updateQueryParams(params);
  }

  public updateList($event: any): void {
    this.updateQueryParams({ page: $event.pageIndex + 1 });
    this.paginator.pageIndex = $event.pageIndex;
  }

  public getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

  private checkQueryParams(): void {
    if(!Object.keys(this.queryParams).length || this.queryParams['page'] < 1) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1 }});
    } else {
      if(this.queryParams['with_genres']) {
        this.selectedGenres = this.queryParams['with_genres'].split(',').map((id: string) => +id);
      }
  
      if(this.queryParams['primary_release_date.gte']) {
        this.realeseYear = this.queryParams['primary_release_date.gte'];
      }
  
      if(this.queryParams['include_adult']) {
        this.includeAdult = this.queryParams['include_adult'];
      }

      if(this.queryParams['vote_count.gte'] && this.queryParams['vote_count.gte'] >= 1) {
        this.voteCount = this.queryParams['vote_count.gte'];
      }
  
      if(this.queryParams['vote_average.gte'] && this.queryParams['vote_average.gte'] >= 1 && this.queryParams['vote_average.gte'] <= 10) {
        this.averageVotes = this.queryParams['vote_average.gte'];
      }
  
      if(this.queryParams['sort_by'] && this.sortOptions.some(option => option.value === this.queryParams['sort_by'])) {
        this.selectedSort = this.queryParams['sort_by']
      }
    }
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