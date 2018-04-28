import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  @Input() API_KEY: string;
  @Input() language: string;
  @Input() location: Array<string>;
  @Input() radius: number;
  @Input() strictbounds: boolean;
  @Output() giveBack = new EventEmitter<any>();

  loading: boolean = false;
  addressInput: string = '';
  predictions: Object[];
  selectedAddress: any;
  errorMessage: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  submitForm(){
    if(this.predictions && this.predictions.length > 0){
      this.selectedAddress = this.predictions[0];
      this.addressInput = '';
      this.predictions = null;
      this.giveBack.emit(this.selectedAddress);
    } else {
      this.setMessage(true);
    }
  }

  suggestionSelected(suggestion: any){
    this.selectedAddress = suggestion;
    this.addressInput = '';
    this.predictions = null;
    this.giveBack.emit(this.selectedAddress);
  }

  keyUpHandler(){
    this.predictions = null;
    if(this.addressInput.length>=5){
        const address = this.addressInput;
        setTimeout(() => {
            if(address === this.addressInput){
                this.makeApiCall(address, this.handleResponse);
            }
        }, 100);
    }
  }

  makeApiCall(address: string, responseHandler: any){
    this.loading = true;
    const options = {
      withCredentials: false,      
    };
    const queryOptions = {
      input: address,
      key: this.API_KEY,
      types: 'address'
    };
    this.addGranularOptions(queryOptions);
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com';
    const API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete';
    const BASE_URL = corsProxyUrl + '/' + API_URL;
    const queryString = this.encodeQuery(queryOptions);
    const callUrl = BASE_URL + '/json?' + queryString;
    
    this.httpClient.get(callUrl, options)
            .toPromise()
            .then((response: any) => {
              console.log('api call response: ', response);
              this.handleResponse(response);           
              this.loading = false;
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
  }

  encodeQuery(data: any) {
    let ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }

  addGranularOptions(queryOptions: any){
    if(this.location){
      queryOptions.location = this.location;
    }
    if(this.radius){
      queryOptions.radius = this.radius;
    }
    if(this.strictbounds){
      queryOptions.strictbounds = this.strictbounds;
    }
    if(this.language){
      queryOptions.language = this.language;
    }
  }

  handleResponse(response: any){
    if(response && response.predictions.length > 0){
      this.predictions = response.predictions;
      this.setMessage(false);
    } else {
      this.setMessage(true);
    }   
  }

  setMessage(boo: boolean){
    if(boo){
      this.errorMessage = 'Please insert a valid address';
    } else {
      this.errorMessage = null;
    }
  }
}
