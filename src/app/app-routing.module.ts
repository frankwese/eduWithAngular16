import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CollectionCountHistoryComponent,
  CountsWithHistoryComponent,
  QualityMatrixComponent
} from 'ngx-edu-sharing-metaqs2';

export const routes: Routes = [
  { path: 'quality-matrix', component: QualityMatrixComponent},
  {
    path: 'license-count-sources',
    component: CountsWithHistoryComponent,
    data: { title: 'pageTitle.license-count-sources', apiMethod: 'getLicenseCountsByReplicationSource' },
  },
  {
    path: 'collection-count-history',
    component: CollectionCountHistoryComponent,
  },
  { path: '',   redirectTo: '/quality-matrix', pathMatch: 'full' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
