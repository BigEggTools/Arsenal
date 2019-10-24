
import * as React from 'react';
import { Viewer } from '../../../core-package/components/viewer/Viewer';
import { ViewerDisplayMode } from '../../../core-package/components/viewer/viewer-models';
import { CheckboxCell, DateCell, DefaultCell, ExternalLinkCell, IconCell, ImageCell, LinkCell } from './custom-table-cells';
import { ColumnMetadata, ColumnType } from './custom-table-datatypes';

export interface ICustomTableReactProps {
    remote: any;
    data: any;
    options: any;
    expandableRow: any;
    expandComponent: any;
    expandColumnOptions: any;
    condensed: any;
    bordered: any;
    hover: any;
    striped: any;
    columns: Array<any>;
    loading: boolean;
    selectRowProp: any;
}

export class CustomTableReactComponent extends React.Component<ICustomTableReactProps> {

    constructor(props) {
        super(props);
    }

    notImplemented = (props) => {
        return (<DefaultCell column={props.column} row={props.row} cell={'not implemented'} />);
    }

    getFormatter(columnType: ColumnType): any {
        switch (columnType) {
            case ColumnType.IMAGE:
                return ImageCell;
            case ColumnType.ICON:
                return IconCell;
            case ColumnType.LINK:
                return LinkCell;
            case ColumnType.EXTERNALLINK:
                return ExternalLinkCell;
            case ColumnType.DATE:
                return DateCell;
            case ColumnType.CHECKBOX:
                return CheckboxCell;
            case ColumnType.DYNAMIC:
            case ColumnType.RADIO:
                return this.notImplemented;
            case ColumnType.DOCUMENTSTATE:
            default:
                return DefaultCell;
        }
    }

    convertToTableHeaderColumn(column: ColumnMetadata, index: number) {

        let Formatter = this.getFormatter(column.type);
        let formatterWrapper = (cell, row) => { return (<Formatter column={column} cell={cell} row={row} />) };

        return {
          headerName: column.name,
          dataField: column.key,
          isKey: column.isKey,
          dataFormat: formatterWrapper,
          width: column.customWidth
        };
    }

    renderLoading() {
        if (this.props.loading) {
            return 'Loading';
        }
        else {
            return 'No results found';
        }
    }

    expandColumnComponent({ isExpandableRow, isExpanded }) {
        let content;

        if (isExpandableRow) {
            content = (isExpanded ? (<span className='fa-chevron-up fas fa-s' />) : (<span className='fa-chevron-down fas fa-s' />));
        } else {
            content = (<span />);
        }
        return (
            <div className='text-center'>{content}</div>
        );
    }

    render() {
        let options = !this.props.options ? {} : this.props.options;

        if( !this.props.options.noDataText){
            options.noDataText = this.renderLoading();
        }

        let headers = this.props.columns.map((column, index) => this.convertToTableHeaderColumn(column, index));


        let tableConfig = {
        columns: headers,
        expandColumnOptions: {
                expandColumnVisible: this.props.expandColumnOptions.expandColumnVisible,
                expandColumnComponent: this.expandColumnComponent,
                columnWidth: this.props.expandColumnOptions.columnWidth,
                expandedColumnHeaderComponent: this.props.expandColumnOptions.expandedColumnHeaderComponent,
                expandColumnBeforeSelectColumn: this.props.expandColumnOptions.expandColumnBeforeSelectColumn
        },
        expandableRow: this.props.expandableRow,
        expandComponent: this.props.expandComponent
        };

        return (
            <Viewer
                isSelectable={false}
                data={this.props.data}
                tableConfig={tableConfig}
                availableDisplayModes={ViewerDisplayMode.Table}
                defaultDisplayMode={ViewerDisplayMode.Table}
                />
        );
    }
}