document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".box");
  const field = document.querySelector(".field");
  const range = document.getElementById("rangeInput");
  const rangeValue = document.getElementById("rangeValue");
  const resetButton = document.querySelector(".reset");
  const countDisplay = document.getElementById("count_num");
  const timerDisplay = document.getElementById("timer_num");
  const menu = document.querySelector(".menu");
  const menuContent = document.querySelector(".menu-content");
  const typGameClassic = document.querySelector(".classic");
  const typGameIntelectual = document.querySelector(".intelectual");
  const numberOfShift = document.getElementById("number-of-shifts");

  let runCount = 0;
  let showCount = 0;
  let timer = null;
  let startTime = null;
  let isActiveAnimation = false;
  let isActiveGame = false;
  let gameClassicActive = true;
  let gameIntelectualActive = false;
  //   let sizeField;

  function startTimer() {
    if (!startTime) {
      startTime = new Date();
      timer = setInterval(updateTimer, 1000);
    }
  }

  function updateTimer() {
    const now = new Date();
    let elapsedTime = Math.floor((now - startTime) / 1000);

    let minutes = Math.floor(elapsedTime / 60);
    let seconds = elapsedTime % 60;

    const formatMinutes = (minutes < 10 ? "0" : "") + minutes;
    const formatSeconds = (seconds < 10 ? "0" : "") + seconds;

    timerDisplay.textContent = formatMinutes + ":" + formatSeconds;
  }

  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetAll() {
    showCount = 0;
    countDisplay.textContent = "0";
    stopTimer();
    startTime = null;
    timerDisplay.textContent = "00:00";
  }

  function initStyle(size) {
    const value = `repeat(${size}, 1fr)`;
    field.style = `grid-template-columns:${value};grid-template-rows: ${value};`;
  }

  function init() {
    initStyle(gameConfig.size);
    initGame();
    updateRender();
  }

  function updateRender() {
    render(state, field);
  }

  resetButton.addEventListener("click", () => {
    isActiveGame = false;
    resetAll();
    init();
  });

  init();

  field.addEventListener("click", (event) => {
    if (isActiveAnimation) return;

    // if (checkState(state)) return;

    const target = event.target;

    if (target.classList.contains("number")) {
      console.log(target.textContent);
      const direction = move(state, Number.parseInt(target.textContent));

      if (!direction) return;

      target.classList.add(`number--${direction}`);
      isActiveAnimation = true;

      if (!isActiveGame) {
        startTimer();
        isActiveGame = true;
      }

      setTimeout(() => {
        updateRender();
        countDisplay.textContent = ++showCount;
        console.log(showCount);
        // if (checkState(state)) {
        //   alert("ОТ МОЛОДЕЦЬ!!!");
        //   stopTimer();
        // }

        isActiveAnimation = false;
      }, 250);
    }
  });

  range.addEventListener("input", (event) => {
    const size = event.target.value;
    console.log(size);
    rangeValue.textContent = size;
    setSize(size);
    init();
    console.log(gameConfig.size);
    box.style.maxWidth = resizeField(gameConfig.size);
  });

  function resizeField(size) {
    if (size === "3") {
      return (box.style.maxWidth = "366px");
    } else if (size === "4") {
      return (box.style.maxWidth = "443px");
    } else if (size === "5") {
      return (box.style.maxWidth = "560px");
    } else if (size === "6") {
      return (box.style.maxWidth = "645px");
    }
  }

  menu.addEventListener("click", (event) => {
    const target = event.target;
    menuContent.classList.add("menu-content-show");
    console.log(target.textContent);
    if (target.classList.contains("start")) {
      menuContent.classList.remove("menu-content-show");
    }
    if (target.classList.contains("classic")) {
      target.style.background = "red";
      typGameIntelectual.style.background = "";
      gameIntelectualActive = false;
      gameClassicActive = true;
    }
    if (target.classList.contains("intelectual")) {
      target.style.background = "red";
      typGameClassic.style.background = "";
      gameIntelectualActive = true;
      gameClassicActive = false;
    }
  });
});

function render(list, container) {
  container.innerHTML = "";

  list.forEach((item) => {
    const elem = document.createElement("div");
    elem.classList.add("number");

    if (!item) {
      elem.classList.add("number--empty");
    }

    elem.setAttribute("id", `num_${item}`);
    elem.textContent = item;

    container.insertAdjacentElement("beforeend", elem);
  });
}

function autoRun(count) {
  let curentCount = 0;
  const id = setInterval(() => {
    const value = getRandomActiveValue(state);
    const elem = document.getElementById(`num_${value}`);

    if (elem) {
      elem.click();
    }
    console.log(curentCount, value, elem);
    curentCount++;
    if (curentCount === count) clearInterval(id);
  }, 300);
}
