import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  API_KEY: string = 'AIzaSyAi0x-9oCWtUDeKbhfJYEavHOqk2ch4RbI';
  selectedAddress: any;
  title = 'app';
  setSelectedAddress(address: any){
    this.selectedAddress = address.description;
  }
}
