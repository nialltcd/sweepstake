import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LameloComponent } from './lamelo.component';

describe('LameloComponent', () => {
  let component: LameloComponent;
  let fixture: ComponentFixture<LameloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LameloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LameloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
