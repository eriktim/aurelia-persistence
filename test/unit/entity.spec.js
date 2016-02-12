import {Entity, Field, Transient, getPersistentData, esClassField} from '../../src/entity';

@Entity
class PersistentObject {

  @esClassField
  defaultField;

  @esClassField
  @Field()
  unconfiguredField;

  @esClassField
  @Field('configured.field.path')
  configuredField;

  @esClassField
  @Transient
  transientField;
}

describe('the Entity annotation', () => {

  var persistentObject;

  beforeEach(() => {
    persistentObject = new PersistentObject();
  });

  it('should persist fields by default', () => {
    let descriptor = Reflect.getOwnPropertyDescriptor(persistentObject, 'defaultField');
    expect(descriptor.configurable).toEqual(false);
    expect(Reflect.has(descriptor, 'get')).toEqual(true);
    expect(Reflect.has(descriptor, 'set')).toEqual(true);
    expect(Reflect.has(descriptor, 'value')).toEqual(false);
    expect(Reflect.has(descriptor, 'writable')).toEqual(false);

    expect(persistentObject.defaultField).toBeUndefined();
    persistentObject.defaultField = 'foo';
    expect(persistentObject.defaultField).toEqual('foo');

    expect(getPersistentData(persistentObject)).toEqual({defaultField: 'foo'});
  });

  it('should have configurable fields with a default path', () => {
    let descriptor = Reflect.getOwnPropertyDescriptor(persistentObject, 'unconfiguredField');
    expect(descriptor.configurable).toEqual(false);
    expect(Reflect.has(descriptor, 'get')).toEqual(true);
    expect(Reflect.has(descriptor, 'set')).toEqual(true);
    expect(Reflect.has(descriptor, 'value')).toEqual(false);
    expect(Reflect.has(descriptor, 'writable')).toEqual(false);

    expect(persistentObject.unconfiguredField).toBeUndefined();
    persistentObject.unconfiguredField = 'foo';
    expect(persistentObject.unconfiguredField).toEqual('foo');

    expect(getPersistentData(persistentObject)).toEqual({'unconfiguredField': 'foo'});
  });

  it('should have configurable fields with a custom path', () => {
    let descriptor = Reflect.getOwnPropertyDescriptor(persistentObject, 'configuredField');
    expect(descriptor.configurable).toEqual(false);
    expect(Reflect.has(descriptor, 'get')).toEqual(true);
    expect(Reflect.has(descriptor, 'set')).toEqual(true);
    expect(Reflect.has(descriptor, 'value')).toEqual(false);
    expect(Reflect.has(descriptor, 'writable')).toEqual(false);

    expect(persistentObject.configuredField).toBeUndefined();
    persistentObject.configuredField = 'foo';
    expect(persistentObject.configuredField).toEqual('foo');

    expect(getPersistentData(persistentObject)).toEqual({'configured.field.path': 'foo'});
  });

  it('should ignore transient fields', () => {
    let descriptor = Reflect.getOwnPropertyDescriptor(persistentObject, 'transientField');
    expect(descriptor.configurable).toEqual(false);
    expect(Reflect.has(descriptor, 'get')).toEqual(false);
    expect(Reflect.has(descriptor, 'set')).toEqual(false);
    expect(Reflect.has(descriptor, 'value')).toEqual(true);
    expect(Reflect.has(descriptor, 'writable')).toEqual(true);

    expect(persistentObject.transientField).toBeUndefined();
    persistentObject.transientField = 'foo';
    expect(persistentObject.transientField).toEqual('foo');

    expect(getPersistentData(persistentObject)).toEqual({});
  });

});
