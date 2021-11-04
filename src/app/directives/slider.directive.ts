import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appSlider]'
})
export class SliderDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() viewportSlideCount: number = 4;

  private sliderTrack!: HTMLElement;

  private trackLength!: number;
  private slideWidth!: number;
  private totalSlideCount!: number;
  private currentSlideIndx: number = 0;

  private translateX$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.sliderTrack = this.el.nativeElement.children[0];

    this.translateX$.pipe(takeUntil(this.destroy$))
      .subscribe(translateX => this.sliderTrack.style.transform = `translateX(${translateX}px)`);

    const styles = getComputedStyle(this.sliderTrack.children[0]);
    this.totalSlideCount = this.sliderTrack.children.length;
    this.slideWidth = parseInt(styles.width) + parseInt(styles.marginRight) + parseInt(styles.marginLeft);
    this.trackLength = this.slideWidth * this.totalSlideCount;
    this.currentSlideIndx = 0;
  }

  public nextItem(): void {
    if(this.currentSlideIndx < this.totalSlideCount - this.viewportSlideCount) {
      this.translateX$.next(this.translateX$.getValue() - this.slideWidth);
      this.currentSlideIndx++;
    } else {
      this.translateX$.next(0);
      this.currentSlideIndx = 0;
    }
  }

  public prevItem(): void {
    if(this.currentSlideIndx > 0) {
      this.translateX$.next(this.translateX$.getValue() + this.slideWidth);
      this.currentSlideIndx--;
    } else {
      this.translateX$.next(-this.trackLength + this.viewportSlideCount * this.slideWidth);
      this.currentSlideIndx = this.totalSlideCount - this.viewportSlideCount;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
