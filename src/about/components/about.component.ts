import {Component} from 'angular2/core';

import {CORE_DIRECTIVES} from 'angular2/common';
import {DROPDOWN_DIRECTIVES} from '../../bootstrap/components/dropdown';

@Component({
  selector: 'sd-about',
  templateUrl: './about/components/about.component.html',
  styleUrls:  ['./about/components/about.component.css'],

  directives: [DROPDOWN_DIRECTIVES, CORE_DIRECTIVES]
})

export class AboutComponent {

  public disabled:boolean = false;
  public status:{isopen:boolean} = {isopen: false};
  public items:Array<string> = ['The first choice!',
    'And another choice for you.', 'but wait! A third!'];

  public toggled(open:boolean):void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event:MouseEvent):void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

}
