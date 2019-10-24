import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Type, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CheckboxCell, DateCell, DefaultCell, ExternalLinkCell, IconCell, ImageCell, LinkCell } from './custom-table-cells';
import { ColumnMetadata, ColumnType, SelectType } from './custom-table-datatypes';
import { CustomTableReactComponent } from './custom-table-react.component';

@Component({
  selector: 'custom-table-react-wrapper',
  template: `<div #reactHost></div>`,
  styleUrls: ['./custom-table.component.scss'],

})
export class CustomTableReactWrapperComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public columns: Array<ColumnMetadata>;
  @Input() public data: Array<any>;
  @Input() public styles: string[];
  @Input() public loading: boolean;
  @Input() public selectRowProp: any;
  @Input() public selectType: SelectType = SelectType.None;
  @Input() public hasRowDetails: (data: any) => boolean = () => false;
  @Input() public enableRowDetails: boolean = false;
  @Input() public rowDetailsComponentType: Type<any>;
  @Input() public expandComponent: (row: any) => JSX.Element;

  @ViewChild('reactHost') reactHostElement: ElementRef;

  private componentName: string = 'CustomTableReactComponent';
  private options: any = {};

  constructor(private router: Router) {
  }

  containsClass(name: string): boolean {
    return this.styles.indexOf(name) > -1;
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data'] && !changes['data'].firstChange) {
      this.decoarateRouteLinkClick();
    }

    this.render();
  }

  render() {
    const hostElement = this.reactHostElement.nativeElement;

    ReactDOM.render(
      (
        <CustomTableReactComponent
          remote={false}
          data={this.data}
          options={this.options}
          expandableRow={this.hasRowDetails}
          expandComponent={this.expandComponent}
          expandColumnOptions={{ expandColumnVisible: this.enableRowDetails, columnWidth: 50 }}
          condensed={this.containsClass('condensed')}
          bordered={this.containsClass('bordered')}
          hover={this.containsClass('hover')}
          striped={this.containsClass('striped')}
          columns={this.columns}
          loading={this.loading}
          selectRowProp={this.selectRowProp} />
      ) as React.ReactElement<any>,
      hostElement
    );
  }

  decoarateRouteLinkClick() {
    for (let dataItem of this.data) {
      let oldHandler = dataItem.onLinkClick;
      dataItem.onLinkClick = (row) => {
        if (oldHandler) {
          oldHandler(row);
        }

        this.router.navigate(row.linkRoute, { queryParams: row.linkParams });
      }
    }
  }

  ngOnInit() {
    this.decoarateRouteLinkClick();
    this.render();
  }

  ngOnDestroy(): void {
    const hostElement = this.reactHostElement.nativeElement;
    ReactDOM.unmountComponentAtNode(hostElement);
  }
}
