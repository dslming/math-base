export default class CircleAndPoint{
  static pointInCircle(circle, point) {
    let { center, radius } = circle
    center = new THREE.Vector3(center.x, center.y, center.z)
    point = new THREE.Vector3(point.x, point.y, point.z)
    return point.distanceTo(center) <= radius
   }
}
