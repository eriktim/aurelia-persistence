System.register(['./base-config'], function (_export) {
  'use strict';

  var BaseConfig, EntityManager;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_baseConfig) {
      BaseConfig = _baseConfig.BaseConfig;
    }],
    execute: function () {
      EntityManager = function EntityManager(baseConfig) {
        _classCallCheck(this, EntityManager);

        this.baseConfig = baseConfig;
      };

      _export('EntityManager', EntityManager);
    }
  };
});