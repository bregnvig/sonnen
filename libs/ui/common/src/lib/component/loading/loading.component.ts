import { Component } from '@angular/core';


@Component({
  selector: 'common-loading',
  template: `
    <div>
      <!--      <img ngSrc="sunflower-frame-2.svg" height="120" width="120" alt="Indlæser">-->
      <img src="sunflower-bundle-4.svg" alt="Indlæser">
    </div>
  `,
  styleUrls: ['./loading.component.scss'],
  imports: [],
})
export class LoadingComponent {

}
