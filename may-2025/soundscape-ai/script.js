const moodSelector = document.getElementById('mood-selector');
const soundscapeUI = document.getElementById('soundscape-ui');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const backBtn = document.getElementById('back-btn');
const noiseToggle = document.getElementById('noise-toggle');
const toneToggle = document.getElementById('tone-toggle');
const noiseVolume = document.getElementById('noise-volume');
const toneVolume = document.getElementById('tone-volume');

let audioCtx, noiseSource, toneOscillator, noiseGain, toneGain, analyser;
let animationId;

const SOUND_PRESETS = {
  Relax: { noiseFreq: 800, toneFreq: 220, color: '#60a5fa' },
  Focus: { noiseFreq: 2000, toneFreq: 440, color: '#34d399' },
  Energize: { noiseFreq: 5000, toneFreq: 880, color: '#f87171' },
  Sleep: { noiseFreq: 500, toneFreq: 110, color: '#a78bfa' }
};

function createNoiseBuffer(ctx) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function startSoundscape(mood) {
  if (audioCtx) {
    audioCtx.close();
    cancelAnimationFrame(animationId);
  }

  const preset = SOUND_PRESETS[mood];
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Noise layer
  noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(audioCtx);
  noiseGain = audioCtx.createGain();
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = preset.noiseFreq;
  noiseSource.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
  noiseGain.gain.value = noiseVolume.value;

  // Tone layer
  toneOscillator = audioCtx.createOscillator();
  toneGain = audioCtx.createGain();
  toneOscillator.type = 'sine';
  toneOscillator.frequency.value = preset.toneFreq;
  toneOscillator.connect(toneGain).connect(audioCtx.destination);
  toneGain.gain.value = toneVolume.value;

  // Analyzer
  analyser = audioCtx.createAnalyser();
  noiseGain.connect(analyser);
  toneGain.connect(analyser);
  analyser.fftSize = 256;

  noiseSource.start();
  toneOscillator.start();

  moodSelector.classList.add('hidden');
  soundscapeUI.classList.remove('hidden');
  drawVisualizer(preset.color);
}

function drawVisualizer(color) {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = '#00000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i] / 2;
      ctx.fillStyle = color;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
    animationId = requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Event listeners
document.querySelectorAll('.mood-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    startSoundscape(btn.dataset.mood);
  });
});

noiseToggle.addEventListener('change', () => {
  noiseGain.gain.value = noiseToggle.checked ? noiseVolume.value : 0;
});

toneToggle.addEventListener('change', () => {
  toneGain.gain.value = toneToggle.checked ? toneVolume.value : 0;
});

noiseVolume.addEventListener('input', () => {
  noiseGain.gain.value = noiseVolume.value;
});

toneVolume.addEventListener('input', () => {
  toneGain.gain.value = toneVolume.value;
});

backBtn.addEventListener('click', () => {
  if (audioCtx) {
    audioCtx.close();
    cancelAnimationFrame(animationId);
  }
  soundscapeUI.classList.add('hidden');
  moodSelector.classList.remove('hidden');
});