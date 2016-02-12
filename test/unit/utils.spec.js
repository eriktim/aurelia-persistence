import {Utils} from '../../src/utils';

describe('the Utils class', () => {
  let obj;

  beforeEach(() => {
    obj = {};
  });

  it('should set a deep property value', () => {
    Utils.setProperty(obj, 'foo', 'bar');
    expect(obj).toEqual({foo: 'bar'});

    Utils.setProperty(obj, 'arr.0', 0);
    expect(obj).toEqual({foo: 'bar', arr: [0]});

    expect(() => Utils.setProperty(obj, 'arr.bar', null)).toThrow();

    Utils.setProperty(obj, 'obj.bar', null);
    expect(obj).toEqual({foo: 'bar', arr: [0], obj: {bar: null}});

    Utils.setProperty(obj, 'obj.1', 1);
    expect(obj).toEqual({foo: 'bar', arr: [0], obj: {1: 1, bar: null}});
  });

  it('should get a deep property value', () => {
    obj = {foo: 'bar', arr: [1, {obj: 'baz'}, 3]};
    expect(Utils.getProperty(obj, 'foo')).toEqual('bar');
    expect(Utils.getProperty(obj, 'arr')).toEqual([1, {obj: 'baz'}, 3]);
    expect(Utils.getProperty(obj, 'arr.0')).toEqual(1);
    expect(Utils.getProperty(obj, 'arr.1')).toEqual({obj: 'baz'});
    expect(Utils.getProperty(obj, 'arr.1.obj')).toEqual('baz');
    expect(Utils.getProperty(obj, 'arr.2')).toEqual(3);
    expect(Utils.getProperty(obj, 'baz')).toBeUndefined();
    expect(() => Utils.getProperty(obj, 'foo.bar')).toThrow();
  });
});
