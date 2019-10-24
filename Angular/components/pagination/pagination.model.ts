import { Injectable } from '@angular/core';

export const PaginationResources = {
    resultsFound: (result: number): string => {
        return result === 1 ? `${result} result found` : `${result} results found`;
    },
    resultsPerPage: 'Results per page:',
};

@Injectable()
export class PaginationParameters {
    public pageSizeChoices: Array<number> = [10, 25, 50]
}
