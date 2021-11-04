import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize, first, map } from 'rxjs/operators';

import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';
import { IMovie } from 'src/app/models/movie.interface';

@Component({
  selector: 'app-movie-gallery',
  templateUrl: './movie-gallery.component.html',
  styleUrls: ['./movie-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieGalleryComponent implements OnInit {
  public loading: Boolean = true;
  public error: any;
  public readonly imgUrl: string = environment.IMG_URL + '/w500';

  public movie!: IMovie;
  public images$!: Observable<any>;

  private id!: number;

  constructor(private movieService: MovieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(first()).subscribe(params => this.id = params.id);

    this.movieService.getMovie(this.id)
      .pipe(first(), finalize(() => this.loading = false), catchError(err =>  this.setError(err))).subscribe(movie => this.movie = movie);

    this.images$ = this.movieService.getMovieImages(this.id)
      .pipe(map(images => images.backdrops), catchError(err =>  this.setError(err)));
  }

  private setError(err: any): Observable<any> {
    this.error = err.message;
    return of(err);
  }

}
