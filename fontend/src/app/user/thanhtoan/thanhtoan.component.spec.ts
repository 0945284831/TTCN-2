import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThanhtoanComponent } from './thanhtoan.component';

describe('ThanhtoanComponent', () => {
  let component: ThanhtoanComponent;
  let fixture: ComponentFixture<ThanhtoanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThanhtoanComponent]
    });
    fixture = TestBed.createComponent(ThanhtoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
