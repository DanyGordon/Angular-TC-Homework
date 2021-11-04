import { IMovie } from "./movie.interface";

export interface IMovies {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}