import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DolanComponent } from './dolan.component';

describe('DolanComponent', () => {
  let component: DolanComponent;
  let fixture: ComponentFixture<DolanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DolanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DolanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
