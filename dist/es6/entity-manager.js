//import {inject} from 'aurelia-dependency-injection';
import {BaseConfig} from './base-config';

//@inject(BaseConfig)
export class EntityManager {
  constructor(baseConfig) {
    this.baseConfig = baseConfig;
  }
}
