feather.replace();

const controls = document.querySelector('.controls-top');
const controls_bot = document.querySelector('.controls-bot');
const mix_options = document.querySelector('.mix-options>select');
const render_options = document.querySelector('.render-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const content = document.querySelector('#content');
const snapshot_image = document.querySelector('#snapshot-img');
const play = controls.querySelector('#play');
const pause = controls.querySelector('#pause');
const snapshot = controls.querySelector('#snapshot');

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
  content.classList.remove('mix-blink');
  content.classList.remove('mix-blend');
  content.classList.remove('mix-darken');
  content.classList.remove('mix-video');
  content.classList.remove('mix-reference');
  content.classList.add(mix_options.value);
};

render_options.onchange = () => {
  content.classList.remove('render-normal');
  content.classList.remove('render-mirror');
  content.classList.remove('render-value');
  content.classList.add(render_options.value);
};

const start_video = () => {
  if (stream_started) {
    video.play();
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    snapshot.classList.remove('d-none');
    return;
  }
  controls_bot.classList.remove('d-none');
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

play.onclick = start_video
pause.onclick = pause_video;
snapshot.onclick = do_snapshot;

const start_stream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handle_stream(stream);
};


const handle_stream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  pause.classList.remove('d-none');
  snapshot.classList.remove('d-none');
};
