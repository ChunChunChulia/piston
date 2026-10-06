import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Insert } from './insert';

describe('Insert', () => {
  let component: Insert;
  let fixture: ComponentFixture<Insert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Insert],
    }).compileComponents();

    fixture = TestBed.createComponent(Insert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
