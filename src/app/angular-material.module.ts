import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { A11yModule } from "@angular/cdk/a11y";
import { CdkTableModule } from "@angular/cdk/table";
import { MatNativeDateModule, MatRippleModule, MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MatPaginatorModule,
  MatPaginatorIntl
} from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { getPolishPaginatorIntl } from "./_utils/polish-paginator-intl";
import { MatProgressSpinnerModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatDatepickerModule, MatButtonModule, MatIconModule, MatCardModule, MatStepperModule, MatTabsModule, MatAutocompleteModule, MatDialogModule } from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [MatTableModule],
  exports: [
    A11yModule,
    CdkTableModule,
    MatPaginatorModule,
    MatRippleModule,
    MatCheckboxModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatAutocompleteModule,
    ScrollingModule,
    MatDialogModule

  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getPolishPaginatorIntl() }, {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'}]
})
export class AngularMaterialModule {}
