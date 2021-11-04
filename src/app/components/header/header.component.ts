import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('searcher') searcher!: ElementRef;

  public search: any; 

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public isActive(path: string): Boolean {
    const url = this.router.url.split('/');
    const queryParamsIndx = url.findIndex(segment => segment.includes('?'));
    const urlToMatch = queryParamsIndx === -1 
      ? url.join('/') 
      : url.map((segment, indx) => indx === queryParamsIndx ? segment.slice(0, segment.indexOf('?')) : segment).join('/');
    return urlToMatch === path;
  }

  public searchMovie() {
    if(!this.search) {
      return;
    }

    this.router.navigate([`/search`], { queryParams: { page: 1, query: this.search } });

    this.search = '';

    this.searcher.nativeElement.blur();
  }

}
