// ---------------------------
// Seletores de elementos
// ---------------------------
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const currentProgress = document.getElementById('current-progress');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const likeButton = document.getElementById('like');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('duration-time');

// ---------------------------
// Lista de músicas
// ---------------------------
const playlistData = [
  { songName: 'Todo casal', bandName: 'Marcos e Beluti', file: 'marcos_beluti_todo_casal', liked: false },
  { songName: 'Na hora que você me chamar', bandName: 'Jorge e Mateus', file: 'jorge_mateus', liked: false },
  { songName: 'Cê Me Conhece Eu Me Conheço', bandName: 'Henrique e Juliano', file: 'henrique_juliano', liked: false },
  { songName: 'Chega e Chora', bandName: 'Marcos e Beluti', file: 'marcos_beluti', liked: false },
  { songName: 'Eu e vc o mar e Ela', bandName: 'Luan Santana', file: 'luan_santana', liked: false }
  
];

// ---------------------------
// Estado do player
// ---------------------------
let isPlaying = false;
let isShuffled = false;
let isRepeating = false;
let index = 0;

// Recupera dados salvos no localStorage
const savedData = localStorage.getItem('playlistData');
let playlist = savedData ? JSON.parse(savedData) : [...playlistData];

// ---------------------------
// Funções auxiliares
// ---------------------------
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ---------------------------
// Inicializa música
// ---------------------------
function initializeSong() {
  const currentSong = playlist[index];

  cover.src = `images/${currentSong.file}.jpg`;
  audio.src = `sons/${currentSong.file}.mp3`;
  songName.innerText = currentSong.songName;
  bandName.innerText = currentSong.bandName;

  currentProgress.style.width = '0%';
  currentTimeEl.innerText = '0:00';
  totalTimeEl.innerText = '0:00';

  // Atualiza like
  const icon = likeButton.querySelector('.bi');
  if (currentSong.liked) {
    likeButton.classList.add('liked');
    icon.classList.add('bi-heart-fill');
    icon.classList.remove('bi-heart');
  } else {
    likeButton.classList.remove('liked');
    icon.classList.remove('bi-heart-fill');
    icon.classList.add('bi-heart');
  }
}

// ---------------------------
// Funções principais
// ---------------------------
function playAudio() {
  audio.play();
  isPlaying = true;
  play.querySelector('.bi').classList.remove('bi-play-circle-fill');
  play.querySelector('.bi').classList.add('bi-pause-circle-fill');
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  play.querySelector('.bi').classList.add('bi-play-circle-fill');
  play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
}

function playPauseDecider() {
  isPlaying ? pauseAudio() : playAudio();
}

function nextSong() {
  index = (index + 1) % playlist.length;
  initializeSong();
  playAudio();
}

function previousSong() {
  index = (index - 1 + playlist.length) % playlist.length;
  initializeSong();
  playAudio();
}

// ---------------------------
// Shuffle e Repeat
// ---------------------------
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleButtonClicked() {
  isShuffled = !isShuffled;
  if (isShuffled) {
    playlist = shuffleArray(playlistData);
    shuffleButton.classList.add('active');
  } else {
    playlist = [...playlistData];
    shuffleButton.classList.remove('active');
  }
  index = 0;
  initializeSong();
  playAudio();
}

function repeatButtonClicked() {
  isRepeating = !isRepeating;
  repeatButton.classList.toggle('active', isRepeating);
}

// ---------------------------
// Like com persistência
// ---------------------------
likeButton.addEventListener('click', () => {
  const currentSong = playlist[index];
  currentSong.liked = !currentSong.liked;

  likeButton.classList.toggle('liked', currentSong.liked);

  const icon = likeButton.querySelector('.bi');
  icon.classList.toggle('bi-heart-fill', currentSong.liked);
  icon.classList.toggle('bi-heart', !currentSong.liked);

  localStorage.setItem('playlistData', JSON.stringify(playlist));
});

// ---------------------------
// Atualiza progresso
// ---------------------------
function updateProgressBar() {
  if (audio.duration) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    currentProgress.style.width = `${progressPercent}%`;
    currentTimeEl.innerText = formatTime(audio.currentTime);
  }
}

// ---------------------------
// Eventos do audio
// ---------------------------
audio.addEventListener('timeupdate', updateProgressBar);

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.innerText = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  currentProgress.style.width = '100%';
  currentTimeEl.innerText = formatTime(audio.duration);

  if (isRepeating) {
    audio.currentTime = 0;
    playAudio();
  } else {
    nextSong();
  }
});

// ---------------------------
// Eventos dos botões
// ---------------------------
play.addEventListener('click', playPauseDecider);
next.addEventListener('click', nextSong);
previous.addEventListener('click', previousSong);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);

// ---------------------------
// Inicializa player
// ---------------------------
initializeSong();


















  


