import { NgModule } from '@angular/core';
import { RequestComponent } from './request/request';
import {IonicModule} from "ionic-angular";
import {TranslateModule} from "@ngx-translate/core";
@NgModule({
	declarations: [RequestComponent],
	imports: [IonicModule, TranslateModule.forChild()],
	exports: [RequestComponent]
})
export class ComponentsModule {}
