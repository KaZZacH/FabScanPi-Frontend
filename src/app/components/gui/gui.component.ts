import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export interface CustomMatIcon {
  name: string;
  path: string;
}

@Component({
  selector: 'fabscan-gui',
  templateUrl: './gui.component.html',
  styleUrls: ['./gui.component.css']
})

export class GuiComponent implements OnInit
{

  private customMatIcons: Array<CustomMatIcon> =
  [
    {name: 'fabscan_mesh', path: '../../assets/icon_mesh.svg'},
    {name: 'fabscan_pointcloud', path: '../../assets/icon_pointcloud.svg'},
    {name: 'fabscan_scan', path: '../../assets/icon_scan.svg'}
  ];

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  ngOnInit()
  {
    this.customMatIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
    });
  }

}
