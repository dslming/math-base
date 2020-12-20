export default  class PointAndLine {
  /**
   * 点到直线的距离
   */
  static closestToSegment(point, a, b) {
    let ba = b.clone().sub(a);
    let t = point.clone().sub(a).dot(ba) / ba.lengthSq();
    return a.clone().lerp(b, Math.min(Math.max(t, 0), 1));
  }

  /**
   * 计算点在直线的投影点
   */
  static projection(point, lineStart, lineEnd) {
    let AM = new THREE.Vector3()
    let AB = new THREE.Vector3()
    AM.subVectors(point, lineStart)
    AB.subVectors(lineEnd, lineStart)
    const abLen2 = AB.dot(AB)
    const temp = AB.dot(AM)
    let scale = temp / abLen2
    return AB.multiplyScalar(scale).add(lineStart)
  }

  /**
   * 计算点在直线的镜像
   */
  static reflection(point, lineStart, lineEnd) {
    let projPoint = Math3D.projection(point, lineStart, lineEnd)
    let newLine = new THREE.Vector3()
    newLine.subVectors(projPoint, point)
    return newLine.add(projPoint)
  }
}
