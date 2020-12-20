import { EPSILON } from './Const.js'

export default class Point {
   /**
     * 三角形的面积,可以判断三点是否共线
     */
    static area(p, q, s) {
        let l1 = q.clone().sub(p)
        let l2 = s.clone().sub(q)
        let temp = l1.cross(l2)
        return temp.length() / 2
    }

      /**
     * 点s在pq的左边么?
     * @param {*} p
     * @param {*} q
     * @param {*} s
     * @return > 0: 顺时针, < 逆时针
     * @ note https://www.cnblogs.com/wind-chaser/p/10889537.html
     *        http://www.everyinch.net/index.php/computergeometry1/
     */
    static isLeft(p, q, s) {
        let l1 = q.clone().sub(p)
        let l2 = s.clone().sub(q)
        let temp = l1.cross(l2)
        // temp 在叉积后的向量的第三个分量反映了方向
        // 例如: (1,0,0) cross (0,1,0)  => (0,0,1)
        // 那么(0,0,1)的z分量是正的,就是顺时针方向,否则就是逆时针
        let ret =  temp.z
        return ret
    }

      /**
     * 判断点是否在多边形内
     * @param point 待判断的点
     * @param points 组成多边形点的数组
     * @note 不包含多边形边上
     */
    static pointInPolygon(point, points) {
        let angle = 0
        for (let i = 0; i < points.length; i++) {
            let curtent = i
            let next = (curtent + 1) % points.length
            let l1 = points[curtent].clone().sub(point)
            let l2 = points[next].clone().sub(point)
            angle += l1.angleTo(l2)
        }
        if (Math.PI * 2 - angle < EPSILON) {
            return true
        } else {
            return false
        }
    }

     /**
     * 判断三个点的位置关系
     *                p2
     *
     * p0      p1
     *
     *                p2
     * @param {*} p0
     * @param {*} p1
     * @param {*} p2
     */
    static ccw(p0, p1, p2) {
        // p0,p1,p2 逆时针方向
        const COUNTER_CLOCKWISE = -1
        // p0,p1,p2 顺时针
        const CLOCKWISE = 1
        // 完全相反, p1,p2在p0的两侧
        const ONLINE_BACK = 3
        // 方向相同（p1较远）
        const ONLINE_FRONT = 4
        // 方向相同（p2较远）
        const ON_SEGMENT = 5

        let dir = Math3D.isLeft(p0, p1, p2)
        if (dir > 0) {
            return COUNTER_CLOCKWISE
        } else if (dir < 0) {
            return CLOCKWISE
        } else if (dir == 0) {
            let u = p1.clone().sub(p0)
            let v = p2.clone().sub(p0)
            let w = u.dot(v)
            if (w < 0) {
                return ONLINE_BACK
            } else {
                if (u.length() > v.length()) {
                    return ONLINE_FRONT
                } else {
                    return ON_SEGMENT
                }

            }
        }
    }

    /**
     *        p1
     * p2
     *        p3
     * 测量角度
     * @param {*} p1
     * @param {*} p2
     * @param {*} p3
     */
    static angle(p1, p2, p3) {
        let line1 = p1.clone().sub(p2)
        let line2 = p3.sub(p2)
        return line1.angleTo(line2) * THREE.Math.RAD2DEG
    }

    /**
     * 验证三角形的合法
     */
    static isTriangle(a, b, c) {
        if (a + b > c && a + c > b && b + c > a) {
            return true
        } else {
            return false
        }
    }
}
