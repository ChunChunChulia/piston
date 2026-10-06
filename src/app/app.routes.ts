import { Routes } from '@angular/router';
import { Insert } from './insert/insert';
import { Filtro } from './filtro/filtro';
import { Inicio } from './inicio/inicio';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'verInsert', component: Insert },
  { path: 'verFiltro', component: Filtro }
];