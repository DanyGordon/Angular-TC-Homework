import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SliderDirective } from 'src/app/directives/slider.directive';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @ViewChild(SliderDirective) private sliderDirective!: SliderDirective;

  @Input() totalItem: number = 1;

  @Input() activeItemCount: number = 1;
  
  constructor() { }

  ngOnInit(): void {
  }

  public nextSlide(): void {
    this.sliderDirective.nextItem();
  }

  public prevSlide(): void {
    this.sliderDirective.prevItem();
  }
}
