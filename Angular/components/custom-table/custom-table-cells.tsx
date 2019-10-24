import * as moment from 'moment';
import * as React from 'react';
import { SlugifyPipe } from '../../pipes/slugify.pipe';

function slugify(value: string): string {
    return new SlugifyPipe().transform(value);
}

export function DefaultCell(props) {
    let key = (props.column && props.column.key) ? `${props.column.key}_ft` : '';
    let dataFt = slugify(props.row[key]);
    return (<span data-ft={dataFt}>{props.cell}</span>);
}

export function ImageCell(props) {
    const imgStyle = { height: '50px' };
    return (<img role='presentation' src={props.cell} style={imgStyle} />);
}

export function IconCell(props) {
    const className = `fas ${props.cell}`;
    return (<div className='text-center'><i className={className} /></div>);
}

export function ExternalLinkCell(props) {
    if (props.row.externalLinkTarget) {
        let target = props.row.linkTarget || '_self';
        let aria_label = `Edit ${props.cell}`;

        return (<a href={props.row.externalLinkTarget} aria-label={aria_label} target={target}><DefaultCell {...props} /></a>)
    }
    else {
        return <DefaultCell {...props} />;
    }
}

export function DateCell(props) {
    function getDate(dateObj: any): Date {
        return dateObj
            ? new Date(dateObj)
            : null;
    }

    let formattedDate = props.cell ? moment(getDate(props.cell)).format(props.column.format)
        : null;

    return (<DefaultCell column={props.column} row={props.row} cell={formattedDate} />);
}

export function CheckboxCell(props) {
    let hasRowClickAction = (row: any) => {
        return !!(row && row.onRowClick);
    }

    let onSelectClick = (row: any) => {
        if (!hasRowClickAction(row) && row.onSelectClick) {
            row.onSelectClick();
        }
    }

    let ariaLabel = `checkbox${props.row.ariaLabel}`;
    let dataFt = slugify(props.row[props.column.key + '_ft']);
    let tabIndex = hasRowClickAction(props.row) ? -1 : null;
    let onSelectClickWrapper = () => {
        onSelectClick(props.row);
    };

    return (<input type='checkbox' aria-label={ariaLabel} data-ft={dataFt} checked={props.row.isSelected} tabIndex={tabIndex} onClick={onSelectClickWrapper} />);
}

export function LinkCell(props) {

    let onClickHandler = (e) => {
        e.preventDefault();

        if (props.row.onLinkClick) {
            props.row.onLinkClick(props.row);
        }
    }

    if (props.row.linkRoute) {
        let aria_label = `Edit ${props.cell}`;
        let target = props.row.linkTarget || '_self';
        let link = `${props.row.linkRoute.join('/')}`;

        if(props.row.linkParams){
            let query = '';
            for(let param in props.row.linkParams){
                query += `&${param}=${props.row.linkParams[param]}`
            }

            link += `?${query}`;
        }

        return (<a href={link} target={target} className='btn btn-link' onClick={onClickHandler} aria-label={aria_label}><DefaultCell {...props} /></a>)
    }
    else {
        return <DefaultCell {...props} />;
    }
}