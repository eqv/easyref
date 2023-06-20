feather.replace();

const controls_top = document.querySelector('#controls-top');
const controls_bot = document.querySelector('#controls-bot');
const mix_options = document.querySelector('.mix-options>select');
const render_options = document.querySelector('.render-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const main_frame = document.querySelector('#main')
const reference_frame = document.querySelector('#reference')
const splash_frame = document.querySelector('#splash')
const main_content = document.querySelector('#main>.content');
const snapshot_image = document.querySelector('#snapshot-img');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const snapshot = document.querySelector('#snapshot');


let stream_started = false;

const constraints = {
  video: {
    facingMode: { exact: "environment" },
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

mix_options.onchange = () => {
  main_content.classList.remove('mix-blink');
  main_content.classList.remove('mix-blend');
  main_content.classList.remove('mix-darken');
  main_content.classList.remove('mix-video');
  main_content.classList.remove('mix-reference');
  main_content.classList.add(mix_options.value);
};

render_options.onchange = () => {
  main_content.classList.remove('render-normal');
  main_content.classList.remove('render-mirror');
  main_content.classList.remove('render-value');
  main_content.classList.add(render_options.value);
};

const handle_stream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  controls_bot.classList.remove('d-none');
  pause.classList.remove('d-none');
  snapshot.classList.remove('d-none');
  video.classList.remove('d-none');
};

const start_stream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handle_stream(stream);
};

const start_video = () => {
  if (stream_started) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    snapshot.classList.remove('d-none');
    return;
  }
  controls_top.classList.remove('splash-screen');
  play.classList.add('d-none');
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    start_stream(constraints);
  }
};

const pause_video = () => {
  video.pause();
  play.classList.remove('d-none');
  pause.classList.add('d-none');
  snapshot.classList.add('d-none');
};

const do_snapshot = () => {
  snapshot_image.classList.remove('d-none');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  snapshot_image.src = canvas.toDataURL('image/webp');
  snapshot_image.classList.add("anim-zoom");
  setTimeout(() => { snapshot_image.classList.remove("anim-zoom"); }, 0.2);
};

const goto_reference_frame = () => {
  splash_frame.classList.add("d-none");
  main_frame.classList.add("d-none");
  reference_frame.classList.remove("d-none");
}


play.onclick = start_video
pause.onclick = pause_video;
snapshot.onclick = do_snapshot;
splash_frame.onclick = goto_reference_frame;

// Select reference screen
const img_ref_preview = document.querySelector('#ref-preview');
const btn_ref_url = document.querySelector('#ref-link');
const btn_ref_file = document.querySelector('#ref-file');
const btn_ref_use = document.querySelector('#ref-use');
const input_ref_file = document.querySelector('#ref-file-input');

const pick_ref_url = () => {
  url = prompt("Please enter an image url", "");
  if(url){
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
  splash_frame.classList.add("d-none");
  reference_frame.classList.add("d-none");
  main_frame.classList.remove("d-none");
}

btn_ref_url.onclick = pick_ref_url;
btn_ref_file.onclick = pick_ref_file;
btn_ref_use.onclick = goto_main_frame;
input_ref_file.onchange = handle_file_dialoge;