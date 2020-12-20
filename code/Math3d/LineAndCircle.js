export default class LineAndCircle{
  /**
   * 计算线和圆的交点
   * @param c: 圆心坐标
   * @param r: 圆的半径
   * @param p1: 线段的第一个点
   * @param p2: 线段的第二个点
   *
   */
  static lineAndCircleIntersec(c, r, p1, p2) {
      let pr = Math3D.projection(c, p1, p2)
      let cprLength = c.distanceTo(pr)
      if (cprLength == r) {
          return pr
      } else if (cprLength > r) {
          return null
      }
      let baseLength = Math.sqrt(r * r - cprLength * cprLength)
      let dir = p2.clone().sub(p1).normalize()
      let ret = []

      ret[0] = pr.clone().add(dir.clone().multiplyScalar(baseLength))
      ret[1] = pr.clone().add(dir.clone().negate().multiplyScalar(baseLength))
      return ret
  }
}
