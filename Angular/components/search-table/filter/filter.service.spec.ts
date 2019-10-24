import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TestHelperModule, TestProviders } from '../../../../testing/test-helper';

import { CheckBoxFilter, ComboBoxFilter, FilterType, IFilter, TextFilter } from '../models/filter';
import { FilterService } from './filter.service';

describe('FilterService', () => {
    let filterService: FilterService;

    beforeEach(() => {
        filterService = new FilterService();
    });
});
