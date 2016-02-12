define(['exports', './base-config', './entity', './entity-manager'], function (exports, _baseConfig, _entity, _entityManager) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.configure = configure;
  Object.defineProperty(exports, 'Entity', {
    enumerable: true,
    get: function get() {
      return _entity.Entity;
    }
  });
  Object.defineProperty(exports, 'Field', {
    enumerable: true,
    get: function get() {
      return _entity.Field;
    }
  });
  Object.defineProperty(exports, 'Transient', {
    enumerable: true,
    get: function get() {
      return _entity.Transient;
    }
  });
  Object.defineProperty(exports, 'EntityManager', {
    enumerable: true,
    get: function get() {
      return _entityManager.EntityManager;
    }
  });

  function configure(config, configCallback) {
    var baseConfig = config.container.get(_baseConfig.BaseConfig);
    if (typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }
});