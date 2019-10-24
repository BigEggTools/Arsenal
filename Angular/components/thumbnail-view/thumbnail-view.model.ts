import { ThumbnailItem } from './thumbnail-item/thumbnail-item.model';

export enum Order {
    NONE,
    ASC,
    DESC
}

export class ThumbnailView {
    public thumbnail: ThumbnailItem;
    public sortableColumn: { name: string, title: string, order?: Order }[]

    constructor(options: {
        thumbnail: ThumbnailItem,
        sortableColumn?: { name: string, title: string, order?: Order }[]
    }) {
        this.thumbnail = options.thumbnail;
        this.sortableColumn = options.sortableColumn || [];
    }
}
