import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { MovieService } from '../../services/movie.service';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public loading: Boolean = true;
  public error: any = null;

  public topRatedMovie$!: Observable<any>;
  public nowPlayingMovies$!: Observable<any>;
  public trendingMovies$!: Observable<any>;
  public popularMovies$!: Observable<any>;

  public readonly imgUrl = environment.IMG_URL + '/w500';

  private loadingLatest: Boolean = false;
  private loadingNowPlaying: Boolean = false;
  private loadingTranding: Boolean = false;
  private loadingPopular: Boolean = false;

  private loadingStateMap = new Map();

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.initializeLoadingStateMap();
    this.topRatedMovie$ = this.movieService.getTopRatedMovies()
      .pipe(map(res => res.results[0]), finalize(() => this.checkLoading('loadingLatest')), catchError(err =>  this.setError(err)))

    this.nowPlayingMovies$ = this.movieService.getNowPlayingMovies()
      .pipe(map(res => res.results.slice(0, 8)), finalize(() => this.checkLoading('loadingNowPlaying')), catchError(err =>  this.setError(err)));
    
    this.trendingMovies$ = this.movieService.getTrendingMovies()
      .pipe(map(res => res.results.slice(0, 8)), finalize(() => this.checkLoading('loadingTranding')), catchError(err =>  this.setError(err)));

    this.popularMovies$ = this.movieService.getPopularMovies()
      .pipe(map(res => res.results.slice(0, 8)), finalize(() => this.checkLoading('loadingPopular')), catchError(err =>  this.setError(err)));
  }

  private checkLoading(current: any): void {
    this.loadingStateMap.get(current)();

    if(this.loadingNowPlaying && this.loadingTranding && this.loadingPopular && this.loadingLatest) {
      this.loading = false;
    } 
  }

  private setError(err: any): Observable<any> {
    this.error = err.message;
    return of(err);
  }

  private initializeLoadingStateMap() {
    this.loadingStateMap
      .set('loadingLatest', () => this.loadingLatest = true)
      .set('loadingNowPlaying', () => this.loadingNowPlaying = true)
      .set('loadingTranding', () => this.loadingTranding = true)
      .set('loadingPopular', () => this.loadingPopular = true);
  }
}