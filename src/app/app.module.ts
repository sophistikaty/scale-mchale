import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';

import { FormsModule } from '@angular/forms';

import { ScaleComponent } from './scale/scale.component';
import { CardboxComponent } from './cardbox/cardbox.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { HomeComponent } from './home/home.component';
import { RecipeSearchComponent } from './recipe-search/recipe-search.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { CardboxModule } from './cardbox/cardbox.module';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ScaleComponent,
    CardboxComponent,
    RecipeDetailComponent,
    HomeComponent,
    RecipeSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({}), CardboxModule
  ],
  providers: [
    AppConfig,
       { provide: APP_INITIALIZER,
         useFactory: initializeApp,
         deps: [AppConfig], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
