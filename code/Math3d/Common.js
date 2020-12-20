import { EPSILON } from './Const.js'

export default class Common {
  static isZero(val, ep) {
      ep = ep || EPSILON;
      return Math.abs(val) < ep;
  }

  static isZeroVector(vector = { x: 0, y: 0, z: 0 }) {
      // 将对象转为数组
      const vectorArr = Object.values(vector)
      for (var i = 0; i < vectorArr.length; i++) {
          if (!Common.isZero(vectorArr[i]))
              return false;
      }
      return true;
  }
}
