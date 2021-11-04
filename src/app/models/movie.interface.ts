import { IGenre } from "./genre.interface";
import { IProductionCountries } from "./prod-countries.interface";

export interface IMovie {
  id: number;
  status: string;
  title: string;
  overview: string;
  genres: IGenre[];
  release_date: string;
  poster_path: string;
  backdrop_path: string,
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  production_countries: IProductionCountries[];
  budget: number;
  revenue: number;
  homepage: string;
}