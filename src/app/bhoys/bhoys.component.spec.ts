import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhoysComponent } from './bhoys.component';

describe('BhoysComponent', () => {
  let component: BhoysComponent;
  let fixture: ComponentFixture<BhoysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BhoysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BhoysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
