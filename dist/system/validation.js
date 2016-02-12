System.register(['moment'], function (_export) {
  'use strict';

  var moment, validData, validationConfig, DEFAULT_CONFIG, Boolean, Number, NotBlank, NotNull, String, Temporal;

  _export('Enum', Enum);

  _export('Max', Max);

  _export('Min', Min);

  _export('Range', Range);

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

  return {
    setters: [function (_moment) {
      moment = _moment['default'];
    }],
    execute: function () {
      validData = new WeakMap();
      validationConfig = new WeakMap();
      DEFAULT_CONFIG = {
        invalidError: '',
        isValid: function isValid(val) {
          return true;
        },
        nullable: true,
        type: null
      };
      Boolean = createValidationDecorator({
        type: 'boolean'
      });

      _export('Boolean', Boolean);

      Number = createValidationDecorator({
        type: 'number'
      });

      _export('Number', Number);

      NotBlank = createValidationDecorator({
        nullable: false,
        type: 'string',
        isValid: function isValid(val) {
          return !!val;
        },
        invalidError: 'not be blank'
      });

      _export('NotBlank', NotBlank);

      NotNull = createValidationDecorator({
        nullable: false
      });

      _export('NotNull', NotNull);

      ;

      String = createValidationDecorator({
        type: 'string'
      });

      _export('String', String);

      Temporal = createValidationDecorator({
        isValid: function isValid(val) {
          return moment(val).isValid();
        },
        invalidError: 'be a valid date'
      });

      _export('Temporal', Temporal);
    }
  };
});