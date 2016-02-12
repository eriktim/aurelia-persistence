'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.Enum = Enum;
exports.Max = Max;
exports.Min = Min;
exports.Range = Range;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var validData = new WeakMap();
var validationConfig = new WeakMap();

var DEFAULT_CONFIG = {
  invalidError: '',
  isValid: function isValid(val) {
    return true;
  },
  nullable: true,
  type: null
};

function assertValidType(config, propertyName, val) {
  if (typeof val != config.type) {
    throw new Error(propertyName + ' must be a ' + config.type);
  }
}

function assertValidRange(config, propertyName, val) {
  if (config.type == 'number') {
    var tooLow = false;
    var tooHigh = false;
    var range = config.min != null && config.max != null;
    if (config.min != null && val < config.min) {
      tooLow = true;
    }
    if (config.max != null && val > config.max) {
      tooHigh = true;
    }
    if (tooLow || tooHigh) {
      var rangeError = propertyName + ' must be';
      if (range) {
        rangeError = rangeError + ' between ' + config.min + ' and ' + config.max;
      } else if (tooLow) {
        rangeError = rangeError + ' at least ' + config.min;
      } else if (tooHigh) {
        rangeError = rangeError + ' at most ' + config.max;
      }
      throw new Error(rangeError);
    }
  }
}

function createValidationDecorator(configUpdate) {
  return function (target, propertyName, descriptor) {
    if (!validationConfig.has(target)) {
      validationConfig.set(target, new Map());
    }
    var targetConfig = validationConfig.get(target);
    if (!targetConfig.has(propertyName)) {
      targetConfig.set(propertyName, Object.assign({}, DEFAULT_CONFIG));
    }
    var config = targetConfig.get(propertyName);
    if (config.type && config.type != configUpdate.type) {
      throw new Error(propertyName + ' has conflicting decorators');
    }
    Object.assign(config, configUpdate);
    if (config.type) {
      (function () {
        var isValid = config.isValid;
        config.isValid = function (val) {
          assertValidType(config, propertyName, val);
          assertValidRange(config, propertyName, val);
          return isValid(val);
        };
      })();
    }

    var setter = descriptor.set;
    delete descriptor.initializer;
    delete descriptor.value;
    delete descriptor.writable;

    var assertValid = function assertValid(val) {
      if (val == null) {
        if (!config.nullable) {
          throw new Error(propertyName + ' must not be null');
        }
      } else if (!config.isValid(val)) {
        throw new Error(propertyName + ' must ' + config.invalidError);
      }
    };

    if (setter) {
      descriptor.set = function (val) {
        assertValid(val);
        Reflect.apply(setter, this, [val]);
      };
    } else {
      descriptor.set = function (val) {
        assertValid(val);
        if (!validData.has(this)) {
          validData.set(this, {});
        }
        validData.get(this)[propertyName] = val;
      };
      descriptor.get = function (val) {
        return (validData.get(this) || {})[propertyName];
      };
    }
  };
}

var Boolean = createValidationDecorator({
  type: 'boolean'
});

exports.Boolean = Boolean;

function Enum(values) {
  if (!Array.from(values).length) {
    throw new Error('@Enum() requires values');
  }
  return createValidationDecorator({
    isValid: function isValid(val) {
      return values.includes(val);
    },
    invalidError: 'be any of {' + values.join(', ') + '}',
    type: null
  });
}

function Max(max) {
  if (max == null || typeof max != 'number') {
    throw new Error('@Max() requires a value');
  }
  return createValidationDecorator({
    max: max,
    type: 'number'
  });
}

function Min(min) {
  if (min == null || typeof min != 'number') {
    throw new Error('@Min() requires a value');
  }
  return createValidationDecorator({
    min: min,
    type: 'number'
  });
}

var Number = createValidationDecorator({
  type: 'number'
});

exports.Number = Number;
var NotBlank = createValidationDecorator({
  nullable: false,
  type: 'string',
  isValid: function isValid(val) {
    return !!val;
  },
  invalidError: 'not be blank'
});

exports.NotBlank = NotBlank;
var NotNull = createValidationDecorator({
  nullable: false
});

exports.NotNull = NotNull;

function Range(min, max) {
  if (min == null || typeof min != 'number' || max == null || typeof max != 'number') {
    throw new Error('@Range() requires a range');
  }
  return createValidationDecorator({
    min: min,
    max: max,
    type: 'number'
  });
}

;

var String = createValidationDecorator({
  type: 'string'
});

exports.String = String;
var Temporal = createValidationDecorator({
  isValid: function isValid(val) {
    return (0, _moment2['default'])(val).isValid();
  },
  invalidError: 'be a valid date'
});
exports.Temporal = Temporal;