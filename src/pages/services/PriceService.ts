import {Injectable} from "@angular/core";


@Injectable()
export class PriceService{
  public estimations: Array<Object>;
  constructor() { }

  getEstimations(): Array<Object> {
    return this.estimations;
  }

  setEstimations(value: Array<Object>) {
    this.estimations = value;
  }
}
