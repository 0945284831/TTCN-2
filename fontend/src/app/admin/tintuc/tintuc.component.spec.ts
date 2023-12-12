import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TintucComponent } from './tintuc.component';

describe('TintucComponent', () => {
  let component: TintucComponent;
  let fixture: ComponentFixture<TintucComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TintucComponent]
    });
    fixture = TestBed.createComponent(TintucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
