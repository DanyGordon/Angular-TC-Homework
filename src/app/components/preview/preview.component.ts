import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent implements OnInit {
  @Input() movie: any;

  @Input() isDetailsPage: Boolean = false;

  public readonly backgrImgUrl = environment.IMG_URL + '/original';

  constructor(private location: Location, private router: Router) { }

  ngOnInit(): void {
  }

  public moveBack(): void {
    this.location.back();
  }

  public setBackgroungImageUrl(backdrop: string, poster: string): string {
    if(!backdrop && !poster) {
      return 'http://localhost:4200/assets/default.jpg';
    }
    return this.backgrImgUrl + (backdrop || poster);
  }

  public goToTrailers() {
    this.router.navigate([`/movie/${this.movie.id}/trailers`]);
  }

}
