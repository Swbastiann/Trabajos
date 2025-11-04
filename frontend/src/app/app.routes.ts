import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { AiDashboardComponent } from './components/ai-dashboard/ai-dashboard.component';

export const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'new', component: ItemFormComponent },
  { path: 'edit/:id', component: ItemFormComponent },
  { path: 'ai-dashboard', component: AiDashboardComponent }
];
