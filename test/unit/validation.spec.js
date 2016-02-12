import {Boolean, Enum, Max, Min, Number, NotBlank, NotNull, Range, String, Temporal} from '../../src/validation';

describe('the Validation decorator', () => {

  it('@Boolean should validate inputs', () => {
    class Entity {
      @Boolean
      property;
    }
    let entity = new Entity();
    expect(() => entity.property = true).not.toThrow();
    expect(() => entity.property = false).not.toThrow();
    expect(() => entity.property = 'false').toThrowError('property must be a boolean');
  });

  it('@Date should validate inputs', () => {
    class Entity {
      @Temporal
      property;
    }
    let entity = new Entity();
    expect(() => entity.property = '2000-01-01T00:00:00.000Z').not.toThrow();
    expect(() => entity.property = new Date()).not.toThrow();
    expect(() => entity.property = 'foo').toThrowError('property must be a valid date');
  });

  it('@Enum should validate inputs', () => {
    class Entity {
      @Enum(['foo', 'bar'])
      property;
    }
    let entity = new Entity();
    expect(() => entity.property = 'foo').not.toThrow();
    expect(() => entity.property = 'bar').not.toThrow();
    expect(() => entity.property = 'baz').toThrowError('property must be any of {foo, bar}');
  });

  it('@Min/@Max should validate inputs', () => {
    class Entity {
      @Min(1)
      lowerBound;

      @Max(10)
      upperBound;

      @Min(1)
      @Max(10)
      range;
    }
    let entity = new Entity();
    expect(() => entity.lowerBound = 1).not.toThrow();
    expect(() => entity.lowerBound = 0).toThrowError('lowerBound must be at least 1');
    expect(() => entity.upperBound = 10).not.toThrow();
    expect(() => entity.upperBound = 11).toThrowError('upperBound must be at most 10');
    expect(() => entity.range = 1).not.toThrow();
    expect(() => entity.range = 10).not.toThrow();
    expect(() => entity.range = 0).toThrowError('range must be between 1 and 10');
    expect(() => entity.range = 11).toThrowError('range must be between 1 and 10');
  });

  it('@Number should validate inputs', () => {
    class Entity {
      @Number
      property;
    }
    let entity = new Entity();
    expect(() => entity.property = 1).not.toThrow();
    expect(() => entity.property = -3.14).not.toThrow();
    expect(() => entity.property = '100').toThrowError('property must be a number');
  });

  it('@NotNull should validate inputs', () => {
    class Entity {
      @NotNull
      property;
    }
    let entity = new Entity();
    expect(() => entity.property = '').not.toThrow();
    expect(() => entity.property = {}).not.toThrow();
    expect(() => entity.property = []).not.toThrow();
    expect(() => entity.property = 0).not.toThrow();
    expect(() => entity.property = null).toThrowError('property must not be null');
    expect(() => entity.property = undefined).toThrowError('property must not be null');
  });

  it('@Range should validate inputs', () => {
    class Entity {
      @Range(1, 10)
      property;
    }
    let entity = new Entity();
    expect(() => entity.property = 1).not.toThrow();
    expect(() => entity.property = 10).not.toThrow();
    expect(() => entity.property = 0).toThrowError('property must be between 1 and 10');
    expect(() => entity.property = 11).toThrowError('property must be between 1 and 10');
  });

  it('@String should validate inputs', () => {
    class Entity {
      @String
      string;

      @String
      @NotNull
      notNullString;

      @String
      @NotBlank
      notBlankString;
    }
    let entity = new Entity();
    expect(() => entity.string = 'foo').not.toThrow();
    expect(() => entity.string = '').not.toThrow();
    expect(() => entity.string = 1).toThrowError('string must be a string');

    expect(() => entity.notNullString = 'foo').not.toThrow();
    expect(() => entity.notNullString = '').not.toThrow();
    expect(() => entity.notNullString = null).toThrowError('notNullString must not be null');

    expect(() => entity.notBlankString = 'foo').not.toThrow();
    expect(() => entity.notBlankString = '').toThrowError('notBlankString must not be blank');
    expect(() => entity.notBlankString = null).toThrowError('notBlankString must not be null');
  });

  it('types should not conflict', () => {
    expect(() => {
      class Entity {
        @String
        @Number
        property;
      }
    }).toThrowError('property has conflicting decorators');
  });

  it('order should not be relevant', () => {
    class Entity {
      @Number
      @Min(0)
      propertyA;

      @Min(0)
      @Number
      propertyB;
    }
    let entity = new Entity();
    expect(() => entity.propertyA = 1).not.toThrow();
    expect(() => entity.propertyA = -1).toThrowError('propertyA must be at least 0');
    expect(() => entity.propertyB = 1).not.toThrow();
    expect(() => entity.propertyB = -1).toThrowError('propertyB must be at least 0');
  });

  it('types should not overwrite setters', () => {
    function Decorator(target, propertyName, descriptor) {
      delete descriptor.initializer;
      descriptor.set = function(val) {
        throw new Error('decorator exception');
      }
    }
    class Entity {
      @String
      @Decorator
      propertyA;

      @Decorator
      @String
      propertyB;
    }
    let entity = new Entity();
    expect(() => entity.propertyA = 'foo').toThrowError('decorator exception');
    expect(() => entity.propertyA = 1).toThrowError('propertyA must be a string');
    expect(() => entity.propertyB = 'foo').toThrowError('decorator exception');
    expect(() => entity.propertyB = 1).toThrowError('decorator exception');
  });

  it('types should not overwrite accessors', () => {
    function Decorator(target, propertyName, descriptor) {
      delete descriptor.initializer;
      descriptor.set = function(val) {};
      descriptor.get = function() {return 'foo';}
    }
    class Entity {
      @Decorator
      @String
      propertyA;

      @String
      @Decorator
      propertyB;
    }
    let entity = new Entity();
    entity.propertyA = 'a';
    expect(entity.propertyA).toEqual('foo');
    entity.propertyB = 'b';
    expect(entity.propertyB).toEqual('foo');
  });

  it('types should preserve reading & writing fields', () => {
    class Entity {
      @String
      property;
    }
    let entity = new Entity();
    entity.property = 'foo';
    expect(entity.property).toEqual('foo');
  });

});
