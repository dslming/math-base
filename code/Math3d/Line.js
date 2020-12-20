// 依赖:SylLine
export default class Line {
  /**-------------------------位置关系---------------------- */
  /**
   * 判断两条线是否垂直
   * @param {*} v1
   * @param {*} v2
   * @note 向量内积：a*b=|a||b|*cos(Y) 当cos为0时正交(90,-90垂直)
   */
  static isOrthogonal(v1, v2) {
      if (Math3D.isZeroVector(v1) || Math3D.isZeroVector(v2)) return false

      const ret = v1.clone().dot(v2)
      if (Math.abs(ret - 0) < EPSILON) return true
      else return false
  }

  /**
   * 判断两条线是否平行
   * @param {*} v1
   * @param {*} v2
   */
  static isParallel(v1, v2) {
      if (Math3D.isZeroVector(v1) || Math3D.isZeroVector(v2)) return false

      let v = v1.clone().cross(v2)
      return Math3D.isZeroVector(v);
  }

  /**
   * 计算两条线的交点,没有交点返回 null
   */
  static lineIntersec2(s1, e1, s2, e2) {
      let line1 = SylLine.create(Object.values(s1), Object.values(e1.clone().sub(s1)))
      let line2 = SylLine.create(Object.values(s2), Object.values(e2.clone().sub(s2)))
      let ret = line1.intersectionWith(line2)
      if (!ret) return null
      else return new THREE.Vector3().fromArray(ret.elements)
  }

  /**
   * 计算两条线的交点,没有交点返回 null
   */
  static lineAndLineIntersec(a, b, c, d) {
      // todo:先判断有无交点
      let p1 = Math3D.projection(c, a, b)
      let p2 = Math3D.projection(d, a, b)
      let d1 = p1.distanceTo(c)
      let d2 = p2.distanceTo(d)
      let s = d1 / d2
      let cd = c.distanceTo(d)
      let ck = cd * s / (s + 1)
      let t = ck / cd

      let cdV = d.clone().sub(c)
      let k = cdV.multiplyScalar(t).add(c)
      return k
  }

  /**---------------------------数量关系---------------------- */
  /**
   * 计算线段之间的距离
   * @param {*} s1
   * @param {*} e1
   * @param {*} s2
   * @param {*} e2
   * @note https://gist.github.com/cuberoot/b5047c83cf277fee1b82
   * @note http://geomalgorithms.com/a07-_distance.html
   *
   */
  static distanceBetweenLines(startPt1, endPt1, startPt2, endPt2) {
      var u, v, w, a, b, c, d, e, D, sc, sN, sD, tc, tN, tD;

      u = new THREE.Vector3();
      u.subVectors(endPt1, startPt1);
      v = new THREE.Vector3();
      v.subVectors(endPt2, startPt2);
      w = new THREE.Vector3();
      w.subVectors(startPt1, startPt2);

      a = u.dot(u);           // always >= 0
      b = u.dot(v);
      c = v.dot(v);           // always >= 0
      d = u.dot(w);
      e = v.dot(w);

      D = (a * c) - (b * b);  // always >= 0
      sD = D;                 // default sD = D >= 0
      tD = D;                 // default tD = D >= 0

      // compute the line parameters of the two closest points
      if (D < EPSILON) {
          // the lines are almost parallel
          sN = 0.0;         // force using point P0 on segment S1
          sD = 1.0;         // to prevent possible division by 0.0 later
          tN = e;
          tD = c;
      }
      else {
          // get the closest points on the infinite lines
          sN = (b * e - c * d);
          tN = (a * e - b * d);
          if (sN < 0.0) {
              // sc < 0 => the s=0 edge is visible
              sN = 0.0;
              tN = e;
              tD = c;
          }
          else if (sN > sD) {
              // sc > 1  => the s=1 edge is visible
              sN = sD;
              tN = e + b;
              tD = c;
          }
      }

      if (tN < 0.0) {
          // tc < 0 => the t=0 edge is visible
          tN = 0.0;
          // recompute sc for this edge
          if (-d < 0.0) {
              sN = 0.0;
          }
          else if (-d > a) {
              sN = sD;
          }
          else {
              sN = -d;
              sD = a;
          }
      }
      else if (tN > tD) {
          // tc > 1  => the t=1 edge is visible
          tN = tD;
          // recompute sc for this edge
          if ((-d + b) < 0.0) {
              sN = 0;
          }
          else if ((-d + b) > a) {
              sN = sD;
          }
          else {
              sN = (-d + b);
              sD = a;
          }
      }

      // finally do the division to get sc and tc
      sc = (Math.abs(sN) < EPSILON ? 0.0 : sN / sD);
      tc = (Math.abs(tN) < EPSILON ? 0.0 : tN / tD);

      // get the difference of the two closest points
      var sc_mult_u = new THREE.Vector3();
      sc_mult_u.copy(u);
      sc_mult_u.multiplyScalar(sc);
      var tc_mult_v = new THREE.Vector3();
      tc_mult_v.copy(v);
      tc_mult_v.multiplyScalar(tc);
      var dP = new THREE.Vector3();
      dP.copy(w);
      dP.add(sc_mult_u);
      dP.sub(tc_mult_v);

      return dP.length();   // return the closest distance
  }

  /**
   * 计算线段之间的距离,实现方式2
   * @param {*} segA
   * @param {*} segB
   * @param {*} lineA
   * @param {*} lineB
   * @note https://lianming.gitee.io/geometrytest/%E7%BA%BF%E6%AE%B5%E6%9C%80%E5%B0%8F%E8%B7%9D%E7%A6%BB/
   */
  static distanceBetweenLines2(segA, segB, lineA, lineB) {
      let lineBAAxis = lineB.clone().sub(lineA).normalize();
      let inPlaneA = segA.clone().sub(lineA).projectOnPlane(lineBAAxis).add(lineA);
      let inPlaneB = segB.clone().sub(lineA).projectOnPlane(lineBAAxis).add(lineA);
      let inPlaneBA = inPlaneB.clone().sub(inPlaneA);
      let t = lineA.clone().sub(inPlaneA).dot(inPlaneBA) / inPlaneBA.lengthSq();
      let rayPoint = segA.clone().lerp(segB, Math.min(Math.max(t, 0), 1));
      let ab = Math3D.closestToSegment(rayPoint, segA, segB)
      let cd = Math3D.closestToSegment(ab, lineA, lineB)
      return ab.distanceTo(cd)
  }

    /**
     * 判断两条线段是否有交点
     * @param {*} p0
     * @param {*} p1
     * @param {*} p2
     * @param {*} p3
     */
    static intersect(p1, p2, p3, p4) {
        // p3,p4在p1,p2的两侧
        let t1 = Math3D.ccw(p1, p2, p3)
        let t2 = Math3D.ccw(p1, p2, p4)
        let t3 = Math3D.ccw(p3, p4, p1)
        let t4 = Math3D.ccw(p3, p4, p2)
        if (t1 * t2 < 0 && t3 * t4 < 0) {
            return true
        } else {
            return false
        }
    }
}
