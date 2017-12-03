import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';

@NgModule({
   imports: [MatButtonModule, MatFormFieldModule, MatCardModule],
    exports: [MatButtonModule, MatFormFieldModule, MatCardModule]
})

export class MaterialModule{

}