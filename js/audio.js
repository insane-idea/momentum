import playList from "./playlist.js";

const body = document.querySelector("body"),
  audio = body.querySelector(".audio"),
  play = body.querySelector(".play"),
  play2 = body.querySelector(".play2"),
  playListContainer = body.querySelector(".play-list"),
  playPrevBtn = body.querySelector(".play-prev"),
  playNextBtn = body.querySelector(".play-next"),
  trackName = body.querySelector(".track-name"),
  progressBar = body.querySelector(".progress-bar"),
  progressTime = body.querySelector(".current-time"),
  commonTime = body.querySelector(".common-time"),
  volumeToggle = body.querySelector(".volume-toggle"),
  volumeRange = body.querySelector(".volume");

let isPaused = true,
  playNum = 0,
  savedVolumeHeight = volumeRange.value;

createPlayList();
const playItems = document.querySelectorAll(".play-item");
setSongData();
init();

//*  PLAY

function createPlayList() {
  playList.forEach((el) => {
    const li = document.createElement("li");
    li.classList.add("play-item");
    li.textContent = el.title;
    playListContainer.append(li);
  });
}

function turnAudio() {
  if (isPaused) {
    audio.play();
    togglePlayButtonsImage();
    setSongData();
    isPaused = false;
  } else if (!isPaused) {
    audio.pause();
    togglePlayButtonsImage();
    setSongData();
    isPaused = true;
  }
}

function updateTrack() {
  audio.src = playList[playNum].src;
}

function playNext() {
  isPaused = true;
  removePlayStyles();
  playNum = (playList.length + playNum + 1) % playList.length;
  updateTrack();
  turnAudio();
}

function playPrev() {
  isPaused = true;
  removePlayStyles();
  playNum = (playList.length + playNum - 1) % playList.length;
  updateTrack();
  turnAudio();
}

function mute() {
  if (volumeRange.value <= 0) {
    if (savedVolumeHeight == 0) {
      volumeToggle.className = "volume-toggle";
      audio.volume = 0.5;
      volumeRange.value = 0.5;
      savedVolumeHeight = 0;
    } else {
      volumeToggle.className = "volume-toggle";
      audio.volume = savedVolumeHeight;
      volumeRange.value = savedVolumeHeight;
      savedVolumeHeight = 0;
    }
  } else {
    if (volumeRange.value > 0) {
      volumeToggle.classList.add("volume-mute");
      savedVolumeHeight = volumeRange.value;
      audio.volume = 0;
      volumeRange.value = 0;
    }
  }
}

function init() {
  audio.volume = volumeRange.value;
  savedVolumeHeight = volumeRange.value;
  updateTrack();
}

//*  UI

function togglePlayButtonsImage() {
  if (isPaused) {
    play.classList.add("pause");
    play2.classList.add("pause2");
  } else if (!isPaused) {
    play.classList.remove("pause");
    play2.classList.remove("pause2");
  }
}

function toggleSoundButtonImage() {
  if (audio.volume == 0) {
    volumeToggle.classList.add("volume-mute");
  } else {
    volumeToggle.className = "volume-toggle";
  }
}

function setTrackName() {
  trackName.textContent = playList[playNum].title;
}

function setDuration() {
  let mins = Math.floor(playList[playNum].duration / 60);
  let seconds = Math.floor(playList[playNum].duration) - mins * 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  commonTime.textContent = `${mins}:${seconds}`;
}

function setPlayStyles() {
  playItems[playNum].classList.add("item-active");
}

function removePlayStyles() {
  playItems[playNum].className = "play-item";
}

function setSongData() {
  setTrackName();
  setDuration();
  setPlayStyles();
}

//*  PROGRESS

function showCurrentPlayTime() {
  let mins = Math.floor(audio.currentTime / 60);
  let seconds = Math.floor(audio.currentTime - mins * 60);
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  progressTime.textContent = `${mins}:${seconds} `;
}

function updateProgressBar() {
  let currPercent = audio.currentTime / audio.duration || 0;
  progressBar.value = currPercent;
}

function scrubPlayTime(e) {
  let rangeShift = (e.offsetX / e.target.offsetWidth) * audio.duration;

  if (rangeShift >= Math.floor(audio.duration)) {
    return;
  } else {
    audio.currentTime = rangeShift;
  }
}

function scrubVolume(e) {
  let rangeShift = (e.offsetX / e.target.offsetWidth) * volumeRange.max;

  if (rangeShift > 1) {
    return;
  } else {
    if (rangeShift < -0.0000001) {
      return;
    } else if (rangeShift < 0.05) {
      volumeRange.value = 0;
      audio.volume = 0;
      toggleSoundButtonImage();
    } else {
      volumeRange.value = rangeShift;
      audio.volume = rangeShift;
      toggleSoundButtonImage();
      // console.log(e.offsetX, e.target.offsetWidth, volumeRange.max, rangeShift);
    }
  }
}

play.addEventListener("click", turnAudio);
play2.addEventListener("click", turnAudio);
playNextBtn.addEventListener("click", playNext);
playPrevBtn.addEventListener("click", playPrev);
audio.addEventListener("ended", playNext);
audio.addEventListener("timeupdate", showCurrentPlayTime);
audio.addEventListener("timeupdate", updateProgressBar);

let mousedown = false;

progressBar.addEventListener("click", scrubPlayTime);
progressBar.addEventListener("mousemove", (e) => mousedown && scrubPlayTime(e));
progressBar.addEventListener("mousedown", () => (mousedown = true));
progressBar.addEventListener("mouseup", () => (mousedown = false));

volumeRange.addEventListener("click", scrubVolume);
volumeRange.addEventListener("mousemove", (e) => mousedown && scrubVolume(e));
volumeRange.addEventListener("mousedown", () => (mousedown = true));
volumeRange.addEventListener("mouseup", () => (mousedown = false));

volumeToggle.addEventListener("click", mute);
