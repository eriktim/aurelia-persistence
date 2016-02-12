System.register([], function (_export) {
  'use strict';

  var configs, BaseConfig;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [],
    execute: function () {
      configs = new WeakMap();

      BaseConfig = (function () {
        _createClass(BaseConfig, [{
          key: 'configure',
          value: function configure(config) {
            Object.assign(configs.get(this), config);
          }
        }, {
          key: 'current',
          get: function get() {
            return configs.get(this);
          }
        }]);

        function BaseConfig() {
          _classCallCheck(this, BaseConfig);

          configs.set(this, {
            baseUrl: 'baseUrl'
          });
        }

        return BaseConfig;
      })();

      _export('BaseConfig', BaseConfig);
    }
  };
});