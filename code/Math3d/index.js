import Common from './Common.js'
import Line from './Line.js'
import LineAndPoint from './LineAndPoint.js'
import LineAndCircle from './LineAndCircle.js'
import Circle from './Circle.js'
import Point from './Point.js'
import CircleAndPoint from './CircleAndPoint.js'
import Mixin from '../utils/Mixin.js'

class DefaultInfo {
  static versionInfo = {
    version: "0.0.1",
    data: "2020/12/17"
  }
}

export default Mixin.inherit(
  DefaultInfo,
  Common,
  Line,
  Point,
  LineAndPoint,
  Circle,
  LineAndCircle,
  CircleAndPoint
)
