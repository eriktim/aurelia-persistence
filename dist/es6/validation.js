import moment from 'moment';

const validData = new WeakMap()
const validationConfig = new WeakMap();

const DEFAULT_CONFIG = {
  invalidError: '',
  isValid: val => true,
  nullable: true,
  type: null
};

function assertValidType(config, propertyName, val) {
  if (typeof val != config.type) {
    throw new Error(`${propertyName} must be a ${config.type}`);
  }
}

function assertValidRange(config, propertyName, val) {
  if (config.type == 'number') {
    let tooLow = false;
    let tooHigh = false;
    let range = config.min != null && config.max != null;
    if (config.min != null && val < config.min) {
      tooLow = true;
    }
    if (config.max != null && val > config.max) {
      tooHigh = true;
    }
    if (tooLow || tooHigh) {
      let rangeError = `${propertyName} must be`;
      if (range) {
        rangeError = `${rangeError} between ${config.min} and ${config.max}`;
      } else if (tooLow) {
        rangeError = `${rangeError} at least ${config.min}`;
      } else if (tooHigh) {
        rangeError = `${rangeError} at most ${config.max}`;
      }
      throw new Error(rangeError);
    }
  }
}

function createValidationDecorator(configUpdate) {
  return function(target, propertyName, descriptor) {
    if (!validationConfig.has(target)) {
      validationConfig.set(target, new Map());
    }
    let targetConfig = validationConfig.get(target);
    if (!targetConfig.has(propertyName)) {
      targetConfig.set(propertyName, Object.assign({}, DEFAULT_CONFIG));
    }
    let config = targetConfig.get(propertyName);
    if (config.type && config.type != configUpdate.type) {
      throw new Error(`${propertyName} has conflicting decorators`);
    }
    Object.assign(config, configUpdate);
    if (config.type) {
      let isValid = config.isValid;
      config.isValid = val => {
        assertValidType(config, propertyName, val);
        assertValidRange(config, propertyName, val);
        return isValid(val);
      }
    }

    let setter = descriptor.set;
    delete descriptor.initializer;
    delete descriptor.value;
    delete descriptor.writable;

    let assertValid = function(val) {
      if (val == null) {
        if (!config.nullable) {
          throw new Error(`${propertyName} must not be null`);
        }
      } else if (!config.isValid(val)) {
        throw new Error(`${propertyName} must ${config.invalidError}`);
      }
    };

    if (setter) {
      descriptor.set = function(val) {
        assertValid(val);
        Reflect.apply(setter, this, [val]);
      };
    } else {
      descriptor.set = function(val) {
        assertValid(val);
        if (!validData.has(this)) {
          validData.set(this, {});
        }
        validData.get(this)[propertyName] = val;
      };
      descriptor.get = function(val) {
        return (validData.get(this) || {})[propertyName];
      };
    }

  };
}

export const Boolean = createValidationDecorator({
  type: 'boolean'
});

export function Enum(values) {
  if (!Array.from(values).length) {
    throw new Error('@Enum() requires values');
  }
  return createValidationDecorator({
    isValid: val => values.includes(val),
    invalidError: `be any of {${values.join(', ')}}`,
    type: null
  });
}

export function Max(max) {
  if (max == null || typeof max != 'number') {
    throw new Error('@Max() requires a value');
  }
  return createValidationDecorator({
    max: max,
    type: 'number'
  });
}

export function Min(min) {
  if (min == null || typeof min != 'number') {
    throw new Error('@Min() requires a value');
  }
  return createValidationDecorator({
    min: min,
    type: 'number'
  });
}

export const Number = createValidationDecorator({
  type: 'number'
});

export const NotBlank = createValidationDecorator({
  nullable: false,
  type: 'string',
  isValid: val => !!val,
  invalidError: 'not be blank',
});

export const NotNull = createValidationDecorator({
  nullable: false
});

export function Range(min, max) {
  if (min == null || typeof min != 'number' || max == null || typeof max != 'number') {
    throw new Error('@Range() requires a range');
  }
  return createValidationDecorator({
    min: min,
    max: max,
    type: 'number'
  });
};

export const String = createValidationDecorator({
  type: 'string'
});

export const Temporal = createValidationDecorator({
  isValid: val => moment(val).isValid(),
  invalidError: 'be a valid date'
});
