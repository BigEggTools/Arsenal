export interface ColumnMetadata {
    isKey?: boolean;
    name: string;
    key: string;
    type?: ColumnType;
    isSortable?: boolean; //enables the ability to click column header to sort table
    sort?: Function; //custom sort method, fallback to string sort if not provider
    sortOrder?: string;
    format?: string;
    hidden?: boolean; //a column could be hidden for any reason
    onSelectAll?: Function;
    customWidth?: string;
}

export enum ColumnType {
    DATE,
    CHECKBOX,
    RADIO,
    DOCUMENTSTATE,
    LINK,
    DYNAMIC,
    EXTERNALLINK,
    IMAGE,
    ICON
}

export enum SelectType {
    Multi,
    Single,
    None,
}

export interface CustomColumnMetadata extends ColumnMetadata {
    className: string;
    customComponent?: object;
    options: object;
    customFormatter?: any;
}

export interface RowSelectionStatus {
    readonly disableSelect: boolean,
    readonly message?: string,
    readonly iconClass?: string
}

export class RowCanBeSelect implements RowSelectionStatus {
    public readonly disableSelect = false;
}

export class RowCannotBeSelect implements RowSelectionStatus {
    public readonly disableSelect = true;
    public readonly message: string;
    public readonly iconClass: string;

    constructor(message: string, iconClass: string = 'fas fa-exclamation-triangle text-danger') {
        this.message = message;
        this.iconClass = iconClass
    }
}
