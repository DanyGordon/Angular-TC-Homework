import { SafeResourceUrl } from "@angular/platform-browser";

export interface IMovieVideos {
  id: number;
  results: IMovieVideo[];
}

interface IMovieVideo {
  site: string;
  key: string;
  url?: SafeResourceUrl
}