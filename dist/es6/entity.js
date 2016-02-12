// FIXME [1] https://github.com/jeffmo/es-class-fields-and-static-properties

const entityConfigs = new WeakMap();
const entityPersistentData = new WeakMap();

const defaultConfig = {
  transient: false
};

function getConfig(target, propertyName) {
  if (!entityConfigs.has(target)) {
    entityConfigs.set(target, new Map());
  }
  let entityConfig = entityConfigs.get(target);
  let propertyConfig = {};
  if (entityConfig.has(propertyName)) {
    propertyConfig = entityConfig.get(propertyName);
  } else {
    Object.assign(propertyConfig, defaultConfig, {path: propertyName});
    entityConfig.set(propertyName, propertyConfig);
  }
  return propertyConfig;
}

function setConfig(target, propertyName, config) {
  let propertyConfig = getConfig(target, propertyName);
  Object.assign(propertyConfig, config);
  entityConfigs.get(target).set(propertyName, propertyConfig);
}

export function getPersistentData(entity) {
  if (!entityPersistentData.has(entity)) {
    entityPersistentData.set(entity, {});
  }
  return entityPersistentData.get(entity);
}


export function setPersistentData(entity, data) {
  entityPersistentData.set(entity, data);
}

/**
 * @param {Object} target
 */
export function Entity(target) {
  let instance = Reflect.construct(target, []);
  let fields = Reflect.ownKeys(instance)
      .filter(propertyName => !getConfig(target, propertyName).transient);
  let esClassFields = Reflect.ownKeys(instance) // FIXME see [1]
      .filter(propertyName => getConfig(target, propertyName).transient);
  return function constructor() {
    fields.forEach(propertyName => {
      let config = getConfig(target, propertyName);
      Reflect.defineProperty(this, propertyName, {
        get: function() {
          return getPersistentData(this)[config.path];
        },
        set: function(value) {
          getPersistentData(this)[config.path] = value;
        },
        enumerable: true,
        configurable: false
      });
    });
    esClassFields.forEach(propertyName => { // FIXME see[1]
      Reflect.defineProperty(this, propertyName, {
        value: undefined,
        writable: true,
        enumerable: true,
        configurable: false
      });
    });
  };
}

/**
 * @param {string} path
 */
export function Field(path) {
  return function(target, propertyName, descriptor) {
    setConfig(target.constructor, propertyName, {path: path || propertyName});
  };
}

/**
 * @param {Object} target
 * @param {string} propertyName
 * @param {Object} descriptor
 */
export function Transient(target, propertyName, descriptor) {
  setConfig(target.constructor, propertyName, {transient: true});
}

/**
 * @param {Object} target
 * @param {string} propertyName
 * @param {Object} descriptor
 * @deprecated FIXME See [1]
 */
export function esClassField(target, propertyName, descriptor) {}
