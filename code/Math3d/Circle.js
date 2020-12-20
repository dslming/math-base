import { EPSILON } from './Const.js'
import Point from './Point.js'
export default class Circle{
  /**
   * 生成3点圆
   * @param {*} p1
   * @param {*} p2
   * @param {*} p3
   */
  static getThreePointCircle(_p1, _p2, _p3, plane = "xoy") {
    let p1;
    let p2;
    let p3;

    // 判断是否共线
    let isCollinear = Point.area(
      new THREE.Vector3(_p1.x, _p1.y, _p1.z),
      new THREE.Vector3(_p2.x, _p2.y, _p2.z),
      new THREE.Vector3(_p3.x, _p3.y, _p3.z),
    )
    if (isCollinear==0) {
      return null
    }

    if (plane == "xoy") {
      p1 = _p1
      p2 = _p2
      p3 = _p3
    } else if (plane == "xoz") {
      p1 = {
        x: _p1.x,
        y: _p1.z
      }
      p2 = {
        x: _p2.x,
        y: _p2.z
      }
      p3 = {
      x: _p3.x,
      y: _p3.z
      }
    }
    let a,a1,b,b1,ry;
    let ret = { x: 0.0, y: 0.0, r: 0.0 };

    let m = {x:0.0,y:0.0};
    let m1 = {x:0.0,y:0.0};
    let c = {x:0.0,y:0.0};

    m.y = (p1.y+p2.y) / 2;
    m.x = (p1.x+p2.x) / 2;
    m1.x = (p2.x+p3.x) / 2;
    m1.y = (p2.y+p3.y) / 2;

    a= (p1.y - p2.y)/(p1.x - p2.x + EPSILON);
    b = m.y + (m.x/(a+EPSILON));

    a1= (p2.y - p3.y)/(p2.x - p3.x + EPSILON);
    b1 = m1.y + (m1.x/(a1+EPSILON));

    let inva = 1/(a+EPSILON);
    let  inva1 = 1/(a1+EPSILON);

    c.x = (b1 - b) / (inva1 - inva + EPSILON);
    c.y =  -(c.x/(a+EPSILON)) + b;

    ry = Math.sqrt((p1.x-c.x)*(p1.x-c.x)+(p1.y-c.y)*(p1.y-c.y));

    ret.x = c.x;
    ret.y = c.y;
    ret.r = ry;

    if (plane == "xoy") {
      return {
        center: {
          x: ret.x,
          y: ret.y,
          z: _p1.z
        },
        radius: ret.r
      }
     } else if (plane == "xoz") {
      return {
        center: {
          x: ret.x,
          y: _p1.y,
          z: ret.y,
        },
        radius: ret.r
      }
    }
  }

   /**
     * 计算两个圆的交点,只能计算xoy平面上的
     * todo: 加上圆的法线,支持三维交点检测
     * @param {*} c1
     * @param {*} r1
     * @param {*} c2
     * @param {*} r2
     */
    static circleAndCircleIntersec(c1, r1, c2, r2) {
        // 两个圆心的距离
        let c1c2 = c2.clone().sub(c1)
        if (c1c2.length > r1 + r2) {
            return null
        }

        // 根据余弦定理
        let a = r2
        let b = r1
        let c = c1c2.length()
        let cosA = (b * b + c * c - a * a) / (2 * b * c)
        if (!Math3D.isTriangle(a, b, c)) return null

        let A = Math.acos(cosA)

        let rotation = c1c2.clone().normalize().multiplyScalar(r1)
        let ret = []
        ret[0] = rotation.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), A).add(c1)
        ret[1] = rotation.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), -A).add(c1)
        return ret
    }

    /**
     * 最小圆覆盖
     * todo: 圆心确定不准确
     */
    static getIdentityCircleCoverage(posArr) {
        let p = posArr
        let R = 2
        let ret = 1
        let alp = []

        let center = null
        for (let i = 0; i < p.length; i++) {
            let t = 0;
            for (let j = 0; j < p.length; j++) {
                let D = p[i].distanceTo(p[j])
                if (i != j && D <= 2 * R) {
                    let mid = Math3D.circleAndCircleIntersec(p[i], 1, p[j], 1)
                    alp[t] = {}
                    alp[t + 1] = {}

                    let phi = Math.acos(D / 2.0 / R);
                    let theta = Math.atan2(p[j].y - p[i].y, p[j].x - p[i].x);
                    // 用两个极角表示圆弧
                    alp[t].v = theta - phi
                    // 是否是圆弧的起始点
                    alp[t].flag = true
                    mid && Array.isArray(mid) && (alp[t].center = mid[1])


                    alp[t + 1].v = theta + phi
                    alp[t + 1].flag = false
                    t += 2
                }
            }

            // 从小到大排序
            alp.sort(function (a, b) { return a.v - b.v })
            let sum = 1;

            for (let m = 0; m < t; m++) {
                if (alp[m].flag) sum++;
                else sum--;

                if (sum > ret) {
                    ret = sum
                    alp[m].center && (center = alp[m].center)
                }
            }
        }
        console.error(ret, center)
        return center
    }
}
