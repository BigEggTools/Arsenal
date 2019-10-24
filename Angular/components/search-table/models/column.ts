import { Observable } from 'rxjs/Observable';

import { ImageMetaData, IMetaData, LinkMetaData, TextMetaData } from '../../meta-data';

export enum Order {
    NONE,
    ASC,
    DESC
}

export enum SelectType {
    Multi,
    Single,
    None,
}

/**
 * Type of column
 * 
 * @export
 * @enum {number}
 */
export enum ColumnType {
    Text,
    Link,
    RichText,
    Expandable,
}

/**
 * Column interface
 * 
 * @export
 * @interface IColumn
 */
export interface IColumn {
    /**
     * The title of the column
     */
    title: string;
    /**
     * The type of column
     * 
     * @type {ColumnType}
     */
    type: ColumnType;
    /**
     * CSS Class to be added to the column cell
     * 
     * @type {string}
     */
    className: string;
    /**
     * Order by property name for this column. If empty, column cannot be sort 
     */
    orderBy: string;
    /**
     * Sort order to the column
     */
    order: Order;

    /**
     * The meta data array to show in the column cell
     */
    metaDataArray: IMetaData[];

    changeOnSearch?: (criteria: any, column: IColumn) => void;
}

/**
 * The base class for column 
 * 
 * @export
 * @class ColumnBase
 * @extends IColumn
 */
abstract class ColumnBase implements IColumn {
    private _type: ColumnType;
    
    public title: string;
    public className: string;
    public orderBy: string;
    public order: Order;
    public metaDataArray: IMetaData[];
    public changeOnSearch?: (criteria: any, column: IColumn) => void;
    
    constructor(columnType: ColumnType, options: {
        title: string,
        className?: string,
        orderBy?: string,
        order?: Order,
        metaDataArray: IMetaData[],
        changeOnSearch?: (criteria: any, column: IColumn) => void
    }) {
        if (!options.metaDataArray || !options.metaDataArray.length) {
            throw 'Meta data for column should not be null or empty';
        }

        this._type = columnType;

        this.title = options.title || '';
        this.className = options.className || '';
        this.orderBy = options.orderBy || '';
        this.order = options.orderBy ? (options.order || Order.NONE) : Order.NONE;
        this.metaDataArray = options.metaDataArray;
        this.changeOnSearch = options.changeOnSearch || this.defaultChangeOnSearch;
    }

    public get type(): ColumnType {
        return this._type;
    }

    public defaultChangeOnSearch(criteria: any, column: IColumn): void {
        return;
    }
}

/**
 * A text column
 * 
 * @export
 * @class TextColumn
 * @extends IColumn,ColumnBase
 */
export class TextColumn extends ColumnBase {
    constructor(options: {
        title: string,
        className?: string,
        orderBy?: string,
        order?: Order,
        metaData: TextMetaData
        changeOnSearch?: (criteria: any, column: IColumn) => void
    }) {
        super(ColumnType.Text, {
            title: options.title,
            className: options.className,
            orderBy: options.orderBy,
            order: options.order,
            metaDataArray: [ options.metaData ],
            changeOnSearch: options.changeOnSearch
        });
    }
}

/**
 * A link column
 * 
 * @export
 * @class LinkColumn
 * @extends IColumn,ColumnBase
 */
export class LinkColumn extends ColumnBase {
    constructor(options: {
        title: string,
        className?: string,
        orderBy?: string,
        order?: Order,
        metaData: LinkMetaData,
        changeOnSearch?: (criteria: any, column: IColumn) => void
    }) {
        super(ColumnType.Link, {
            title: options.title,
            className: options.className,
            orderBy: options.orderBy,
            order: options.order,
            metaDataArray: [ options.metaData ],
            changeOnSearch: options.changeOnSearch
        });
    }
}

export class RichTextColumn extends ColumnBase {
    public imageMetaData: ImageMetaData;

    constructor(options: {
        title: string,
        className?: string,
        orderBy?: string,
        order?: Order,
        metaDataArray: IMetaData[],
        imageMetaData?: ImageMetaData,
        changeOnSearch?: (criteria: any, column: IColumn) => void
    }) {
        super(ColumnType.RichText, {
            title: options.title,
            className: options.className,
            orderBy: options.orderBy,
            order: options.order,
            metaDataArray: options.metaDataArray,
            changeOnSearch: options.changeOnSearch
        });

        this.imageMetaData = options.imageMetaData;
    }

    public get hasImage(): boolean {
        return !!this.imageMetaData;
    }
}

export class ExpandableColumn extends ColumnBase {
    public imageMetaData: ImageMetaData;
    public detailMetaDataArray: IMetaData[];
    public expanded: (data: any) => Observable<any>
    public expandedIcon: { expand: string, collapse: string };
    
    constructor(options: {
        title: string,
        className?: string,
        orderBy?: string,
        order?: Order,
        imageMetaData?: ImageMetaData,
        metaDataArray: IMetaData[],
        detailMetaDataArray: IMetaData[],
        expanded: (data: any) => Observable<any>,
        expandedIcon?: { expand: string, collapse: string },
        changeOnSearch?: (criteria: any, column: IColumn) => void
    }) {
        super(ColumnType.Expandable, {
            title: options.title,
            className: options.className,
            orderBy: options.orderBy,
            order: options.order,
            metaDataArray: options.metaDataArray,
            changeOnSearch: options.changeOnSearch
        });

        this.imageMetaData = options.imageMetaData;
        this.detailMetaDataArray = options.detailMetaDataArray;
        this.expanded = options.expanded;

        this.expandedIcon = options.expandedIcon || { expand: 'fa-info-circle', collapse: 'fa-minus-circle' }
    }
}
