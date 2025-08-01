import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SoftGridCommonComponent } from './soft-grid-common/soft-grid-common.component';
import { SoftGridPaginationComponent } from './soft-grid-pagination/soft-grid-pagination.component';
import { SoftGridComponent } from './soft-grid/soft-grid.component';



@NgModule({
  declarations: [SoftGridComponent],
  imports: [
    CommonModule,
    SoftGridCommonComponent,
    SoftGridPaginationComponent
  ],
  exports: [SoftGridComponent]
})
export class SoftGridModule { }
