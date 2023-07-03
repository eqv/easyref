var pinch_first_touch = null;
var pinch_sensitivity_move = 0;
var pinch_sensitivity_rotate = 0;
var pinch_sensitivity_scale = 0;

const set_pinch_handler = (sensitivity_move, sensitivity_rotate, sensitivity_scale, handler) => {
    pinch_sensitivity_move=sensitivity_move;
    pinch_sensitivity_rotate=sensitivity_rotate;
    pinch_sensitivity_scale=sensitivity_scale;
    pinch_callback = handler;
}

const make_touch = (p1, p2) => {
      const x1 = p1.screenX;
      const y1 = p1.screenY;
      const x2 = p2.screenX;
      const y2 = p2.screenY;
      var angle =Math.atan2(y1-y2, x1-x2) * 180 / Math.PI;
      if(angle < 0){
        angle += 360;
      }
      angle = angle % 360;
      return {
        x: (x1+x2)/2,
        y: (y1+y2)/2,
        len: Math.sqrt((x1-x2)**2, (y1-y2)**2),
        angle: angle
      }
}

const move_handler = (e) => {
  // TODO: we migth have to handle multiple touches here.
  e.preventDefault();
  // TODO: it seems like sometimes the order becomes weird or something?
  if (e.targetTouches.length === 2 && e.changedTouches.length === 2) {
    const p1 = e.targetTouches[0];
    const p2 = e.targetTouches[1];
    if(pinch_first_touch){
      const cur_touch = make_touch(p1,p2);
      const delta_x = (cur_touch.x - pinch_first_touch.x)*pinch_sensitivity_move;
      const delta_y = (cur_touch.y - pinch_first_touch.y)*pinch_sensitivity_move;
      const delta_s = (cur_touch.len/pinch_first_touch.len-1)*pinch_sensitivity_scale + 1;
      var delta_a = (cur_touch.angle - pinch_first_touch.angle)*pinch_sensitivity_rotate;
      if(delta_a > 180){
        delta_a = delta_a - 360;
      }
      if(pinch_callback){
        pinch_callback(delta_x, delta_y, delta_s, delta_a);
      }
    } else {
      pinch_first_touch = make_touch(p1,p2);
    }
  }
}

const end_handler = (ev) => {
  ev.preventDefault();
  pinch_first_touch = null;
}

// const start_handler = (ev) => {
//   ev.preventDefault();
// }

const _snapshot_image = document.querySelector('#content-rendering');
//snapshot_image.ontouchstart = ( event ) => { console.log('start'); };
_snapshot_image.ontouchmove = move_handler
_snapshot_image.ontouchend = end_handler;
//snapshot_image.ontouchcancel = ( event ) => { console.log('cancel'); };