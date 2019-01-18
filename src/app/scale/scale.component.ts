import { Component, OnInit } from '@angular/core';
import { Scale } from '../scale';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})
export class ScaleComponent implements OnInit {
 scale: Scale = {
   id: 2,
   name: 'juicy pears'
 };

  constructor() { }

  ngOnInit() {
  }

}
