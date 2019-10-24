import { ColumnMetadata, ColumnType as ColumnMetadataType, CustomColumnMetadata } from '../../../../core/components/custom-table';

import { ExpandableCellComponent, LinkCellComponent, RichTextCellComponent, TextCellComponent } from '../cell';
import { ColumnType, ExpandableColumn, IColumn, LinkColumn, RichTextColumn, TextColumn } from '../models/column';

export class ColumnUtils {
    public static convert(columns: IColumn[], orderBy: string, order: string): ColumnMetadata[] {
        let result = new Array<CustomColumnMetadata>();

        columns.forEach(column => {
            if (column.type === ColumnType.Text) {
                result.push({
                    name: column.title,
                    key: column.orderBy,
                    className: column.className,
                    type: ColumnMetadataType.DYNAMIC,
                    isSortable: !!column.orderBy,
                    customComponent: TextCellComponent,
                    sortOrder: orderBy && column.orderBy === orderBy ? order : undefined,
                    options: {
                        metaData: column.metaDataArray[0],
                    }
                });
            } else if (column.type === ColumnType.Link) {
                result.push({
                    name: column.title,
                    key: column.orderBy,
                    className: column.className,
                    type: ColumnMetadataType.DYNAMIC,
                    isSortable: !!column.orderBy,
                    sortOrder: orderBy && column.orderBy === orderBy ? order : undefined,
                    customComponent: LinkCellComponent,
                    options: {
                        metaData: column.metaDataArray[0],
                    }
                });
            } else if (column.type === ColumnType.Expandable) {
                result.push({
                    name: column.title,
                    key: column.orderBy,
                    className: column.className,
                    type: ColumnMetadataType.DYNAMIC,
                    isSortable: !!column.orderBy,
                    sortOrder: orderBy && column.orderBy === orderBy ? order : undefined,
                    customComponent: ExpandableCellComponent,
                    options: {
                        metaDataArray: column.metaDataArray,
                        imageMetaData: (column as ExpandableColumn).imageMetaData,
                        detailMetaDataArray: (column as ExpandableColumn).detailMetaDataArray,
                        expanded: (column as ExpandableColumn).expanded,
                        expandedIcon: (column as ExpandableColumn).expandedIcon
                    }
                });
            } else {
                result.push({
                    name: column.title,
                    key: column.orderBy,
                    className: column.className,
                    type: ColumnMetadataType.DYNAMIC,
                    isSortable: !!column.orderBy,
                    sortOrder: orderBy && column.orderBy === orderBy ? order : undefined,
                    customComponent: RichTextCellComponent,
                    options: {
                        metaDataArray: column.metaDataArray,
                        imageMetaData: (column as RichTextColumn).imageMetaData
                    }
                });
            }
        });

        return result;
    }
}
