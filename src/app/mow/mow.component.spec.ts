import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MowComponent } from './mow.component';

describe('MowComponent', () => {
  let component: MowComponent;
  let fixture: ComponentFixture<MowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
