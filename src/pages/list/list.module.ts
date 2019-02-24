import {NgModule} from "@angular/core";
import {ListPage} from "./list";
import {IonicPageModule} from "ionic-angular";


@NgModule({
  imports: [
    IonicPageModule.forChild(ListPage)
  ],
  declarations: [
    ListPage
  ],

})

export class ListPageModule {}
