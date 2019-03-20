import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardboxComponent } from './cardbox.component';

describe('CardboxComponent', () => {
  let component: CardboxComponent;
  let fixture: ComponentFixture<CardboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
