import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { IMovie } from '../models/movie.interface';
import { IMovies } from "../models/movies.interface";
import { IGenres } from "../models/genres.interface";
import { IMovieVideos } from "../models/movie-videos.interface";
import { IMovieImages } from "../models/movie-images.interface";

@Injectable()
export class MovieService {

	constructor(private httpClient: HttpClient) { }

	public getMovies(params?: any): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/discover/movie`, { params });
	}

	public searchMovies(params: any): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/search/movie`, { params });
	}

	public getTopRatedMovies(params?: any): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/movie/top_rated?region=UA`, { params });
	}

	public getUpcomingMovies(params?: any): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/movie/upcoming`, { params });
	}

	public getTrendingMovies(): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/trending/movie/week`);
	}

	public getPopularMovies(): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/movie/popular`);
	}

	public getNowPlayingMovies(): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/movie/now_playing`);
	}

	public getMovie(movieId: number): Observable<IMovie> {
		return this.httpClient.get<IMovie>(`${environment.BASE_URL}/movie/${movieId}`);
	}
	
	public getMovieImages(movieId: number): Observable<IMovieImages> {
		return this.httpClient.get<IMovieImages>(`${environment.BASE_URL}/movie/${movieId}/images`);
	}
	
	public getMovieTrailers(movieId: number): Observable<IMovieVideos> {
		return this.httpClient.get<IMovieVideos>(`${environment.BASE_URL}/movie/${movieId}/videos`);
	}

	public getSimilarMovies(movieId: number): Observable<IMovies> {
		return this.httpClient.get<IMovies>(`${environment.BASE_URL}/movie/${movieId}/similar`);
	}

	public getGenres(): Observable<IGenres> {
		return this.httpClient.get<IGenres>(`${environment.BASE_URL}/genre/movie/list`);
	}
}