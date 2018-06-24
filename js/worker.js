onmessage = function (event) {
  // console.log(event.data);
  let {currData, countTicks, maxRadius, minRadius, rx, ry, tickLen} = event.data;
  let ticks = []
  let radius
  for (let i = 0, len = countTicks, angle = 0; i < len; i++) {
    radius = Math.max(Math.min(currData[i + 100] + 150, maxRadius), minRadius)
    let tick = {}
    tick.x1 = rx + radius * Math.cos(angle)
    tick.y1 = ry + radius * Math.sin(angle)
    tick.x2 = rx + (radius - tickLen) * Math.cos(angle)
    tick.y2 = ry + (radius - tickLen) * Math.sin(angle)
    ticks.push(tick)
    angle += Math.PI / 180
  }
  postMessage(ticks)
}