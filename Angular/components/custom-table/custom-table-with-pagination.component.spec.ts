/************* Required test imports **************
 * IMPORTANT! Do not modify, other than fixing    *
 * relative paths.                                *
 **************************************************/
import { APP_BASE_HREF, CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, DebugElement, Injector, NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs/Rx';

/************* End of test imports ***************/

import { RequestContext } from '../../services/request-context.service';
import { CustomTablewithPaginationComponent } from './custom-table-with-pagination.component';
import { PaginationService } from './pagination.service';

/**
 * CustomTablewithPaginationComponent component test
 */

class MockRequestContext {
    public get IsExtendedViewSize() {
        return false;
    }
}

describe('CustomTablewithPaginationComponent', () => {
    let fixture: ComponentFixture<CustomTablewithPaginationComponent>;
    let component: CustomTablewithPaginationComponent;
    let debugElement: DebugElement;
    let element: HTMLElement;
    let activatedRoute: ActivatedRouteStub;

    // Providers for the tests injector
    beforeEach((done) => {
        activatedRoute = new ActivatedRouteStub();

        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                TestHelperModule
            ],
            declarations: [
                CustomTablewithPaginationComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                TestProviders,
                PaginationService,
                { provide: RequestContext, useClass: MockRequestContext },
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(CustomTablewithPaginationComponent);
            component = fixture.componentInstance;
            done();
        });
    });

    it('is initialized correctly', () => {
        // Check that all the initial values are assigned correctly
        expect(component).not.toBe(null);
    });

    it('sets paging range correctly', () => {
        // Check that all the initial values are assigned correctly
        component.page = 1;
        component.pageSize = 50;
        component.totalResultsCount = 100;
        component.ngOnChanges();
        expect(component['paginationRange']).toEqual([1, 2]);

        component.totalResultsCount = 705;
        component.ngOnChanges();
        expect(component['paginationRange']).toEqual([1, 2, 3, 4, 5]);
        expect(component['totalPageCount']).toEqual(15);

        component.page = 10;
        component.ngOnChanges();
        expect(component['paginationRange']).toEqual([8, 9, 10, 11, 12]);

        component.page = 15;
        component.ngOnChanges();
        expect(component['paginationRange']).toEqual([11, 12, 13, 14, 15]);

    });

    it('emits the correct page query parameters', fakeAsync(() => {
        component.page = 1;
        component.pageSize = 50;
        component.totalResultsCount = 705;

        component.ngOnChanges();

        let newParams;
        const sub = component.parametersChange.subscribe((params) => {
            newParams = params;
        });

        component.setPageSize(25);
        tick();
        expect(newParams).toEqual({ page: 1, pageSize: 25, sortBy: undefined, filterBy: undefined, searchBy: undefined });
        component.setPageNumber(7);
        tick();
        expect(newParams).toEqual({ page: 7, pageSize: 25, sortBy: undefined, filterBy: undefined, searchBy: undefined });

        sub.unsubscribe();
    }));

});
