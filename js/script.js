// Timer
const timerButtons = document.querySelector('.timer-buttons');
const divFTimer = document.getElementById('focus-timer');
const divBTimer = document.getElementById('break-timer');
const focusMinutes = document.getElementById('focusMinutes');
const focusSeconds = document.getElementById('focusSeconds');

const breakMinutes = document.getElementById('breakMinutes');
const breakSeconds = document.getElementById('breakSeconds');

const countSessions = document.getElementById('countSessions');
const numSessions = document.getElementById('numSessions');
const sessionList = document.querySelectorAll('.counter-sessions__line');

const outerCircle = document.querySelector('.timer__circle');
const timerStatus = document.querySelector('.timer-status');
const timerAlert = document.querySelector('.timer__alert');
const bell = document.querySelector('.timer__bell');

let timerID;

const defaultValueTimer = {
  fm: 25,
  fs: '00',
  bm: 5,
  bs: '00',
};

function runTime(seconds, minutes) {
  if (seconds.innerText != 0) {
    seconds.innerText--;
  } else if (minutes.innerText != 0 && seconds.innerText == 0) {
    seconds.innerText = 59;
    minutes.innerText--;
  }
}

function startTimer() {
  const defTotalSec = +focusMinutes.textContent * 60 + +focusSeconds.textContent;
  const curTotalSec = +defaultValueTimer.fm * 60 + +defaultValueTimer.fs;

  if (focusMinutes.innerText != 0 || focusSeconds.innerText != 0) {
    timerStatus.textContent = 'Focus';
    setProgress(defTotalSec / curTotalSec * 100);
    runTime(focusSeconds, focusMinutes);
  }

  if (focusMinutes.innerText == 0 && focusSeconds.innerText == 0) {
    timerStatus.textContent = 'Break';
    setProgress(0);

    if (breakSeconds.innerText == 0) {
      divFTimer.style.visibility = 'hidden';
      outerCircle.classList.add('break');
      bell.play();
    }

    runTime(breakSeconds, breakMinutes);
    divBTimer.style.visibility = 'visible';
  }

  if (focusMinutes.innerText == 0 && focusSeconds.innerText == 0 && breakMinutes.innerText == 0 && breakSeconds.innerText == 0) {
    resetValue();
    countSession();
    countSessions.innerText++;
    bell.play();
    outerCircle.classList.remove('break');
  }

  if (countSessions.innerText >= numSessions.innerText) {
    timerStatus.textContent = 'Session complete!';
    resetValue();
  }
}

function resetValue() {
  focusMinutes.innerText = defaultValueTimer.fm;
  focusSeconds.innerText = defaultValueTimer.fs;
  breakMinutes.innerText = defaultValueTimer.bm;
  breakSeconds.innerText = defaultValueTimer.bs;
  divFTimer.style.visibility = 'visible';
  divBTimer.style.visibility = 'hidden';
  setProgress(100);
}

function pauseTimer() {
  clearTimeout(timerID);
  timerID = undefined;
}

function resetTimer() {
  resetValue();
  pauseTimer();
  countSessions.innerText = 0;
  timerStatus.textContent = 'Study with me';
}

function countSession() {
  const num = +countSessions.textContent;
  sessionList[num].classList.add('complete');
  document.querySelector('.wrapper').style.backgroundImage = `url('img/${num}.jpg')`;
}

function callAlert() {
  timerAlert.style.visibility = "visible";
  setTimeout(() => {
    timerAlert.style.visibility = "hidden";
  }, 800);
}

timerButtons.addEventListener('click', function (e) {
  if (e.target.closest('.timer-buttons__start')) {
    if (countSessions.innerText >= numSessions.innerText) {
      timerAlert.textContent = 'Press reset!';
      callAlert();
    } else {
      if (timerID == undefined) {
        function interval() {
          startTimer();
          timerID = setTimeout(interval, 1000);
        }
        setTimeout(interval, 0);
      } else {
        timerAlert.textContent = 'Already started!';
        callAlert();
      }
    }
  } else if (e.target.closest('.timer-buttons__pause')) {
    pauseTimer();
    timerStatus.textContent = 'Pause';
  } else if (e.target.closest('.timer-buttons__reset')) {
    resetTimer();
    outerCircle.classList.remove('break');
    sessionList.forEach(e => e.classList.remove('complete'));
  }
});

// Progress-circle
const circle = document.querySelector('.timer__progress-circle');
const radius = circle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - percent / 100 * circumference;
  circle.style.strokeDashoffset = offset;
}

setProgress(100);

//Settings
const popup = document.querySelector('.popup');
const popupLink = document.querySelector('._popup-link');
const popupBtn = document.querySelector('.settings__btn');

function closePopup() {
  popup.classList.remove('_active');
}

popupLink.addEventListener('click', function (e) {
  popup.classList.add('_active');
});

document.addEventListener('keydown', function (e) {
  if (e.code === 'Escape') {
    closePopup();
  }
});

popup.addEventListener('click', function (e) {
  if (!e.target.closest('.settings') || e.target.closest('.popup__close')) closePopup();
});

const focusInput = document.getElementById('focusInput');
const breakInput = document.getElementById('breakInput');

popupBtn.addEventListener('click', function (e) {
  defaultValueTimer.fm = +focusInput.value;
  defaultValueTimer.bm = +breakInput.value;
  resetTimer();
  closePopup();
});

// Inputs settings
function checkInputs() {
  if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
  if (this.value < 0) this.value = 0;
}

focusInput.oninput = checkInputs;
breakInput.oninput = checkInputs;

//Player
const player = document.querySelector('.player__buttons');
const titlePlayer = document.querySelector('.player__title');
const playPlayer = document.querySelector('.player__play');
const audioPlayer = document.getElementById('playerAudio');

import playList from "./playlist.js";

let isPlay = false;
let playNum = 0;

function playAudio() {
  if (!isPlay) {
    audioPlayer.play();
    isPlay = true;
  } else {
    audioPlayer.pause();
    isPlay = false;
  }
}

function stopAudio() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
}

function playPrev() {
  function decrement() {
    if (isPlay) {
      playNum--;
      audioPlayer.src = playList[playNum].src;
      titlePlayer.innerHTML = playList[playNum].title;
      audioPlayer.play();
    } else {
      playNum--;
      audioPlayer.src = playList[playNum].src;
      titlePlayer.innerHTML = playList[playNum].title;
    }
  }

  if (playNum > 0) {
    decrement();
  } else {
    playNum = playList.length;
    decrement();
  }
}

function playNext() {
  function increment() {
    if (isPlay) {
      playNum++;
      audioPlayer.src = playList[playNum].src;
      titlePlayer.innerHTML = playList[playNum].title;
      audioPlayer.play();
    } else {
      playNum++;
      audioPlayer.src = playList[playNum].src;
      titlePlayer.innerHTML = playList[playNum].title;
    }
  }

  if (playNum < playList.length - 1) {
    increment();
  } else {
    playNum = -1;
    increment();
  }
}

player.addEventListener('click', function (e) {
  if (e.target.closest('.player__prev')) {
    playPrev();
  }
  if (e.target.closest('.player__play')) {
    playAudio();
    playPlayer.classList.toggle('pause');
  }
  if (e.target.closest('.player__stop')) {
    isPlay = false;
    playPlayer.classList.remove('pause');
    stopAudio();
  }
  if (e.target.closest('.player__next')) {
    playNext();
  }
});

audioPlayer.addEventListener('ended', function (e) {
  playNext();
});