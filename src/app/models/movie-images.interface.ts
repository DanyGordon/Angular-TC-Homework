export interface IMovieImages {
  id: number;
  posters: IMovieImage[];
  backdrops: IMovieImage[];
}

interface IMovieImage {
  file_path: string;
}