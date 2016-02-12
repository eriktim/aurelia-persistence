define(['exports', './base-config'], function (exports, _baseConfig) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var EntityManager = function EntityManager(baseConfig) {
    _classCallCheck(this, EntityManager);

    this.baseConfig = baseConfig;
  };

  exports.EntityManager = EntityManager;
});