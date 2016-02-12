System.register(['./base-config', './entity', './entity-manager'], function (_export) {
  'use strict';

  var BaseConfig;

  _export('configure', configure);

  function configure(config, configCallback) {
    var baseConfig = config.container.get(BaseConfig);
    if (typeof configCallback === 'function') {
      configCallback(baseConfig);
    }
  }

  return {
    setters: [function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }, function (_entity) {
      _export('Entity', _entity.Entity);

      _export('Field', _entity.Field);

      _export('Transient', _entity.Transient);
    }, function (_entityManager) {
      _export('EntityManager', _entityManager.EntityManager);
    }],
    execute: function () {}
  };
});