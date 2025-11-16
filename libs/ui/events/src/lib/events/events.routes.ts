import { Routes } from '@angular/router';
import { EventsPage } from './events-page';
import { PredictionsPage } from './predictions-page';

export const EventsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EventsPage,
  },
  {
    path: 'predictions',
    component: PredictionsPage,
  },
];
