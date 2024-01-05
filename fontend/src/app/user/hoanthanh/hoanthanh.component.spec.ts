import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoanthanhComponent } from './hoanthanh.component';

describe('HoanthanhComponent', () => {
  let component: HoanthanhComponent;
  let fixture: ComponentFixture<HoanthanhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoanthanhComponent]
    });
    fixture = TestBed.createComponent(HoanthanhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
