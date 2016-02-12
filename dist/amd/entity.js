define(["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getPersistentData = getPersistentData;
  exports.setPersistentData = setPersistentData;
  exports.Entity = Entity;
  exports.Field = Field;
  exports.Transient = Transient;
  exports.esClassField = esClassField;

  var entityConfigs = new WeakMap();
  var entityPersistentData = new WeakMap();

  var defaultConfig = {
    transient: false
  };

  function getConfig(target, propertyName) {
    if (!entityConfigs.has(target)) {
      entityConfigs.set(target, new Map());
    }
    var entityConfig = entityConfigs.get(target);
    var propertyConfig = {};
    if (entityConfig.has(propertyName)) {
      propertyConfig = entityConfig.get(propertyName);
    } else {
      Object.assign(propertyConfig, defaultConfig, { path: propertyName });
      entityConfig.set(propertyName, propertyConfig);
    }
    return propertyConfig;
  }

  function setConfig(target, propertyName, config) {
    var propertyConfig = getConfig(target, propertyName);
    Object.assign(propertyConfig, config);
    entityConfigs.get(target).set(propertyName, propertyConfig);
  }

  function getPersistentData(entity) {
    if (!entityPersistentData.has(entity)) {
      entityPersistentData.set(entity, {});
    }
    return entityPersistentData.get(entity);
  }

  function setPersistentData(entity, data) {
    entityPersistentData.set(entity, data);
  }

  function Entity(target) {
    var instance = Reflect.construct(target, []);
    var fields = Reflect.ownKeys(instance).filter(function (propertyName) {
      return !getConfig(target, propertyName).transient;
    });
    var esClassFields = Reflect.ownKeys(instance).filter(function (propertyName) {
      return getConfig(target, propertyName).transient;
    });
    return function constructor() {
      var _this = this;

      fields.forEach(function (propertyName) {
        var config = getConfig(target, propertyName);
        Reflect.defineProperty(_this, propertyName, {
          get: function get() {
            return getPersistentData(this)[config.path];
          },
          set: function set(value) {
            getPersistentData(this)[config.path] = value;
          },
          enumerable: true,
          configurable: false
        });
      });
      esClassFields.forEach(function (propertyName) {
        Reflect.defineProperty(_this, propertyName, {
          value: undefined,
          writable: true,
          enumerable: true,
          configurable: false
        });
      });
    };
  }

  function Field(path) {
    return function (target, propertyName, descriptor) {
      setConfig(target.constructor, propertyName, { path: path || propertyName });
    };
  }

  function Transient(target, propertyName, descriptor) {
    setConfig(target.constructor, propertyName, { transient: true });
  }

  function esClassField(target, propertyName, descriptor) {}
});