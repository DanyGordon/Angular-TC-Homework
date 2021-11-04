import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, finalize, map, share, takeUntil } from 'rxjs/operators';

import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  public loading: Boolean = true;
  public error: any;
  public movie$!: Observable<any>;
  public images$!: Observable<any>;
  public relatedMovies$!: Observable<any>;

  public readonly imgUrl = environment.IMG_URL + '/w500';

  private id!: number;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private movieService: MovieService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = params.id;
      this.initObservables();
    });
  }

  private initObservables() {
    this.movie$ = this.movieService.getMovie(this.id)
      .pipe(share(), finalize(() => setTimeout(() => this.loading = false)), catchError(err =>  this.setError(err)));

    this.images$ = this.movieService.getMovieImages(this.id)
      .pipe(map(images => images.backdrops.slice(0, 6)), catchError(err =>  this.setError(err)));

    this.relatedMovies$ = this.movieService.getSimilarMovies(this.id)
      .pipe(map((movies: any) => movies.results), catchError(err =>  this.setError(err)));
  }

  private setError(err: any): Observable<any> {
    this.error = err.message;
    return of(err);
  }

  public setPosterImageUrl(poster: string, backdrop: string): string {
    if(!backdrop && !poster) {
      return 'http://localhost:4200/assets/default.jpg';
    }
    return this.imgUrl + (poster || backdrop);
  }

  public openDetails(id: number): void {
    this.router.navigate([`/movie/${id}`]);
  }

  public goToGallery() {
    this.router.navigate([`/movie/${this.id}/gallery`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
