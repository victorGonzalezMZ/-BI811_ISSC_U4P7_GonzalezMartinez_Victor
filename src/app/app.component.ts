import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { CSVRecord } from './CSVModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'practica-dashboard-BI';

  chart = [];

  public records: any[] = [];
  @ViewChild('csvReader') csvReader: any;
  

  ngOnInit() {
  }

  uploadListener(fileInput: any) {
    let fileReaded = fileInput.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsText(fileReaded);

    reader.onload = () => {
      let csv: string = reader.result as string;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(',');
      
      let lines = [];

      for (let i = 1; i < allTextLines.length; i++){
        let data = allTextLines[i].split(',');
        if(data.length === headers.length){
          let csvRecord: CSVRecord = new CSVRecord();
          csvRecord.id = data[0].trim();
          csvRecord.name = data[1].trim();
          csvRecord.gender = data[2].trim();
          csvRecord.DOB = data[3].trim();
          csvRecord.MaritalStatus = data[4].trim();
          csvRecord.CreditCardType = data[5].trim();
          lines.push(csvRecord);
        }
      }

      this.pieChart(lines);
      this.barChart(lines);
    }
  }

  barChart(dataset: any[]){
    let header: any[] = [];
    let maleN: number[] = [];
    let femaleN: number[] = [];
    let data_set: any[] = [];

    let countMale = 0;
    let countFemale = 0;

    for(let i = 0; i < dataset.length; i++){
      let CreditCard = dataset[i].CreditCardType;
      header.push(CreditCard);
    }

    header.sort();
    const uniqueSet = new Set(header);
    const backtoArray = [...uniqueSet];

    for(let i = 0; i < backtoArray.length; i++){
      for(let j = 0; j < dataset.length; j++){
        if(dataset[j].CreditCardType === backtoArray[i]){
          let getGender = dataset[j].gender;

          if(getGender === "Male"){
            countMale++;
          }else{
            countFemale++;
          }
        }
      }

      maleN.push(countMale);
      femaleN.push(countFemale);
      countFemale = 0;
      countMale = 0;
    }

    for(let i = 0; i < backtoArray.length; i++){
      if(backtoArray[i] == ""){
        backtoArray[i] = "None";
      }
    }

    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: backtoArray,
        datasets: [
          {
            label: 'Male',
            data: maleN,
            backgroundColor: 'red',
            fill: false,
          },
          {
            label: 'Female',
            data: femaleN,
            backgroundColor: 'blue',
            fill: false,
          },
        ]
      },
      options:{
        title: {
          display: true,
          text: 'Sexo Usuarios x Tarjetas Crédito'
        }
      }
    });
  }

  pieChart(dataset: any[]){
    let header: any[] = [];
    let colors: any[] = [];
    let countCredit: number[] = [];

    for(let i = 0; i < dataset.length; i++){
      let CreditCard = dataset[i].CreditCardType;
      if(CreditCard == "")
      {
        CreditCard = "None";
      }
      header.push(CreditCard);
    }

    header.sort();
    var current = null;
    var cnt = 0;
    for (let i = 0; i < header.length; i++) {
      if (header[i] !== current) {
        if (cnt > 0) {
          countCredit.push(cnt);
        }
        current = header[i];
        cnt = 1;
      } else {
        cnt++;
      } 
    }
    
    countCredit.push(cnt);

    const uniqueSet = new Set(header);
    const backtoArray = [...uniqueSet];

    for(let i = 0; i < backtoArray.length; i++){
      let colorSelection = this.dynamicColors();
      colors.push(colorSelection);
    }

    this.chart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: backtoArray,
        datasets: [
          {
            data: countCredit,
            backgroundColor: colors,
            fill: true,
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Cantidad Usuarios x Tarjetas Crédito'
        }
      }
    });
  }


  dynamicColors(){
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);

    return "rgb(" + r + "," + g + "," + b +")";
  }

}
