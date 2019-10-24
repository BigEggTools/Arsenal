import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestHelperModule, TestProviders } from '../../../../testing/test-helper';

import { CoreComponentsModule } from '../../core-components.module';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
    let fixture: ComponentFixture<FilterComponent>;
    let component: FilterComponent;
    let element: HTMLElement;

    // Providers for the tests injector
    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                TestHelperModule,

                CoreComponentsModule
            ],
            declarations: [
                FilterComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                TestProviders
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(FilterComponent);
            component = fixture.componentInstance;
            done();
        });
    });

    it('is initialized correctly', () => {
        expect(component).not.toBe(null);
    });
});
