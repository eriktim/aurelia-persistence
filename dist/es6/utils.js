
function deeper(obj, part, val) {
  if (Array.isArray(obj) && Number.isNaN(Number.parseInt(part, 10))) {
    throw new Error(`invalid array key: ${part}`);
  }
  if (arguments.length === 3) {
    obj[part] = val;
  }
  return obj[part];
}

export class Utils {
  /**
   * Get a deep property of an object.
   * @param {Object} obj The object
   * @param {string} path Dot separated path to the deep property
   */
  static getProperty(obj, path) {
    return path.split('.').reduce((data, prop) => {
      if (!Reflect.has(data || {}, prop)) {
        return undefined;
      }
      return deeper(data, prop);
    }, obj);
  }

  /**
   * Set a deep property of an object.
   * @param {Object} obj The object
   * @param {string} path Dot separated path to the deep property
   * @param {*} value Value to set the property to
   */
  static setProperty(obj, path, value) {
    path.split('.').reduce((data, prop, index, arr) => {
      if (index === arr.length - 1) {
        return deeper(data, prop, value);
      }
      if (!Reflect.has(data || {}, prop)) {
        let nextProp = arr[index + 1];
        data[prop] = String(+nextProp) === nextProp ? [] : {};
      }
      return deeper(data, prop);
    }, obj);
  }
}
