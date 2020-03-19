import { Component, OnInit } from '@angular/core';
import evaluate, { registerFunction } from 'ts-expression-evaluator';
import { CharaService } from 'src/app/shared/chara.service';
import { DialogFeatureComponent } from 'src/app/dialogs/dialog-feature/dialog-feature.component';
import { MatDialog } from '@angular/material';
import { Features } from 'src/app/shared/features.model';
import { Chara } from 'src/app/shared/chara.model';

@Component({
  selector: 'app-tab-feature',
  templateUrl: './tab-feature.component.html',
  styleUrls: ['./tab-feature.component.css']
})
export class TabFeatureComponent implements OnInit {
  constructor(private charaservice: CharaService, private featureDialog: MatDialog) { }

  BRACKET_EXPRESSION: RegExp = /\{(.*?)\}/g; // capture {*}    g is for global

  features = [] as Features[];

  // tslint:disable: one-line
  // tslint:disable: no-conditional-assignment
  nonRegularFormula(input) {
    let mutableInput = input;
    this.BRACKET_EXPRESSION.lastIndex = 0;
    try {
      if (this.BRACKET_EXPRESSION.test(input)) {
          let result;
          this.BRACKET_EXPRESSION.lastIndex = 0; // {0} is consumed by replace, now {0} is what was {1}
          while (result = this.BRACKET_EXPRESSION.exec(mutableInput)) {
            mutableInput = mutableInput.replace(result[0], evaluate(result[1], this));
            this.BRACKET_EXPRESSION.lastIndex = 0; // {0} is consumed by replace, now {0} is what was {1}
        }} else {
          // if (mutableInput = evaluate(input, this)) { } // simple formula; {} is implied
          mutableInput = input; }
        //   else {mutableInput = input; } // evaluation failed but didnt throw an error
        // }
      return mutableInput;
    } catch (error) {
      return 'NaN';
    }
  }

  // tslint:disable: variable-name
  openFeatureDialog(selected_feature) {
    // this.features = selected_feature;
    // open accepts 2 params (component, optional_configuration {data: something})
    this.featureDialog.open(DialogFeatureComponent, {data: selected_feature});
  }

  makeNewFeature() {
    // SecretSocketComponent.newFeature(this.charaservice.CharaId);
    this.charaservice.sendback('Make_new_feature', {chara_id: this.charaservice.CharaId});
  }


  ngOnInit() {

    this.charaservice.listenfor('Updated_one_chara').subscribe(data => {
      this.features = (data as Chara).listof_charafeatures;
      console.log('heard updatedonechara');
    });

    this.charaservice.listenfor('Created_new_feature').subscribe(data => {
      this.features.push(data as Features);
      console.log('heard creatednewfeature');
    });

    this.charaservice.listenfor('Updated_one_feature').subscribe(data => {
      const featureIndex = this.features.findIndex(e => e._id === (data as Features)._id);
      this.features[featureIndex] = data as Features;
      console.log('heard updatedonefeature');
    });

    this.charaservice.listenfor('Deleted_one_feature').subscribe(data => {
      // data is a featureid
      const delIndex = this.features.findIndex(e => e._id === data);
      this.features.splice(delIndex, 1);
    });
  }

}
