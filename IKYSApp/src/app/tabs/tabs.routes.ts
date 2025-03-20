import { Routes } from '@angular/router';
import { Tab1Page } from '../tab1/tab1.page';
import { Tab2Page } from '../tab2/tab2.page';
import { Tab3Page } from '../tab3/tab3.page';

export const routes: Routes = [
  {
    path: 'tab1',
    component: Tab1Page, // Tab1 ana sayfası
  },
  {
    path: 'tab2',
    component: Tab2Page, // Tab2 ekleme/düzenleme sayfası
  },
  {
    path: 'tab2/:id', // Dinamik ID parametresi için rota
    component: Tab2Page, // Tab2 ekleme/düzenleme sayfası (düzenleme modu)
  },
  {
    path: 'tab3/:id', // Tab3 detay sayfası
    component: Tab3Page, // Dinamik ID alan detay sayfası
  },
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full', // Varsayılan olarak Tab1'e yönlendir
  },
];