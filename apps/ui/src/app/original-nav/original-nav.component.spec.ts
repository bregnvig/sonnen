import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginalNavComponent } from './original-nav.component';

describe('OriginalNavComponent', () => {
  let component: OriginalNavComponent;
  let fixture: ComponentFixture<OriginalNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OriginalNavComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginalNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
