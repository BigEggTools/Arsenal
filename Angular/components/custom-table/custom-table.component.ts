import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type } from '@angular/core';
import * as moment from 'moment';
import { ColumnMetadata, ColumnType, RowCanBeSelect, RowSelectionStatus, SelectType } from './custom-table-datatypes';
import { CustomTableResources } from './custom-table-resources';
import { MessagesService, MessageType } from '../../messages/messages.service';

@Component({
	selector: 'custom-table',
	styleUrls: ['./custom-table.component.scss'],
	templateUrl: './custom-table.component.html',
	providers: []
})
export class CustomTableComponent implements OnChanges, OnInit, OnDestroy {
	@Input() public columns: Array<ColumnMetadata>;
	@Input() public data: Array<any>;
	@Input() public styles: string[];
	@Input() public isFixedHeader: boolean = false;
	@Input() public loading: boolean;
	@Input() public selectType: SelectType = SelectType.None;
	@Input() public colorTable: boolean = false;
	@Input() public isRowSelectable: (data: any) => RowSelectionStatus;
	@Input() public hideHeader: boolean = false;
	@Input() public rowSelected: Array<boolean> = [];
	@Input() public rowExpanded: Array<boolean> = [];

	@Input() public hasRowDetails: (data: any) => boolean = () => false;
	@Input() public enableRowDetails: boolean = false;
	@Input() public rowDetailsComponentType: Type<any>;

	@Output() selectedChange: EventEmitter<Array<object>> = new EventEmitter<Array<object>>();
	@Output() sortChange: EventEmitter<object> = new EventEmitter<object>();

	public moment = moment;
	public columnType = ColumnType;
	public SelectTypeEnum = SelectType;
	public allSelected: boolean;
	private componentName: string = 'CustomTableComponent';
	private lastSortedColumnKey: string = null;
	private selectObjects: Array<object> = [];
	private readonly defaultSingleSelectIndex = 0;
	private currentRadioIndex: number = this.defaultSingleSelectIndex;
	private timeoutHandlers: Array<number> = [];
	private copyButtonTooltip: string = CustomTableResources.copyButtonTooltip;

	constructor(private messagesService: MessagesService) {
	}

	ngOnInit() {
		this.rowSelected = new Array(this.data.length).fill(false);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['loading']) {
			if (!changes['loading'].currentValue && this.selectType === SelectType.Single && this.data && this.data.length) {
				this.setDefaultSelectedObjectForSingleSelectType();
			}
			if (changes['loading'].currentValue && this.selectObjects) {
				let timeout = setTimeout(() => {
					this.selectObjects.length = 0;
					this.selectedChange.emit(this.selectObjects);
				});
				this.timeoutHandlers.push(timeout);
			}
		}

		if (changes['data']) {
			// reset selection
			this.rowSelected = changes['data'].currentValue ? new Array(changes['data'].currentValue.length).fill(false) : [];

			if (this.selectType === SelectType.Single && this.data && this.data.length) {
				this.setDefaultSelectedObjectForSingleSelectType();
			}
		}
		this.refreshSelectAllButton();
	}

	ngOnDestroy(): void {
		if (this.timeoutHandlers) {
			this.timeoutHandlers.forEach(timeout => {
				if (timeout) {
					clearTimeout(timeout);
				}
			});
		}
	}

	private setDefaultSelectedObjectForSingleSelectType() {
		let timeout = setTimeout(() => {
			this.onRadioButtonChange(true, this.data[this.defaultSingleSelectIndex], this.defaultSingleSelectIndex);
		});
		this.timeoutHandlers.push(timeout);
	}

	public displayedColumns() {
		let array = this.columns.filter(col => !col.hidden);
		return array;
	}

	public getDataFt(rowItem: any, columnKey: string) {
		return;
	}

	public getTableClass() {
		let tableClass = 'table ';
		if (this.styles) {
			tableClass += this.styles.map(a => 'table-' + a).join(' ');
		}
		return tableClass;
	}

	public hasRowClickAction(rowItem: any) {
		return !!(rowItem && rowItem.onRowClick);
	}

	public onSelectClick(rowItem: any) {
		if (!this.hasRowClickAction(rowItem) && rowItem.onSelectClick) {
			rowItem.onSelectClick();
		}
	}

	public getDate(dateObj: any): Date {
		return dateObj
			? new Date(dateObj)
			: null;
	}

	public isSortable(column: ColumnMetadata) {
		return column.sort || column.isSortable;
	}

	public getSortGlyph(sortOrder: string) {
		return sortOrder ? (sortOrder === 'asc' ? 'fas fa-sort-down' : 'fas fa-sort-up') : 'fas fa-sort';
	}

	private sortColumn(column: ColumnMetadata) {
		if (column.type === ColumnType.DYNAMIC) {
			this.sortChange.emit({ name: column.key, order: column.sortOrder });
			return;
		}
		if (column.sort) {
			// if column provides a sort method, use it
			column.sort(column.key, column.sortOrder);
		} else {
			// else, fallback to basic string sort
			this.data.sort((a, b) => (a[column.key] > b[column.key] ? (column.sortOrder === 'asc' ? 1 : -1) : (column.sortOrder === 'asc' ? -1 : 1)));
		}
	}

	public sort(column: ColumnMetadata) {
		this.lastSortedColumnKey = column.key;
		this.columns.map(col => {
			if (col.key === column.key) {
				if (col.sortOrder && col.sortOrder === 'asc') {
					col.sortOrder = 'desc';
				} else {
					col.sortOrder = 'asc';
				}
			} else {
				col.sortOrder = null;
			}
		});

		this.sortColumn(column);
	}

	// maintain the row order if user has already sort the table before, it's useful when row is added or removed from a sorted table and the order needs to be maintained
	public resort() {
		if (this.lastSortedColumnKey) {
			let column: ColumnMetadata = this.columns.find(column => column.key === this.lastSortedColumnKey);
			setTimeout(() => {
				this.sortColumn(column);
			})
		}
	}

	// When clicking on the row itself, assume only one row can be selected at a time.
	// This is a requirement for template selector and page redirect.
	public onRowClick(row) {
		if (row.onRowClick) {
			row.onRowClick(row);
			this.data.map(row => row.isSelected = false);
			row.isSelected = true;
		}
	}

	public selectAll(evt: any, onSelectAll?: Function) {
		this.allSelected = evt.target.checked;
		this.data.forEach(row => row.isSelected = evt.target.checked);
		if (onSelectAll) {
			onSelectAll(evt.target.checked);
		}
	}

	public selectAllInSearch(event: any) {
		this.data.forEach((item, index) => {
			if (!this.isRowSelectableCheckWrapper(item).disableSelect) {
				this.onCheckboxChange(event.target.checked, item, index)
			}
		});
	}

	public refreshSelectAllButton() {
		//Update allSelect button based on the selection status of existing pages
		if (!this.data || this.data.length === 0) {
			this.allSelected = false;
		} else {
			this.allSelected = true;
			let i = 0;
			while (this.allSelected && i < this.data.length) {
				if (!this.data[i].isSelected) {
					this.allSelected = false;
					break;
				}
				i++;
			}
		}
	}

	onCheckboxChange(checked: boolean, rowObject: object, rowIndex: number) {
		const index = (this.selectObjects).indexOf(rowObject);
		if (checked && index === -1) {
			this.selectObjects.push(rowObject);
		} else if (!checked && index > -1) {
			this.selectObjects.splice(index, 1);
		}
		this.selectedChange.emit(this.selectObjects.slice());
		this.rowSelected[rowIndex] = checked;
	}

	onRadioButtonChange(checked: boolean, rowObject: object, rowIndex: number) {
		if (checked) {
			this.selectObjects.length = 0;

			this.selectObjects.push(rowObject);
			this.selectedChange.emit(this.selectObjects);
			this.currentRadioIndex = rowIndex;
		}
	}

	rowSelectedChangeHandler(shouldCheck: boolean, rowObject: object, rowIndex: number) {
		switch (this.selectType) {
			case SelectType.Multi:
				this.onCheckboxChange(shouldCheck, rowObject, rowIndex);
				break;
			case SelectType.Single:
				this.onRadioButtonChange(shouldCheck, rowObject, rowIndex);
				break;
			default:
				break;
		}
	}

	private defaultRowSelectableCheck(data: any): RowSelectionStatus {
		return new RowCanBeSelect();
	}

	private isRowSelectableCheckWrapper(data: any): RowSelectionStatus {
		return this.isRowSelectable ? this.isRowSelectable(data) : this.defaultRowSelectableCheck(data);
	}

	toggleDetails(rowIndex: number): void {
		this.rowExpanded[rowIndex] = !this.rowExpanded[rowIndex];
	}

	getNumberOfColumns(): number {
		let numberOfColumns = this.columns.length;

		if (this.selectType != SelectType.None) {
			numberOfColumns++;
		}

		if (this.enableRowDetails) {
			numberOfColumns++;
		}

		return numberOfColumns;
	}

	onCopyClick(text: string) {
		let textArea = document.createElement("textarea");
		textArea.style.position = 'fixed';
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.padding = '0';
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		textArea.value = text;

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		if (document.execCommand('copy')) {
			this.messagesService.showMessage(MessageType.Success, CustomTableResources.copySuccessMessage);
		} else {
			this.messagesService.showMessage(MessageType.Error, CustomTableResources.copyFailureMessage);
		}

		document.body.removeChild(textArea);
	}
}
