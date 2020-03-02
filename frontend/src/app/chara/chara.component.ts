/// defines the forms and stuff for chara
import { Component, OnInit, OnDestroy} from '@angular/core';

import { CharaService } from '../shared/chara.service';

@Component({
  selector: 'app-chara',
  templateUrl: './chara.component.html',
  styleUrls: ['./chara.component.css'],

  providers: [CharaService]
})
export class CharaComponent implements OnInit {

  constructor(private charaService: CharaService) { }

   ngOnInit() { } // end.of ngoninit

}
