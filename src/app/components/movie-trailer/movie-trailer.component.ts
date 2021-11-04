import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, finalize, first, map, takeUntil } from 'rxjs/operators';

import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';
import { IMovieVideos } from 'src/app/models/movie-videos.interface';

@Component({
  selector: 'app-movie-trailer',
  templateUrl: './movie-trailer.component.html',
  styleUrls: ['./movie-trailer.component.scss']
})
export class MovieTrailerComponent implements OnInit, OnDestroy {
  public loading: Boolean = true;
  public error: any;
  public backgrImgUrl: string = environment.IMG_URL + '/original';
  public trailerUrl: string = 'https://www.youtube.com/embed/';

  public movie$!: Observable<any>;
  public videos!: IMovieVideos;

  private id!: number;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private movieService: MovieService, private route: ActivatedRoute, private location: Location, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => this.id = params.id);
    
    this.movie$ = this.movieService.getMovie(this.id)
      .pipe(finalize(() => this.loading = false), catchError(err => this.setError(err)));

    this.movieService.getMovieTrailers(this.id).pipe(
      first(),
      map(trailers => trailers.results.filter((trailer: any) => trailer.site === 'YouTube').map((trailer: any) => {
        trailer.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.trailerUrl + trailer.key);
        return trailer;
      })),
      catchError(err => this.setError(err))
    ).subscribe(videos => this.videos = videos);
  }

  private setError(err: any): Observable<any> {
    this.error = err.message;
    return of(err);
  }

  public setBackgroungImageUrl(backdrop: string, poster: string): string {
    if(!backdrop && !poster) {
      return 'http://localhost:4200/assets/default.jpg';
    }
    return this.backgrImgUrl + (backdrop || poster);
  }

  public moveBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
