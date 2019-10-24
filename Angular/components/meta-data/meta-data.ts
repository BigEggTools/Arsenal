export interface TextData extends String {
}

export interface ScoreData {
    score: number;
    count: number;
}

export interface RouterLinkData {
    text: string;
    routerLink: string;
}

export interface LinkData {
    title?: string;
    text: string;
    url: string;
}

export interface ImageData {
    name: string;
    url: string;
    background?: string;
}

export interface PriceData {
    listPrice: number;
    msrpPrice?: number;
    currencyCode: string;
}

export interface ActionData {
    text: string;
    additionalActionText?: string;
}

export interface ListTextData extends Array<String> {
}

export interface CheckListData extends Array<{ text: string, data: object, isDisabled: boolean, disabledTooltips: string }> {
}

export interface FlagData extends Boolean {
}

export enum MetaDataType {
    Text,
    Score,
    Link,
    RouterLink,
    Image,
    Price,
    Empty,
    ListText,
    Flag,
    CheckList,
    Action
}

export interface IMetaData {
    type: MetaDataType;
    className: string;
    getValue: (rowData: any) => TextData | ScoreData | RouterLinkData | LinkData | ImageData | PriceData | ListTextData | FlagData | CheckListData | ActionData;
}

abstract class MetaDataBase implements IMetaData {
    private _type: MetaDataType;

    public className: string;
    public getValue: (rowData: any) => TextData | ScoreData | RouterLinkData | LinkData | ImageData | PriceData | ListTextData | FlagData | CheckListData | ActionData;

    constructor(metaDataType: MetaDataType, options: {
        className?: string,
        getValue?: (rowData: any) => TextData | ScoreData | RouterLinkData | LinkData | ImageData | PriceData | ListTextData | FlagData | CheckListData | ActionData
    }) {
        this._type = metaDataType;

        this.className = options.className || '';
        this.getValue = options.getValue || (this.defaultValue);
    }

    public get type(): MetaDataType {
        return this._type;
    }


    private defaultValue(rowData: any): string {
        return '';
    }
}

export class TextMetaData extends MetaDataBase {
    private propertyName: string;

    public title: string;

    constructor(options: {
        propertyName: string,
        title?: string,
        className?: string,
        getValue?: (rowData: any) => TextData
    }) {
        super(MetaDataType.Text, options);

        this.propertyName = options.propertyName;
        this.title = options.title || '';
        this.getValue = options.getValue || this.defaultGetValue;
    }


    private defaultGetValue(rowData: any): string {
        let properties = this.propertyName.split('.');
        let data = rowData;
        properties.forEach(property => {
            if (data)
                data = data[property]
        });

        return data;
    }
}

export class ScoreMetaData extends MetaDataBase {
    private propertyName: string;

    public title: string;

    constructor(options: {
        title?: string,
        className?: string,
        getValue: (rowData: any) => ScoreData
    }) {
        super(MetaDataType.Score, options);

        this.title = options.title || '';
        this.getValue = options.getValue;
    }
}

export class LinkMetaData extends MetaDataBase {
    public title: string;
    public newTab: boolean = false;

    constructor(options: {
        title?: string,
        className?: string,
        newTab?: boolean,
        getValue: (rowData: any) => LinkData
    }) {
        super(MetaDataType.Link, options);

        this.title = options.title || '';
        this.newTab = options.newTab;
        this.getValue = options.getValue;
    }
}

export class RouterLinkMetaData extends MetaDataBase {
    public title: string;
    public newTab: boolean = false;

    constructor(options: {
        title?: string,
        className?: string,
        newTab?: boolean,
        getValue: (rowData: any) => RouterLinkData
    }) {
        super(MetaDataType.RouterLink, options);

        this.title = options.title || '';
        this.newTab = options.newTab;
        this.getValue = options.getValue;
    }
}

export class PriceMetaData extends MetaDataBase {
    private propertyName: string;

    public title: string;

    constructor(options: {
        title?: string,
        className?: string,
        getValue: (rowData: any) => PriceData
    }) {
        super(MetaDataType.Price, options);

        this.title = options.title || '';
        this.getValue = options.getValue;
    }
}

export class ImageMetaData extends MetaDataBase {
    constructor(options: {
        className?: string,
        getValue: (rowData: any) => ImageData
    }) {
        super(MetaDataType.Image, options);

        this.getValue = options.getValue;
    }
}

export class EmptyMetaData extends MetaDataBase {
    constructor() {
        super(MetaDataType.Empty, {});

        this.getValue = (rowData) => '';
    }
}

export class ListTextMetaData extends MetaDataBase {
    private propertyName: string;

    constructor(options: {
        propertyName: string,
        className?: string,
        getValue?: (rowData: any) => ListTextData
    }) {
        super(MetaDataType.ListText, options);

        this.propertyName = options.propertyName;
        this.getValue = options.getValue || this.defaultGetValue;
    }


    private defaultGetValue(rowData: any): Boolean {
        let properties = this.propertyName.split('.');
        let data = rowData;
        properties.forEach(property => {
            if (data)
                data = data[property]
        });

        return data;
    }
}

export class FlagMetaData extends MetaDataBase {
    private propertyName: string;
    public title: string;
    public getTooltip: (rowData: any) => string;

    constructor(options: {
        propertyName: string,
        title?: string,
        className?: string,
        getTooltip?: (rowData: any) => string,
        getValue?: (rowData: any) => FlagData
    }) {
        super(MetaDataType.Flag, options);

        this.propertyName = options.propertyName;
        this.title = options.title || '';
        this.getValue = options.getValue || this.defaultGetValue;
        this.getTooltip = options.getTooltip || this.defaultTooltip
    }


    private defaultGetValue(rowData: any): Boolean {
        let properties = this.propertyName.split('.');
        let data = rowData;
        properties.forEach(property => {
            if (data)
                data = data[property]
        });

        return data;
    }

    private defaultTooltip(rowData: any): string {
        return rowData[this.propertyName];
    }
}

export class CheckListMetaData extends MetaDataBase {
    private propertyName: string;
    public updatePropertyName: string;

    constructor(options: {
        propertyName: string,
        updatePropertyName: string,
        className?: string,
        getValue?: (rowData: any) => CheckListData,
    }) {
        super(MetaDataType.CheckList, options);

        this.propertyName = options.propertyName;
        this.updatePropertyName = options.updatePropertyName;
        this.getValue = options.getValue || this.defaultGetValue;
    }


    private defaultGetValue(rowData: any): CheckListData {
        let properties = this.propertyName.split('.');
        let data = rowData;
        properties.forEach(property => {
            if (data)
                data = data[property]
        });

        return data;
    }
}

export class ActionMetaData extends MetaDataBase {
    private propertyName: string;

    public title: string;
    public action: (rowData: any) => void = (rowData: any) => {};
    public additionalAction: (rowData: any) => void = (rowData: any) => {};

    constructor(options: {
        propertyName: string,
        title?: string,
        className?: string,
        getValue?: (rowData: any) => ActionData,
        action: (rowData: any) => void,
        additionalAction?: (rowData: any) => void
    }) {
        super(MetaDataType.Action, options);

        this.propertyName = options.propertyName;
        this.title = options.title || '';
        this.getValue = options.getValue || this.defaultGetValue;
        this.action = options.action;
        this.additionalAction = options.additionalAction;
    }

    private defaultGetValue(rowData: any): ActionData {
        let properties = this.propertyName.split('.');
        let data = rowData;
        properties.forEach(property => {
            if (data)
                data = data[property]
        });

        return {
            text: data
        };
    }
}
