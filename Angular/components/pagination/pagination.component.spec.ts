/************* Required test imports **************
 * IMPORTANT! Do not modify, other than fixing    *
 * relative paths.                                *
 */
import { APP_BASE_HREF, CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, DebugElement, Injector, NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, getTestBed, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs/Rx';
import { ActivatedRouteStub, DummyComponent, RouterStub, TestHelperModule, TestProviders } from '../../../testing/test-helper';
/** ********** End of test imports ************* */

import { AdalService } from 'ng2-adal/dist/services/adal.service';
import { PaginationComponent } from './pagination.component';
import { PaginationParameters } from './pagination.model';

xdescribe('PaginationComponent', () => {
    let fixture: ComponentFixture<PaginationComponent>;
    let component: PaginationComponent;

    // Providers for the tests injector
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                TestHelperModule
            ],
            declarations: [
                PaginationComponent
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                TestProviders,
                PaginationParameters,
                AdalService,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
    });

    it('is initialized correctly', () => {
        expect(component).not.toBe(null);
    });

    it('shouldn\'t show pagination row when total result count is < 1', () => {
        expect(component).not.toBe(null);
        component.totalResultsCount = 0;
        fixture.detectChanges();
        let paginationUl = fixture.debugElement.query(By.css('.pagination'));
        expect(paginationUl).toBe(null);
    });

    it('displays pagination bar as [1] 2 3 4 5 ...10 >> correctly when total result count is 100 and page size is 10', () => {
        expect(component).not.toBe(null);
        component.totalResultsCount = 100;
        component.pageSize = 10;
        component.ngOnChanges();
        fixture.detectChanges();

        let firstPage = fixture.debugElement.query(By.css('.first-page'));
        expect(firstPage).toBe(null);

        let lastPage = fixture.debugElement.query(By.css('.last-page'));
        expect(lastPage).not.toBe(null);
        expect(lastPage.nativeElement.innerText).toContain('10');

        let paginationUl = fixture.debugElement.query(By.css('.pagination'));
        expect(paginationUl.nativeElement.childElementCount).toEqual(8);
        expect(paginationUl.nativeElement.children[0].className).toEqual('page-item active');
    });

    it('should raise page selected event when clicked and displays pagination bar as << 1 2 [3] 4 5 ...10 >> correctly', () => {
        expect(component).not.toBe(null);
        component.totalResultsCount = 100;
        component.pageSize = 10;
        component.ngOnChanges();
        fixture.detectChanges();
        let firstPage = fixture.debugElement.query(By.css('.first-page'));
        expect(firstPage).toBe(null);

        let lastPage = fixture.debugElement.query(By.css('.last-page'));
        expect(lastPage).not.toBe(null);
        expect(lastPage.nativeElement.innerText).toContain('10');
        let pageThree = fixture.debugElement.query(By.css('#page-3'));

        // This is to tests that the host component gets the the selected page number.
        let selectedPageNumber = 0;
        component.selectedPageChanged.subscribe((pageNumber: number) => selectedPageNumber = pageNumber);
        pageThree.triggerEventHandler('click', null);
        expect(selectedPageNumber).toBe(3);

        // This is to test component states and corresponding markup after click on page 3.
        fixture.detectChanges();
        expect(component.currentPage).toEqual(3);
        let paginationUl = fixture.debugElement.query(By.css('.pagination'));
        expect(paginationUl.nativeElement.children[0].innerText).toEqual('«');
        expect(paginationUl.nativeElement.children[3].className).toEqual('page-item active');
    });

    it('should raise page size change event', () => {
        expect(component).not.toBe(null);
        component.totalResultsCount = 100;
        component.pageSize = 10;
        fixture.detectChanges();

        // This is to tests that the host component gets the the selected page size.
        let selectedPageSize = 0;
        component.pageSizeChoiceChange.subscribe((pageSize: number) => selectedPageSize = pageSize);
        let pageSizeSelector = fixture.debugElement.query(By.css('.form-control'));
        expect(pageSizeSelector).not.toBe(null);
        component.viewSize.setValue(50);
        pageSizeSelector.triggerEventHandler('change', null);
        expect(selectedPageSize).toBe(50);
    });

    it('should not raise page selected event when clicked on current page', () => {
        expect(component).not.toBe(null);
        component.totalResultsCount = 100;
        component.pageSize = 10;
        component.ngOnChanges();
        fixture.detectChanges();

        let hasRaisedEvent: boolean = false;
        let pageOne = fixture.debugElement.query(By.css('#page-1'));
        component.selectedPageChanged.subscribe((pageNumber: number) => hasRaisedEvent = true);
        pageOne.triggerEventHandler('click', null);
        expect(hasRaisedEvent).toBe(false);

        let pageThree = fixture.debugElement.query(By.css('#page-3'));
        pageThree.triggerEventHandler('click', null);
        expect(hasRaisedEvent).toBe(true);
    });

    it('should have default value for page size choices', () => {
        expect(component).not.toBe(null);
        expect(component.pageSizeChoices).not.toBeNull()
        expect(component.pageSizeChoices.length).toBe(3);
    })
});
