feather.replace();

const mix_options = document.querySelector('.mix-options>select');
const render_options = document.querySelector('.render-options>select');
const video = document.querySelector('video');
//const canvas = document.querySelector('canvas');
const main_frame = document.querySelector('#main')
const reference_frame = document.querySelector('#reference')
const main_rendering = document.querySelector('#main-rendering');
const content_rendering = document.querySelector('#content-rendering');
const snapshot_image = document.querySelector('#snapshot-img');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const zoom = document.querySelector('#zoom');
const zoom_camera = document.querySelector('#zoom-camera');


let stream_started = false;
let camera_zoom_factor = 1;

const constraints = {
  video: {
    facingMode: { ideal: "environment" },
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

const apply_mix_options = () => {
  content_rendering.classList.remove('mix-blink');
  content_rendering.classList.remove('mix-blend');
  content_rendering.classList.remove('mix-darken');
  content_rendering.classList.remove('mix-video');
  content_rendering.classList.remove('mix-reference');
  content_rendering.classList.add(mix_options.value);
};

const set_mix_option = (index) => {
  mix_options.selectedIndex = index;
  apply_mix_options();
}

const apply_render_options = () => {
  content_rendering.classList.remove('render-normal');
  content_rendering.classList.remove('render-mirror');
  content_rendering.classList.remove('render-value');
  content_rendering.classList.add(render_options.value);
};

mix_options.onchange = apply_mix_options;
render_options.onchange = apply_render_options

const handle_stream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  video.classList.remove('d-none');
};

const start_stream = async (constraints) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    handle_stream(stream);
  } catch (e) {
    alert("Couldn't get the video feed - comparing reference vs your drawing won't work!");
    console.log(e);
  }
};

const start_video = () => {
  if (stream_started) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    return;
  }
  zoom.classList.add('d-none');
  play.classList.add('d-none');
  set_mix_option(0);
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    start_stream(constraints);
  } else {
    alert("Couldn't get the video feed - comparing reference vs your drawing won't work!");
  }
  set_pinch_align_mode();
};

const pause_video = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
  zoom.classList.remove('d-none');
  set_pinch_align_mode();
};

const goto_reference_frame = () => {
  main_frame.classList.add("d-none");
  reference_frame.classList.remove("d-none");
}


play.onclick = start_video
pause.onclick = pause_video;

// Select reference screen
const img_ref_preview = document.querySelector('#ref-preview');
const btn_ref_url = document.querySelector('#ref-link');
const btn_ref_file = document.querySelector('#ref-file');
const btn_ref_use = document.querySelector('#ref-use');
const input_ref_file = document.querySelector('#ref-file-input');

const pick_ref_url = () => {
  url = prompt("Please enter an image url", "");
  if (url) {
    img_ref_preview.src = url
  }
}

const pick_ref_file = () => {
  console.log("about to click");
  input_ref_file.click();
}


const handle_file_dialoge = e => {
  console.log("on change");
  var file = e.target.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = readerEvent => {
    var content = readerEvent.target.result;
    img_ref_preview.src = content;
  }
}

const goto_main_frame = () => {
  reference_frame.classList.add("d-none");
  main_frame.classList.remove("d-none");
  snapshot_image.src = img_ref_preview.src;
  start_video();
}

btn_ref_url.onclick = pick_ref_url;
btn_ref_file.onclick = pick_ref_file;
btn_ref_use.onclick = goto_main_frame;
input_ref_file.onchange = handle_file_dialoge;

const pinch_align_video = (delta_x, delta_y, delta_s, delta_a) => {
  video.style.transform = "scale("+camera_zoom_factor+") scale(" + delta_s + ") translate(" + delta_x + "px," + delta_y + "px)" + " rotate(" + (delta_a) + "deg)";
}

const pinch_zoom_content = (delta_x, delta_y, delta_s, delta_a) => {
  if (delta_s < 1) { delta_s = 1; }
  content_rendering.style.transform = "scale(" + delta_s + ") translate(" + delta_x + "px," + delta_y + "px)";
}

const set_pinch_align_mode = () => {
  set_pinch_handler(1 / 5, 1 / 10, 1 / 25, pinch_align_video);
  content_rendering.style.transform = "";
}

const set_pinch_zoom_mode = () => {
  if (zoom.classList.contains("active")) {
    zoom.classList.remove("active");
    set_pinch_align_mode();
  } else {
    zoom.classList.add("active");
    set_pinch_handler(1, 0, 1, pinch_zoom_content);
  }
}
zoom.onclick = set_pinch_zoom_mode;


const set_camera_zoom = e => {
  camera_zoom_factor = e.target.value
  video.style.transform = "scale(" + camera_zoom_factor + ")";
}
zoom_camera.oninput = set_camera_zoom;

//goto_main_frame();
