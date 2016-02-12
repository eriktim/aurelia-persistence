import {BaseConfig} from './base-config';
export {Entity, Field, Transient} from './entity';
export {EntityManager} from './entity-manager';

export function configure(config, configCallback) {
  var baseConfig = config.container.get(BaseConfig);
  if (typeof configCallback === 'function') {
    configCallback(baseConfig);
  }
}
