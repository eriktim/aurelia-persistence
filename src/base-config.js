const configs = new WeakMap();

export class BaseConfig {
  configure(config) {
    Object.assign(configs.get(this), config);
  }

  get current() {
    return configs.get(this);
  }

  constructor() {
    configs.set(this, {
      baseUrl: 'baseUrl'
    });
  }
}
