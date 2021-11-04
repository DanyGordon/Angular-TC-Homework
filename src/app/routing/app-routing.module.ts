import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { SearchComponent } from '../components/search/search.component';
import { MovieListComponent } from '../components/movie-list/movie-list.component';
import { MovieDetailsComponent } from '../components/movie-details/movie-details.component';
import { MovieTrailerComponent } from '../components/movie-trailer/movie-trailer.component';
import { MovieGalleryComponent } from '../components/movie-gallery/movie-gallery.component';
import { UpcomingComponent } from '../components/upcoming/upcoming.component';
import { TopRatedComponent } from '../components/top-rated/top-rated.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'movie', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'movie/:id/trailer', component: MovieTrailerComponent },
  { path: 'movie/:id/gallery', component: MovieGalleryComponent },
  { path: 'top-rated', component: TopRatedComponent },
  { path: 'upcoming', component: UpcomingComponent },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }