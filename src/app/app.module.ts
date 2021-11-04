import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './routing/app-routing.module';
import { MaterailModules } from './shared/materials';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { SearchComponent } from './components/search/search.component';
import { TopRatedComponent } from './components/top-rated/top-rated.component';
import { UpcomingComponent } from './components/upcoming/upcoming.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieTrailerComponent } from './components/movie-trailer/movie-trailer.component';
import { MovieGalleryComponent } from './components/movie-gallery/movie-gallery.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PreviewComponent } from './components/preview/preview.component';

import { SliderDirective } from './directives/slider.directive';

import { MovieService } from './services/movie.service';
import { ApiInterceptor } from './interceptors/api.interceptor';

import { SpreadArrayOfNamesPipe } from './pipes/spread-array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MovieListComponent,
    MovieDetailsComponent,
    MovieTrailerComponent,
    PreviewComponent,
    LoaderComponent,
    MovieGalleryComponent,
    SearchComponent,
    TopRatedComponent,
    UpcomingComponent,
    SliderDirective,
    SpreadArrayOfNamesPipe,
    CarouselComponent,
    ErrorMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterailModules
  ],
  providers: [
    MovieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
