/**
 * Type of filter
 * 
 * @export
 * @enum {number}
 */
export enum FilterType {
    Text,
    CheckBox,
    ComboBox,
    Select2
}

/**
 * Filter interface
 * 
 * @export
 * @interface IFilter
 */
export interface IFilter<T> {
    /**
     * The name of the filter
     */
    name: string;
    /**
     * The value of the filter
     */
    value: T;

    /**
     * The type of filter
     * 
     * @type {FilterType}
     */
    type: FilterType;
    /**
     * Lable text of the filter
     */
    label: string;
    /**
     * Default value of the filter
     */
    defaultValue: string;
    /**
     * CSS Class to be added to the filter
     * 
     * @type {string}
     */
    className: string;
    /**
     * Filter will be disabled
     */
    disabled: boolean;
    /**
     * Filter will be disabled
     */
    defaultDisabled: boolean;

    /**
     * Function to validate the filter value is valid or not
     */
    validation: (value: string) => string;
    /**
     * Function to execute when value changed
     */
    onChange: (value: string, filters: Array<IFilter<any>>) => void;
}

/**
 * The base class for filter 
 * 
 * @export
 * @class FilterBase
 * @extends IFilter
 */
export abstract class FilterBase<T> implements IFilter<T> {
    private _type: FilterType;
    
    public name: string;
    public value: T;
    public label: string;
    public className: string;
    public defaultValue: string;
    public disabled: boolean;
    public defaultDisabled: boolean;
    public validation: (value: string) => string;
    public onChange: (value: string, filters: Array<IFilter<any>>) => void;
    
    constructor(filterType: FilterType, options: {
        name: string,
        value?: T,
        label?: string,
        className?: string,
        defaultValue?: string,
        disabled?: boolean,
        validation?: (value: string) => string,
        onChange?: (value: string, filters: Array<IFilter<any>>) => void,
    }) {
        this._type = filterType;

        this.name = options.name || '';
        this.value = options.value;
        this.label = options.label || '';
        this.className = options.className || 'col-md-3 col-xl-3';
        this.defaultValue = options.defaultValue || '';
        this.disabled = options.disabled || false;
        this.validation = options.validation || this.defaultValidation;
        this.onChange = options.onChange || this.defaultChangeHandler;

        this.defaultDisabled = this.disabled;
    }

    public get type(): FilterType {
        return this._type;
    }


    private defaultValidation(value: string): string {
        return '';
    }

    private defaultChangeHandler(value: string): void {
    }
}

/**
 * A text filter
 * 
 * @export
 * @class TextFilter
 * @extends IFilter,FilterBase
 */
export class TextFilter extends FilterBase<string> {
    public placeholder: string;
    public required: boolean;
    public maxLength: number;
    public minLength: number;

    constructor(options: {
        name: string,
        value?: string,
        label?: string,
        className?: string,
        defaultValue?: string,
        disabled?: boolean,
        validation?: (value: string) => string,
        onChange?: (value: string, filters: Array<IFilter<any>>) => void,
        placeholder?: string,
        required?: boolean,
        maxLength?: number,
        minLength?: number
    }) {
        super(FilterType.Text, options);

        this.placeholder = options.placeholder || '';
        this.required = !!options.required;
        this.maxLength = options.maxLength || undefined;
        this.minLength = options.minLength || undefined;
    }
}

/**
 * A check box filter
 * 
 * @export
 * @class CheckBoxFilter
 * @extends IFilter,FilterBase
 */
export class CheckBoxFilter extends FilterBase<boolean> {
    constructor(options: {
        name: string,
        value?: boolean,
        label?: string,
        className?: string,
        defaultValue?: string,
        disabled?: boolean,
        onChange?: (value: string, filters: Array<IFilter<any>>) => void,
    }) {
        super(FilterType.CheckBox, options);
    }
}

/**
 * A combo box filter
 * 
 * @export
 * @class ComboBoxFilter
 * @extends IFilter,FilterBase
 */
export class ComboBoxFilter extends FilterBase<string> {
    public placeholder: string;
    public selection: Array<{ name: string, value: string }>;
    public canBeEmpty: boolean;

    constructor(options: {
        name: string,
        value?: string,
        label?: string,
        className?: string,
        defaultValue?: string,
        placeholder?: string,
        disabled?: boolean,
        onChange?: (value: string, filters: Array<IFilter<any>>) => void,
        selection?: Array<{ name: string, value: string }>,
        canBeEmpty?: boolean,        
    }) {
        super(FilterType.ComboBox, options);
        
        this.placeholder = options.placeholder || '';
        this.selection = options.selection || [];
        this.canBeEmpty = (options.canBeEmpty === undefined || options.canBeEmpty === null) ? true : options.canBeEmpty;
    }
}

/**
 * A combo box filter using Select2
 * 
 * @export
 * @class ComboBoxFilter
 * @extends IFilter,FilterBase
 */
export class Select2ComboBoxFilter extends FilterBase<string> {
    public placeholder: string;
    public selection: Array<{ name: string, value: string }>;
    public canBeEmpty: boolean;

    constructor(options: {
        name: string,
        value?: string,
        label?: string,
        className?: string,
        defaultValue?: string,
        placeholder?: string,
        disabled?: boolean,
        onChange?: (value: string, filters: Array<IFilter<any>>) => void,
        selection?: Array<{ name: string, value: string }>,
        canBeEmpty?: boolean,        
    }) {
        super(FilterType.Select2, options);
        
        this.placeholder = options.placeholder || '';
        this.selection = options.selection || [];
        this.canBeEmpty = (options.canBeEmpty === undefined || options.canBeEmpty === null) ? true : options.canBeEmpty;
    }
}
