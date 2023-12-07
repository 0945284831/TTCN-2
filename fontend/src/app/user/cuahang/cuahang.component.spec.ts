import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuahangComponent } from './cuahang.component';

describe('CuahangComponent', () => {
  let component: CuahangComponent;
  let fixture: ComponentFixture<CuahangComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuahangComponent]
    });
    fixture = TestBed.createComponent(CuahangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
