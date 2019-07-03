import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularMaterialModule } from './materials.module';

import { FabscanComponent } from './components/fabscan.component';
import { RenderComponent } from './components/rendering/render.component';
import { GuiComponent } from './components/gui/gui.component';
import { BottomBarComponent } from './components/gui/bottom-bar/bottom-bar.component';

import { SideBarComponent } from './components/gui/side-bar/side-bar.component';

@NgModule({
  declarations: [
    FabscanComponent,
    RenderComponent,
    GuiComponent,
    BottomBarComponent,
    SideBarComponent
  ],
  imports: [
    BrowserModule, AngularMaterialModule
  ],
  providers: [],
  bootstrap: [FabscanComponent]
})
export class FabscanModule { }
