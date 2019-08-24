import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRepairPage } from './report-repair.page';

describe('ReportRepairPage', () => {
  let component: ReportRepairPage;
  let fixture: ComponentFixture<ReportRepairPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRepairPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRepairPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
