import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {MatButtonModule} from "@angular/material/button";


interface SelectInterface {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})


export class AppComponent implements OnInit {

  constructor(private fb: FormBuilder) {

  }

  title = 'danter';
  selectedCalculate = '';
  selectedThermocouple: string;
  temperatureRange= '';
  voltageRange= '';
  calculate: SelectInterface[] = [
    {value: 'temperature', viewValue: 'mV->T'},
    {value: 'voltage', viewValue: 'T->mV'},
  ];
  form: UntypedFormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      calc_type: ['', [Validators.required]],
      thermo_type: ['R', [Validators.required]],
      mv_read: ['', [Validators.required]],
      temp_in: ['', [Validators.required]],
      scale_type: ['', [Validators.required]],
      tempamb: ['', [Validators.required]],
    });
    this.form?.get('scale_type')?.valueChanges?.subscribe((scaleType) => {
      this.thermRangeSet(scaleType)
    })
    // this.form.valueChanges.subscribe((val)=>console.log(val))
    // this.form.valueChanges.subscribe((val)=>console.log(val))

  }


  thermocouple: SelectInterface[] = [
    {value: 'R', viewValue: 'Type-R'},
  ];
  typesTemperature: SelectInterface[] = [
    {value: 'C', viewValue: '°C'},
    {value: 'F', viewValue: '°F'},
    {value: 'K', viewValue: 'K'},
  ];

  // hideField(Ctype) //hides input elements based on calculator type
  // {
  //   if (Ctype === "1") {
  //     document.getElementById("div_mv").style.display = "inline";
  //     document.getElementById("div_temp").style.display = "none";
  //
  //     document.getElementById("res_mv").style.display = "none";
  //     document.getElementById("res_temp").style.display = "inline";
  //   } else {
  //     document.getElementById("div_mv").style.display = "none";
  //     document.getElementById("div_temp").style.display = "inline";
  //
  //     document.getElementById("res_mv").style.display = "inline";
  //     document.getElementById("res_temp").style.display = "none";
  //   }
  // }

  thermCalc() //computes required values for each type
  {

     let calcuType = this.form.get('calc_type')?.value
    let thermoType = this.form.get('thermo_type')?.value
    let  mv_func1 = this.form.get('mv_read')?.value
    let  temp_func1f = this.form.get('temp_in')?.value
    let  scaleType= this.form.get('scale_type')?.value
    let  temp_amb = this.form.get('tempamb')?.value
    console.log("Called calculator")
    let Coef = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //prepare coefficient array
    let Coef_amb = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //prepare ambient coefficients array

    let temp_func1 = 0;
    switch (scaleType) {
      case "C": //for Celsius
        temp_func1 = temp_func1f;
        break;

      case "F": //for Fahrenheit
        temp_func1 = (temp_func1f - 32) * (5 / 9);
        temp_amb = (temp_amb - 32) * (5 / 9);
        break;

      case "K": //for Kelvin
        temp_func1 = temp_func1f - 273.15;
        temp_amb = temp_amb - 273.15;
        break;
    }

    switch (thermoType) //for ambient mv calculation
    {
      case "1": //Type B

        if (temp_amb >= 0 && temp_amb <= 630.616) //Range 1
        {
          let Coef_amb = [0,
            -0.246508183460 * Math.pow(10, -3),
            0.590404211710 * Math.pow(10, -5),
            -0.132579316360 * Math.pow(10, -8),
            0.156682919010 * Math.pow(10, -11),
            -0.169445292400 * Math.pow(10, -14),
            0.629903470940 * Math.pow(10, -18),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 630.616 && temp_amb <= 1820.000) //Range 2
        {
          let Coef_amb = [-0.389381686210 * Math.pow(10, 1),
            0.285717474700 * Math.pow(10, -1),
            -0.848851047850 * Math.pow(10, -4),
            0.157852801640 * Math.pow(10, -6),
            -0.168353448640 * Math.pow(10, -9),
            0.111097940130 * Math.pow(10, -12),
            -0.445154310330 * Math.pow(10, -16),
            0.989756408210 * Math.pow(10, -20),
            -0.937913302890 * Math.pow(10, -24),
            0,
            0,
            0,
            0,
            0,
            0
          ];
        }
        break;

      case "2": //Type E

        if (temp_amb >= -200 && temp_amb <= 0) //Range 1
        {
          let Coef_amb = [0,
            0.586655087080 * Math.pow(10, -1),
            0.454109771240 * Math.pow(10, -4),
            -0.779980486860 * Math.pow(10, -6),
            -0.258001608430 * Math.pow(10, -7),
            -0.594525830570 * Math.pow(10, -9),
            -0.932140586670 * Math.pow(10, -11),
            -0.102876055340 * Math.pow(10, -12),
            -0.803701236210 * Math.pow(10, -15),
            -0.439794973910 * Math.pow(10, -17),
            -0.164147763550 * Math.pow(10, -19),
            -0.396736195160 * Math.pow(10, -22),
            -0.558273287210 * Math.pow(10, -25),
            -0.346578420130 * Math.pow(10, -28),
            0
          ];
        } else if (temp_amb > 0 && temp_amb <= 1000) //Range 2
        {
          let Coef_amb = [0,
            0.586655087100 * Math.pow(10, -1),
            0.450322755820 * Math.pow(10, -4),
            0.289084072120 * Math.pow(10, -7),
            -0.330568966520 * Math.pow(10, -9),
            0.650244032700 * Math.pow(10, -12),
            -0.191974955040 * Math.pow(10, -15),
            -0.125366004970 * Math.pow(10, -17),
            0.214892175690 * Math.pow(10, -20),
            -0.143880417820 * Math.pow(10, -23),
            0.359608994810 * Math.pow(10, -27),
            0,
            0,
            0,
            0
          ];
        }
        break;

      case "3": //Type J
        if (temp_amb >= -210 && temp_amb <= 760) //Range 1
        {
          let Coef_amb = [0,
            0.503811878150 * Math.pow(10, -1),
            0.304758369300 * Math.pow(10, -4),
            -0.856810657200 * Math.pow(10, -7),
            0.132281952950 * Math.pow(10, -9),
            -0.170529583370 * Math.pow(10, -12),
            0.209480906970 * Math.pow(10, -15),
            -0.125383953360 * Math.pow(10, -18),
            0.156317256970 * Math.pow(10, -22),
            0,
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 760 && temp_amb <= 1200) //Range 2
        {
          let Coef_amb = [0.296456256810 * Math.pow(10, 3),
            -0.149761277860 * Math.pow(10, 1),
            0.317871039240 * Math.pow(10, -2),
            -0.318476867010 * Math.pow(10, -5),
            0.157208190040 * Math.pow(10, -8),
            -0.306913690560 * Math.pow(10, -12),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        }
        break;

      case "4": //Type K
        if (temp_amb >= -270 && temp_amb <= 0) //Range 1
        {
          let Coef_amb = [0,
            0.394501280250 * Math.pow(10, -1),
            0.236223735980 * Math.pow(10, -4),
            -0.328589067840 * Math.pow(10, -6),
            -0.499048287770 * Math.pow(10, -8),
            -0.675090591730 * Math.pow(10, -10),
            -0.574103274280 * Math.pow(10, -12),
            -0.310888728940 * Math.pow(10, -14),
            -0.104516093650 * Math.pow(10, -16),
            -0.198892668780 * Math.pow(10, -19),
            -0.163226974860 * Math.pow(10, -22),
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 0 && temp_amb <= 1372) //Range 2
        {
          let Coef_amb = [-0.176004136860 * Math.pow(10, -1),
            0.389212049750 * Math.pow(10, -1),
            0.185587700320 * Math.pow(10, -4),
            -0.994575928740 * Math.pow(10, -7),
            0.318409457190 * Math.pow(10, -9),
            -0.560728448890 * Math.pow(10, -12),
            0.560750590590 * Math.pow(10, -15),
            -0.320207200030 * Math.pow(10, -18),
            0.971511471520 * Math.pow(10, -22),
            -0.121047212750 * Math.pow(10, -25),
            0,
            0,
            0,
            0,
            0
          ];

          //let a0 = 0.118597600000*Math.pow(10,0);  //unused values in source document
          //let a1 = -0.118343200000*Math.pow(10,-3); //values calculated without these
          //let a2 = 0.126968600000*Math.pow(10,3);
        }
        break;

      case "5": //Type N
        if (temp_amb >= -200 && temp_amb <= 0) //Range 1
        {
          let Coef_amb = [0,
            0.261591059620 * Math.pow(10, -1),
            0.109574842280 * Math.pow(10, -4),
            -0.938411115540 * Math.pow(10, -7),
            -0.464120397590 * Math.pow(10, -10),
            -0.263033577160 * Math.pow(10, -11),
            -0.226534380030 * Math.pow(10, -13),
            -0.760893007910 * Math.pow(10, -16),
            -0.934196678350 * Math.pow(10, -19),
            0,
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 0 && temp_amb <= 1300) //Range 2
        {
          let Coef_amb = [0,
            0.259293946010 * Math.pow(10, -1),
            0.157101418800 * Math.pow(10, -4),
            0.438256272370 * Math.pow(10, -7),
            -0.252611697940 * Math.pow(10, -9),
            0.643118193390 * Math.pow(10, -12),
            -0.100634715190 * Math.pow(10, -14),
            0.997453389920 * Math.pow(10, -18),
            -0.608632456070 * Math.pow(10, -21),
            0.208492293390 * Math.pow(10, -24),
            -0.306821961510 * Math.pow(10, -28),
            0,
            0,
            0,
            0
          ];
        }
        break;

      case "R": //Type R
        if (temp_amb >= -50 && temp_amb <= 1064.180) //Range 1
        {
           Coef_amb = [0,
            0.528961729765 * Math.pow(10, -2),
            0.139166589782 * Math.pow(10, -4),
            -0.238855693017 * Math.pow(10, -7),
            0.356916001063 * Math.pow(10, -10),
            -0.462347666298 * Math.pow(10, -13),
            0.500777441034 * Math.pow(10, -16),
            -0.373105886191 * Math.pow(10, -19),
            0.157716482367 * Math.pow(10, -22),
            -0.281038625251 * Math.pow(10, -26),
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 1064.180 && temp_amb <= 1664.500) //Range 2
        {
           Coef_amb = [0.295157925316 * Math.pow(10, 1),
            -0.252061251332 * Math.pow(10, -2),
            0.159564501865 * Math.pow(10, -4),
            -0.764085947576 * Math.pow(10, -8),
            0.205305291024 * Math.pow(10, -11),
            -0.293359668173 * Math.pow(10, -15),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 1664.500 && temp_amb <= 1768.100) //Range 3
        {
           Coef_amb = [0.152232118209 * Math.pow(10, 3),
            -0.268819888545 * Math.pow(10, 0),
            0.171280280471 * Math.pow(10, -3),
            -0.345895706453 * Math.pow(10, -7),
            -0.934633971046 * Math.pow(10, -14),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        }
        break;

      case "7": //Type S
        if (temp_amb >= -50 && temp_amb <= 1064.180) //Range 1
        {
          let Coef_amb = [0,
            0.540313308631 * Math.pow(10, -2),
            0.125934289740 * Math.pow(10, -4),
            -0.232477968689 * Math.pow(10, -7),
            0.322028823036 * Math.pow(10, -10),
            -0.331465196389 * Math.pow(10, -13),
            0.255744251786 * Math.pow(10, -16),
            -0.125068871393 * Math.pow(10, -19),
            0.271443176145 * Math.pow(10, -23),
            0,
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 1064.180 && temp_amb <= 1664.500) //Range 2
        {
          let Coef_amb = [0.132900444085 * Math.pow(10, 1),
            0.334509311344 * Math.pow(10, -2),
            0.654805192818 * Math.pow(10, -5),
            -0.164856259209 * Math.pow(10, -8),
            0.129989605174 * Math.pow(10, -13),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        } else if (temp_amb > 1664.500 && temp_amb <= 1768.100) //Range 3
        {
          let Coef_amb = [0.146628232636 * Math.pow(10, 3),
            -0.258430516752 * Math.pow(10, 0),
            0.163693574641 * Math.pow(10, -3),
            -0.330439046987 * Math.pow(10, -7),
            -0.943223690612 * Math.pow(10, -14),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ];
        }
        break;

      case "8": //Type T
        if (temp_amb >= -200 && temp_amb <= 0) //Range 1
        {
          let Coef_amb = [0,
            0.387481063640 * Math.pow(10, -1),
            0.441944343470 * Math.pow(10, -4),
            0.118443231050 * Math.pow(10, -6),
            0.200329735540 * Math.pow(10, -7),
            0.901380195590 * Math.pow(10, -9),
            0.226511565930 * Math.pow(10, -10),
            0.360711542050 * Math.pow(10, -12),
            0.384939398830 * Math.pow(10, -14),
            0.282135219250 * Math.pow(10, -16),
            0.142515947790 * Math.pow(10, -18),
            0.487686622860 * Math.pow(10, -21),
            0.107955392700 * Math.pow(10, -23),
            0.139450270620 * Math.pow(10, -26),
            0.797951539270 * Math.pow(10, -30)
          ];
        } else if (temp_amb > 0 && temp_amb <= 400) //Range 2
        {
          let Coef_amb = [0,
            0.387481063640 * Math.pow(10, -1),
            0.332922278800 * Math.pow(10, -4),
            0.206182434040 * Math.pow(10, -6),
            -0.218822568460 * Math.pow(10, -8),
            0.109968809280 * Math.pow(10, -10),
            -0.308157587720 * Math.pow(10, -13),
            0.454791352900 * Math.pow(10, -16),
            -0.275129016730 * Math.pow(10, -19),
            0,
            0,
            0,
            0,
            0,
            0
          ];
        }
        break;
    }

    let j;
    let amb_mv = 0;
    for (j = 0; j <= 14; j++) //15th order polynomial summation (for ambient mv calculation)
    {
      amb_mv = amb_mv + Coef_amb[j] * (Math.pow(temp_amb, j));
    }

    /*-------------------------------------------------------------------Ambient mV Ends Here-----------------------------------*/

    switch (thermoType) //for main calculation
    {
      case "1": //B Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= 0.291 && mv_func1 <= 2.431) //Range 1
            {
              let OOR_Flag = 0;
              let Coef = [9.8423321 * Math.pow(10, 1),
                6.9971500 * Math.pow(10, 2),
                -8.4765304 * Math.pow(10, 2),
                1.0052644 * Math.pow(10, 3),
                -8.3345952 * Math.pow(10, 2),
                4.5508542 * Math.pow(10, 2),
                -1.5523037 * Math.pow(10, 2),
                2.9886750 * Math.pow(10, 1),
                -2.4742860 * Math.pow(10, 0),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 2.431 && mv_func1 <= 13.820) //Range 2
            {
              let OOR_Flag = 0;
              let Coef = [2.1315071 * Math.pow(10, 2),
                2.8510504 * Math.pow(10, 2),
                -5.2742887 * Math.pow(10, 1),
                9.9160804 * Math.pow(10, 0),
                -1.2965303 * Math.pow(10, 0),
                1.1195870 * Math.pow(10, -1),
                -6.0625199 * Math.pow(10, -3),
                1.8661696 * Math.pow(10, -4),
                -2.4878585 * Math.pow(10, -6),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 13.820) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < 0.291) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= 250 && temp_func1 <= 630.616) //Range 1
            {
              let OOR_Flag = 0;
              let Coef = [0,
                -0.246508183460 * Math.pow(10, -3),
                0.590404211710 * Math.pow(10, -5),
                -0.132579316360 * Math.pow(10, -8),
                0.156682919010 * Math.pow(10, -11),
                -0.169445292400 * Math.pow(10, -14),
                0.629903470940 * Math.pow(10, -18),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 630.616 && temp_func1 <= 1820.000) //Range 2
            {
              let OOR_Flag = 0;
              let Coef = [-0.389381686210 * Math.pow(10, 1),
                0.285717474700 * Math.pow(10, -1),
                -0.848851047850 * Math.pow(10, -4),
                0.157852801640 * Math.pow(10, -6),
                -0.168353448640 * Math.pow(10, -9),
                0.111097940130 * Math.pow(10, -12),
                -0.445154310330 * Math.pow(10, -16),
                0.989756408210 * Math.pow(10, -20),
                -0.937913302890 * Math.pow(10, -24),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1820.000) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < 250) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "2": //E Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -8.825 && mv_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                1.6977288 * Math.pow(10, 1),
                -4.3514970 * Math.pow(10, -1),
                -1.5859697 * Math.pow(10, -1),
                -9.2502871 * Math.pow(10, -2),
                -2.6084314 * Math.pow(10, -2),
                -4.1360199 * Math.pow(10, -3),
                -3.4034030 * Math.pow(10, -4),
                -1.1564890 * Math.pow(10, -5),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 0 && mv_func1 <= 76.373) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                1.7057035 * Math.pow(10, 1),
                -2.3301759 * Math.pow(10, -1),
                6.5435585 * Math.pow(10, -3),
                -7.3562749 * Math.pow(10, -5),
                -1.7896001 * Math.pow(10, -6),
                8.4036165 * Math.pow(10, -8),
                -1.3735879 * Math.pow(10, -9),
                1.0629823 * Math.pow(10, -11),
                -3.2447087 * Math.pow(10, -14),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 76.373) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -8.825) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -200 && temp_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.586655087080 * Math.pow(10, -1),
                0.454109771240 * Math.pow(10, -4),
                -0.779980486860 * Math.pow(10, -6),
                -0.258001608430 * Math.pow(10, -7),
                -0.594525830570 * Math.pow(10, -9),
                -0.932140586670 * Math.pow(10, -11),
                -0.102876055340 * Math.pow(10, -12),
                -0.803701236210 * Math.pow(10, -15),
                -0.439794973910 * Math.pow(10, -17),
                -0.164147763550 * Math.pow(10, -19),
                -0.396736195160 * Math.pow(10, -22),
                -0.558273287210 * Math.pow(10, -25),
                -0.346578420130 * Math.pow(10, -28),
                0
              ];
            } else if (temp_func1 > 0 && temp_func1 <= 1000) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.586655087100 * Math.pow(10, -1),
                0.450322755820 * Math.pow(10, -4),
                0.289084072120 * Math.pow(10, -7),
                -0.330568966520 * Math.pow(10, -9),
                0.650244032700 * Math.pow(10, -12),
                -0.191974955040 * Math.pow(10, -15),
                -0.125366004970 * Math.pow(10, -17),
                0.214892175690 * Math.pow(10, -20),
                -0.143880417820 * Math.pow(10, -23),
                0.359608994810 * Math.pow(10, -27),
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1000) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < -200) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "3": //J Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -8.095 && mv_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                1.9528268 * Math.pow(10, 1),
                -1.2286185 * Math.pow(10, 0),
                -1.0752178 * Math.pow(10, 0),
                -5.9086933 * Math.pow(10, -1),
                -1.7256713 * Math.pow(10, -1),
                -2.8131513 * Math.pow(10, -2),
                -2.3963370 * Math.pow(10, -3),
                -8.3823321 * Math.pow(10, -5),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 0 && mv_func1 <= 42.919) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                1.978425 * Math.pow(10, 1),
                -2.001204 * Math.pow(10, -1),
                1.036969 * Math.pow(10, -2),
                -2.549687 * Math.pow(10, -4),
                3.585153 * Math.pow(10, -6),
                -5.344285 * Math.pow(10, -8),
                5.099890 * Math.pow(10, -10),
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 42.919 && mv_func1 <= 69.553) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [-3.11358187 * Math.pow(10, 3),
                3.00543684 * Math.pow(10, 2),
                -9.94773230 * Math.pow(10, 0),
                1.70276630 * Math.pow(10, -1),
                -1.43033468 * Math.pow(10, -3),
                4.73886084 * Math.pow(10, -6),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 69.553) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -8.095) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -210 && temp_func1 <= 760) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.503811878150 * Math.pow(10, -1),
                0.304758369300 * Math.pow(10, -4),
                -0.856810657200 * Math.pow(10, -7),
                0.132281952950 * Math.pow(10, -9),
                -0.170529583370 * Math.pow(10, -12),
                0.209480906970 * Math.pow(10, -15),
                -0.125383953360 * Math.pow(10, -18),
                0.156317256970 * Math.pow(10, -22),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 760 && temp_func1 <= 1200) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0.296456256810 * Math.pow(10, 3),
                -0.149761277860 * Math.pow(10, 1),
                0.317871039240 * Math.pow(10, -2),
                -0.318476867010 * Math.pow(10, -5),
                0.157208190040 * Math.pow(10, -8),
                -0.306913690560 * Math.pow(10, -12),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1200) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < 210) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "4": //K Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -5.891 && mv_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                2.5173462 * Math.pow(10, 1),
                -1.1662878 * Math.pow(10, 0),
                -1.0833638 * Math.pow(10, 0),
                -8.9773540 * Math.pow(10, -1),
                -3.7342377 * Math.pow(10, -1),
                -8.6632643 * Math.pow(10, -2),
                -1.0450598 * Math.pow(10, -2),
                -5.1920577 * Math.pow(10, -4),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 0 && mv_func1 <= 20.644) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                2.508355 * Math.pow(10, 1),
                7.860106 * Math.pow(10, -2),
                -2.503131 * Math.pow(10, -1),
                8.315270 * Math.pow(10, -2),
                -1.228034 * Math.pow(10, -2),
                9.804036 * Math.pow(10, -4),
                -4.413030 * Math.pow(10, -5),
                1.057734 * Math.pow(10, -6),
                -1.052755 * Math.pow(10, -8),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 20.644 && mv_func1 <= 54.886) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [-1.318058 * Math.pow(10, 2),
                4.830222 * Math.pow(10, 1),
                -1.646031 * Math.pow(10, 0),
                5.464731 * Math.pow(10, -2),
                -9.650715 * Math.pow(10, -4),
                8.802193 * Math.pow(10, -6),
                -3.110810 * Math.pow(10, -8),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 54.886) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -5.891) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -270 && temp_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.394501280250 * Math.pow(10, -1),
                0.236223735980 * Math.pow(10, -4),
                -0.328589067840 * Math.pow(10, -6),
                -0.499048287770 * Math.pow(10, -8),
                -0.675090591730 * Math.pow(10, -10),
                -0.574103274280 * Math.pow(10, -12),
                -0.310888728940 * Math.pow(10, -14),
                -0.104516093650 * Math.pow(10, -16),
                -0.198892668780 * Math.pow(10, -19),
                -0.163226974860 * Math.pow(10, -22),
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 0 && temp_func1 <= 1372) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [-0.176004136860 * Math.pow(10, -1),
                0.389212049750 * Math.pow(10, -1),
                0.185587700320 * Math.pow(10, -4),
                -0.994575928740 * Math.pow(10, -7),
                0.318409457190 * Math.pow(10, -9),
                -0.560728448890 * Math.pow(10, -12),
                0.560750590590 * Math.pow(10, -15),
                -0.320207200030 * Math.pow(10, -18),
                0.971511471520 * Math.pow(10, -22),
                -0.121047212750 * Math.pow(10, -25),
                0,
                0,
                0,
                0,
                0
              ];

              //let a0 = 0.118597600000*Math.pow(10,0);  //unused values in source document
              //let a1 = -0.118343200000*Math.pow(10,-3); //values calculated without these
              //let a2 = 0.126968600000*Math.pow(10,3);
            } else if (temp_func1 > 1372) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < -270) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "5": //N Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -3.990 && mv_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                3.8436847 * Math.pow(10, 1),
                1.1010485 * Math.pow(10, 0),
                5.2229312 * Math.pow(10, 0),
                7.2060525 * Math.pow(10, 0),
                5.8488586 * Math.pow(10, 0),
                2.7754916 * Math.pow(10, 0),
                7.7075166 * Math.pow(10, -1),
                1.1582665 * Math.pow(10, -1),
                7.3138868 * Math.pow(10, -3),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 0 && mv_func1 <= 20.613) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                3.86896 * Math.pow(10, 1),
                -1.08267 * Math.pow(10, 0),
                4.70205 * Math.pow(10, -2),
                -2.12169 * Math.pow(10, -6),
                -1.17272 * Math.pow(10, -4),
                5.39280 * Math.pow(10, -6),
                -7.98156 * Math.pow(10, -8),
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 20.613 && mv_func1 <= 47.513) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [1.972485 * Math.pow(10, 1),
                3.300943 * Math.pow(10, 1),
                -3.915159 * Math.pow(10, -1),
                9.855391 * Math.pow(10, -3),
                -1.274371 * Math.pow(10, -4),
                7.767022 * Math.pow(10, -7),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 47.513) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -3.990) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -200 && temp_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.261591059620 * Math.pow(10, -1),
                0.109574842280 * Math.pow(10, -4),
                -0.938411115540 * Math.pow(10, -7),
                -0.464120397590 * Math.pow(10, -10),
                -0.263033577160 * Math.pow(10, -11),
                -0.226534380030 * Math.pow(10, -13),
                -0.760893007910 * Math.pow(10, -16),
                -0.934196678350 * Math.pow(10, -19),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 0 && temp_func1 <= 1300) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.259293946010 * Math.pow(10, -1),
                0.157101418800 * Math.pow(10, -4),
                0.438256272370 * Math.pow(10, -7),
                -0.252611697940 * Math.pow(10, -9),
                0.643118193390 * Math.pow(10, -12),
                -0.100634715190 * Math.pow(10, -14),
                0.997453389920 * Math.pow(10, -18),
                -0.608632456070 * Math.pow(10, -21),
                0.208492293390 * Math.pow(10, -24),
                -0.306821961510 * Math.pow(10, -28),
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1300) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < -200) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "R": //R Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -0.226 && mv_func1 <= 1.923) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [0,
                1.8891380 * Math.pow(10, 2),
                -9.3835290 * Math.pow(10, 1),
                1.3068619 * Math.pow(10, 2),
                -2.2703580 * Math.pow(10, 2),
                3.5145659 * Math.pow(10, 2),
                -3.8953900 * Math.pow(10, 2),
                2.8239471 * Math.pow(10, 2),
                -1.2607281 * Math.pow(10, 2),
                3.1353611 * Math.pow(10, 1),
                -3.3187769 * Math.pow(10, 0),
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 1.923 && mv_func1 <= 13.228) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [1.334584505 * Math.pow(10, 1),
                1.472644573 * Math.pow(10, 2),
                -1.844024844 * Math.pow(10, 1),
                4.031129726 * Math.pow(10, 0),
                -6.249428360 * Math.pow(10, -1),
                6.468412046 * Math.pow(10, -2),
                -4.458750426 * Math.pow(10, -3),
                1.994710149 * Math.pow(10, -4),
                -5.313401790 * Math.pow(10, -6),
                6.481976217 * Math.pow(10, -8),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 13.228 && mv_func1 <= 19.739) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [-8.199599416 * Math.pow(10, 1),
                1.553962042 * Math.pow(10, 2),
                -8.342197663 * Math.pow(10, 0),
                4.279433549 * Math.pow(10, -1),
                -1.191577910 * Math.pow(10, -2),
                1.492290091 * Math.pow(10, -4),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 19.739 && mv_func1 <= 21.103) //Range 4
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [3.406177836 * Math.pow(10, 4),
                -7.023729171 * Math.pow(10, 3),
                5.582903813 * Math.pow(10, 2),
                -1.952394635 * Math.pow(10, 1),
                2.560740231 * Math.pow(10, -1),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 21.103) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -0.226) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -50 && temp_func1 <= 1064.180) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [0,
                0.528961729765 * Math.pow(10, -2),
                0.139166589782 * Math.pow(10, -4),
                -0.238855693017 * Math.pow(10, -7),
                0.356916001063 * Math.pow(10, -10),
                -0.462347666298 * Math.pow(10, -13),
                0.500777441034 * Math.pow(10, -16),
                -0.373105886191 * Math.pow(10, -19),
                0.157716482367 * Math.pow(10, -22),
                -0.281038625251 * Math.pow(10, -26),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1064.180 && temp_func1 <= 1664.500) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [0.295157925316 * Math.pow(10, 1),
                -0.252061251332 * Math.pow(10, -2),
                0.159564501865 * Math.pow(10, -4),
                -0.764085947576 * Math.pow(10, -8),
                0.205305291024 * Math.pow(10, -11),
                -0.293359668173 * Math.pow(10, -15),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1664.500 && temp_func1 <= 1768.100) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
               Coef = [0.152232118209 * Math.pow(10, 3),
                -0.268819888545 * Math.pow(10, 0),
                0.171280280471 * Math.pow(10, -3),
                -0.345895706453 * Math.pow(10, -7),
                -0.934633971046 * Math.pow(10, -14),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1768.100) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < -50) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "7": //S Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -0.235 && mv_func1 <= 1.874) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                1.84949460 * Math.pow(10, 2),
                -8.00504062 * Math.pow(10, 1),
                1.02237430 * Math.pow(10, 2),
                -1.52248592 * Math.pow(10, 2),
                1.88821343 * Math.pow(10, 2),
                -1.59085941 * Math.pow(10, 2),
                8.23027880 * Math.pow(10, 1),
                -2.34181944 * Math.pow(10, 1),
                2.79786260 * Math.pow(10, 0),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 1.874 && mv_func1 <= 11.950) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [1.291507177 * Math.pow(10, 1),
                1.466298863 * Math.pow(10, 2),
                -1.534713402 * Math.pow(10, 1),
                3.145945973 * Math.pow(10, 0),
                -4.163257839 * Math.pow(10, -1),
                3.187963771 * Math.pow(10, -2),
                -1.291637500 * Math.pow(10, -3),
                2.183475087 * Math.pow(10, -5),
                -1.447379511 * Math.pow(10, -7),
                8.211272125 * Math.pow(10, -9),
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 11.950 && mv_func1 <= 17.536) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [-8.087801117 * Math.pow(10, 1),
                1.621573104 * Math.pow(10, 2),
                -8.536869453 * Math.pow(10, 0),
                4.719686976 * Math.pow(10, -1),
                -1.441693666 * Math.pow(10, -2),
                2.081618890 * Math.pow(10, -4),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 17.536 && mv_func1 <= 18.693) //Range 4
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [5.333875126 * Math.pow(10, 4),
                -1.235892298 * Math.pow(10, 4),
                1.092657613 * Math.pow(10, 3),
                -4.265693686 * Math.pow(10, 1),
                6.247205420 * Math.pow(10, -1),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 18.693) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -0.235) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -50 && temp_func1 <= 1064.180) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.540313308631 * Math.pow(10, -2),
                0.125934289740 * Math.pow(10, -4),
                -0.232477968689 * Math.pow(10, -7),
                0.322028823036 * Math.pow(10, -10),
                -0.331465196389 * Math.pow(10, -13),
                0.255744251786 * Math.pow(10, -16),
                -0.125068871393 * Math.pow(10, -19),
                0.271443176145 * Math.pow(10, -23),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1064.180 && temp_func1 <= 1664.500) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0.132900444085 * Math.pow(10, 1),
                0.334509311344 * Math.pow(10, -2),
                0.654805192818 * Math.pow(10, -5),
                -0.164856259209 * Math.pow(10, -8),
                0.129989605174 * Math.pow(10, -13),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1664.500 && temp_func1 <= 1768.100) //Range 3
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0.146628232636 * Math.pow(10, 3),
                -0.258430516752 * Math.pow(10, 0),
                0.163693574641 * Math.pow(10, -3),
                -0.330439046987 * Math.pow(10, -7),
                -0.943223690612 * Math.pow(10, -14),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 1768.100) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < -50) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;

      case "8": //T Type
        switch (calcuType) {
          case "temperature": //mV to T(inverse)
            if (mv_func1 >= -5.603 && mv_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                2.5949192 * Math.pow(10, 1),
                -2.1316967 * Math.pow(10, -1),
                7.9018692 * Math.pow(10, -1),
                4.2527777 * Math.pow(10, -1),
                1.3304473 * Math.pow(10, -1),
                2.0241446 * Math.pow(10, -2),
                1.2668171 * Math.pow(10, -3),
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 0 && mv_func1 <= 20.872) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                2.592800 * Math.pow(10, 1),
                -7.602961 * Math.pow(10, -1),
                4.637791 * Math.pow(10, -2),
                -2.165394 * Math.pow(10, -3),
                6.048144 * Math.pow(10, -5),
                -7.293422 * Math.pow(10, -7),
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (mv_func1 > 20.872) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (mv_func1 < -5.603) {
              let OOR_Flag = 2;
            }
            break;

          case "voltage": //T to mV
            if (temp_func1 >= -200 && temp_func1 <= 0) //Range 1
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.387481063640 * Math.pow(10, -1),
                0.441944343470 * Math.pow(10, -4),
                0.118443231050 * Math.pow(10, -6),
                0.200329735540 * Math.pow(10, -7),
                0.901380195590 * Math.pow(10, -9),
                0.226511565930 * Math.pow(10, -10),
                0.360711542050 * Math.pow(10, -12),
                0.384939398830 * Math.pow(10, -14),
                0.282135219250 * Math.pow(10, -16),
                0.142515947790 * Math.pow(10, -18),
                0.487686622860 * Math.pow(10, -21),
                0.107955392700 * Math.pow(10, -23),
                0.139450270620 * Math.pow(10, -26),
                0.797951539270 * Math.pow(10, -30)
              ];
            } else if (temp_func1 > 0 && temp_func1 <= 400) //Range 2
            {
              let OOR_Flag = 0; //Out of Range OFF
              let Coef = [0,
                0.387481063640 * Math.pow(10, -1),
                0.332922278800 * Math.pow(10, -4),
                0.206182434040 * Math.pow(10, -6),
                -0.218822568460 * Math.pow(10, -8),
                0.109968809280 * Math.pow(10, -10),
                -0.308157587720 * Math.pow(10, -13),
                0.454791352900 * Math.pow(10, -16),
                -0.275129016730 * Math.pow(10, -19),
                0,
                0,
                0,
                0,
                0,
                0
              ];
            } else if (temp_func1 > 400) {
              let OOR_Flag = 1;
            } //Out of Range ON
            else if (temp_func1 < -200) {
              let OOR_Flag = 2;
            }
            break;
        }
        break;
    }

    let result = 0;
    switch (calcuType) {
      case "temperature":
        for (let i = 0; i <= 14; i++) //15th order polynomial summation (main equation for all types)
        {
          result = result + Coef[i] * (Math.pow(parseFloat(mv_func1) + amb_mv, i));
        }

        //TempScale Adjustments
        if (scaleType === "F") //for fahrenheit
        {
          result = (result * (9 / 5)) + 32;
        } else if (scaleType === "K") //for kelvin
        {
          result = result + 273.15;
        }
debugger
        result = Math.round(result * 1000) / 1000
        this.form.get('temp_in')?.setValue(result - amb_mv);
        break;

      case "voltage":
        for (let i = 0; i <= 14; i++) //15th order polynomial summation (main equation for all types)
        {
          result = result + Coef[i] * (Math.pow(temp_func1, i));
        }
        result = Math.round(result * 1000) / 1000
        this.form.get('mv_read')?.setValue(result - amb_mv);
        break;
    }


    // if (OOR_Flag === 0) //Not out of range
    // {
    //   if (temp_amb > 60) //ambient out of range error handling starts here
    //   {
    //     alert("Ambient temperature too high.");
    //   } else if (temp_amb < 0) {
    //     alert("Ambient temperature too low.");
    //   } else {
    //     switch (calcuType) {
    //       case "1": //mV to T
    //         document.getElementById("resultFieldtemp").value = result;
    //         break;
    //
    //       case "2": //T to mV
    //         document.getElementById("resultFieldmv").value = result;
    //         break;
    //     }
    //   }
    // } else if (OOR_Flag === 1) //Over the Range
    // {
    //   switch (calcuType) {
    //     case "1":
    //       alert("Input voltage too high.");
    //       break;
    //
    //     case "2":
    //       alert("Input temperature too high.");
    //       break;
    //   }
    //
    // } else if (OOR_Flag === 2) //Under the Range
    // {
    //   switch (calcuType) {
    //     case "1":
    //       alert("Input voltage too low.");
    //       break;
    //
    //     case "2":
    //       alert("Input temperature too low.");
    //       break;
    //   }
    //
    // }
  }

  // rangeSet(ThermType, caletyp) //displays the range for current thermocouple
  // {
  //
  //   if (Scaletyp === "1") { //for Celsius
  //     switch (Thermtyp) {
  //       // case "1": //Type B
  //       //   document.getElementById("TempRange").innerHTML = "250 to 1820 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "0.291 to 13.820 mV";
  //       //   break;
  //       //
  //       // case "2": //Type E
  //       //   document.getElementById("TempRange").innerHTML = "-200 to 1000 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "-8.825 to 76.373 mV";
  //       //   break;
  //       //
  //       // case "3": //Type J
  //       //   document.getElementById("TempRange").innerHTML = "-210 to 1200 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "-8.095 to 69.553 mV";
  //       //   break;
  //       //
  //       // case "4": //Type K
  //       //   document.getElementById("TempRange").innerHTML = "-200 to 1372 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "-5.891 to 54.886 mV";
  //       //   break;
  //       //
  //       // case "5": //Type N
  //       //   document.getElementById("TempRange").innerHTML = "-200 to 1300 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "-3.990 to 47.513 mV";
  //       //   break;
  //
  //       case "6": //Type R
  //         document.getElementById("TempRange").innerHTML = "-50 to 1768.100 &deg;C";
  //         document.getElementById("VoltRange").innerHTML = "-0.226 to 21.103 mV";
  //         break;
  //
  //       // case "7": //Type S
  //       //   document.getElementById("TempRange").innerHTML = "-50 to 1768.100 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "-0.235 to 18.693 mV";
  //       //   break;
  //       //
  //       // case "8": //Type T
  //       //   document.getElementById("TempRange").innerHTML = "-200 to 400 &deg;C";
  //       //   document.getElementById("VoltRange").innerHTML = "-5.603 to 20.872 mV";
  //       //   break;
  //
  //     }
  //   } //end if and switch
  //
  //   if (Scaletyp === "2") { //for Fahrenheit
  //     switch (Thermtyp) {
  //       case "1": //Type B
  //         document.getElementById("TempRange").innerHTML = "482 to 3308 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "0.291 to 13.820 mV";
  //         break;
  //
  //       case "2": //Type E
  //         document.getElementById("TempRange").innerHTML = "-328 to 1832 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-8.825 to 76.373 mV";
  //         break;
  //
  //       case "3": //Type J
  //         document.getElementById("TempRange").innerHTML = "-346 to 2192 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-8.095 to 69.553 mV";
  //         break;
  //
  //       case "4": //Type K
  //         document.getElementById("TempRange").innerHTML = "-328 to 2501.6 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-5.891 to 54.886 mV";
  //         break;
  //
  //       case "5": //Type N
  //         document.getElementById("TempRange").innerHTML = "-328 to 2372 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-3.990 to 47.513 mV";
  //         break;
  //
  //       case "6": //Type R
  //         document.getElementById("TempRange").innerHTML = "-58 to 3214.58 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-0.226 to 21.103 mV";
  //         break;
  //
  //       case "7": //Type S
  //         document.getElementById("TempRange").innerHTML = "-58 to 3214.58 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-0.235 to 18.693 mV";
  //         break;
  //
  //       case "8": //Type T
  //         document.getElementById("TempRange").innerHTML = "-328 to 752 &deg;F";
  //         document.getElementById("VoltRange").innerHTML = "-5.603 to 20.872 mV";
  //         break;
  //
  //     }
  //   } //end if and switch
  //
  //   if (Scaletyp === "3") { //for Kelvin
  //     switch (Thermtyp) {
  //       case "1": //Type B
  //         document.getElementById("TempRange").innerHTML = "523.15 to 2093.15 K";
  //         document.getElementById("VoltRange").innerHTML = "0.291 to 13.820 mV";
  //         break;
  //
  //       case "2": //Type E
  //         document.getElementById("TempRange").innerHTML = "73.15 to 1273.15 K";
  //         document.getElementById("VoltRange").innerHTML = "-8.825 to 76.373 mV";
  //         break;
  //
  //       case "3": //Type J
  //         document.getElementById("TempRange").innerHTML = "63.15 to 1473.15 K";
  //         document.getElementById("VoltRange").innerHTML = "-8.095 to 69.553 mV";
  //         break;
  //
  //       case "4": //Type K
  //         document.getElementById("TempRange").innerHTML = "73.15 to 1645.15 K";
  //         document.getElementById("VoltRange").innerHTML = "-5.891 to 54.886 mV";
  //         break;
  //
  //       case "5": //Type N
  //         document.getElementById("TempRange").innerHTML = "73.15 to 1573.15 K";
  //         document.getElementById("VoltRange").innerHTML = "-3.990 to 47.513 mV";
  //         break;
  //
  //       case "6": //Type R
  //         document.getElementById("TempRange").innerHTML = "223.15 to 2041.25 K";
  //         document.getElementById("VoltRange").innerHTML = "-0.226 to 21.103 mV";
  //         break;
  //
  //       case "7": //Type S
  //         document.getElementById("TempRange").innerHTML = "223 to 2041.25 K";
  //         document.getElementById("VoltRange").innerHTML = "-0.235 to 18.693 mV";
  //         break;
  //
  //       case "8": //Type T
  //         document.getElementById("TempRange").innerHTML = "73 to 673.15 K";
  //         document.getElementById("VoltRange").innerHTML = "-5.603 to 20.872 mV";
  //         break;
  //
  //     }
  //   } //end if and switch
  // }

  thermRangeSet(scaleType: string) {
    switch (scaleType) {
      case "C": //Type R
        this.temperatureRange = "-50 to 1768.100 °C";
        this.voltageRange = "-0.226 to 21.103 mV";
        break;

      case "F": //Type R
        this.temperatureRange = "-58 to 3214.58 °F";
        this.voltageRange = "-0.226 to 21.103 mV";
        break;

      case "K": //Type R
        this.temperatureRange = "223.15 to 2041.25 K";
        this.voltageRange = "-0.226 to 21.103 mV";
        break;
    }
  }


  // updateAmb(Tscale) { макс значения для  Ambient Temperature
  //   switch (Tscale) {
  //     case "1":
  //       document.getElementById("tempamb").value = 25;
  //       break;
  //
  //     case "2":
  //       document.getElementById("tempamb").value = 77;
  //       break;
  //
  //     case "3":
  //       document.getElementById("tempamb").value = 298;
  //       break;
  //   }
  // }
  //
  // clearFields() {
  //   document.getElementById("resultFieldtemp").value = "";
  //   document.getElementById("resultFieldmv").value = "";
  // }
}
