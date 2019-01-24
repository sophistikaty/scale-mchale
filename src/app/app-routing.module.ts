import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeComponent } from './recipe/recipe.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { ScaleComponent } from './scale/scale.component';

const routes: Routes = [
  { path: '', redirectTo: '/scale', pathMatch: 'full' },
  { path: 'scale', component: ScaleComponent },
  { path: 'recipes', component: RecipeComponent },
  { path: 'detail/:id', component: RecipeDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
