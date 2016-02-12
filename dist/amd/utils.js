define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function deeper(obj, part, val) {
    if (Array.isArray(obj) && Number.isNaN(Number.parseInt(part, 10))) {
      throw new Error('invalid array key: ' + part);
    }
    if (arguments.length === 3) {
      obj[part] = val;
    }
    return obj[part];
  }

  var Utils = (function () {
    function Utils() {
      _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
      key: 'getProperty',
      value: function getProperty(obj, path) {
        return path.split('.').reduce(function (data, prop) {
          if (!Reflect.has(data || {}, prop)) {
            return undefined;
          }
          return deeper(data, prop);
        }, obj);
      }
    }, {
      key: 'setProperty',
      value: function setProperty(obj, path, value) {
        path.split('.').reduce(function (data, prop, index, arr) {
          if (index === arr.length - 1) {
            return deeper(data, prop, value);
          }
          if (!Reflect.has(data || {}, prop)) {
            var nextProp = arr[index + 1];
            data[prop] = String(+nextProp) === nextProp ? [] : {};
          }
          return deeper(data, prop);
        }, obj);
      }
    }]);

    return Utils;
  })();

  exports.Utils = Utils;
});