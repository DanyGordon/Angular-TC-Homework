import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'spreadnames' })
export class SpreadArrayOfNamesPipe implements PipeTransform {
  transform(value: Array<{ name: string }>) {
    return value.map(v => v.name).join(', ');
  }
}