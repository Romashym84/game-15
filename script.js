const gameStatus = {
  isActiveAnimation: false,
  isActiveGame: false,
  isAutoRuning: false,
  gameClassicActive: true,
};

let showCount = 0;
let countRefresh = 0;
let timer = null;
let startTime = null;

document.addEventListener("DOMContentLoaded", () => {
  const box = document.querySelector(".box");
  const field = document.querySelector(".field");
  const range = document.getElementById("rangeInput");
  const classic = document.querySelector(".classic");
  const intelectual = document.querySelector(".intelectual");
  const start = document.querySelector(".start");
  const rangeValue = document.getElementById("rangeValue");
  const resetButton = document.querySelector(".reset");
  const countDisplay = document.getElementById("count_num");
  const timerDisplay = document.getElementById("timer_num");
  const menu = document.querySelector(".menu");
  const menuContent = document.querySelector(".menu-content");
  const typGameClassic = document.querySelector(".classic");
  const typGameIntelectual = document.querySelector(".intelectual");
  const numberRefreshValue = document.getElementById("number-of-shifts");

  loadLocalStorage();
  init();

  function saveLocalStorage() {
    const { gameClassicActive } = gameStatus;
    localStorage.setItem("gameStatus", JSON.stringify({ gameClassicActive }));
    localStorage.setItem("gameConfig", JSON.stringify(gameConfig.size));
    localStorage.setItem(
      "numberRefreshValue",
      JSON.stringify(numberRefreshValue.value)
    );
  }

  function loadLocalStorage() {
    const localTypGame = localStorage.getItem("gameStatus");
    const localRangeValue = localStorage.getItem("gameConfig");
    const refreshValue = localStorage.getItem("numberRefreshValue");

    if (localTypGame) {
      try {
        numberRefreshValue.value = JSON.parse(refreshValue);
        const savedStatus = JSON.parse(localTypGame);
        gameStatus.gameClassicActive = savedStatus.gameClassicActive;
        gameStatus.gameClassicActive
          ? (typGameClassic.style.background = "red")
          : (typGameIntelectual.style.background = "red");
      } catch (e) {
        console.error("Помилка під час завантаження статусу гри", e);
      }
    }

    if (localRangeValue) {
      try {
        gameConfig.size = JSON.parse(localRangeValue);
        rangeValue.textContent = JSON.parse(localRangeValue);
        range.value = JSON.parse(localRangeValue);
      } catch (e) {
        console.error("Помилка під час завантаження розміру гри", e);
      }
    }
  }

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
      startTime = null;
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
    box.style.maxWidth = resizeField(gameConfig.size);
    const value = `repeat(${size}, 1fr)`;
    field.style = `grid-template-columns:${value};grid-template-rows: ${value};`;
  }

  function init() {
    initStyle(gameConfig.size);
    initGame();
    updateRender();
    gameStatus.isActiveAnimation = false;
  }

  function updateRender() {
    render(state, field);
  }

  resetButton.addEventListener("click", () => {
    gameStatus.isActiveGame = false;
    resetAll();
    init();
  });

  init();

  function stopCount() {
    showCount = showCount;
  }

  function isControleVictory() {
    countRefresh++;

    if (!gameStatus.isAutoRuning && checkState(state)) {
      alert("ОТ МОЛОДЕЦЬ!!!");
      stopTimer();
      stopCount();
    }
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  field.addEventListener("click", async (event) => {
    if (gameStatus.isActiveAnimation) return;

    if (gameStatus.gameClassicActive) {
      if (checkState(state)) return;
    }

    const target = event.target;

    if (!target.classList.contains("number")) return;

    const direction = move(state, Number.parseInt(target.textContent));

    if (!direction) return;

    target.classList.add(`number--${direction}`);
    gameStatus.isActiveAnimation = true;

    if (gameStatus.isActiveGame) {
      startTimer();
    }

    const isAutoRuning = gameStatus.isAutoRuning;
    await delay(250);

    updateRender();

    if (gameStatus.gameClassicActive) {
      countDisplay.textContent = ++showCount;

      if (checkState(state)) {
        alert("ОТ МОЛОДЕЦЬ!!!");
        stopTimer();
      }
    } else {
      if (isAutoRuning) {
        countDisplay.textContent = ++showCount;
      } else {
        countDisplay.textContent = --showCount;
        isControleVictory(+numberRefreshValue.value);
        if (checkState(state)) return;
      }
    }

    gameStatus.isActiveAnimation = false;
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
    if (event.target === menuContent || menuContent.contains(event.target))
      return;
    menuContent.classList.add("menu-content-show");
  });

  range.addEventListener("input", (event) => {
    const size = event.target.value;
    rangeValue.textContent = size;
    setSize(size);
    init();
    box.style.maxWidth = resizeField(gameConfig.size);
  });

  classic.addEventListener("click", (event) => {
    typGameClassic.style.background = "red";
    typGameIntelectual.style.background = "";
    gameStatus.gameClassicActive = true;
  });

  intelectual.addEventListener("click", (event) => {
    typGameIntelectual.style.background = "red";
    typGameClassic.style.background = "";
    gameStatus.gameClassicActive = false;
  });

  start.addEventListener("click", () => {
    if (!gameStatus.gameClassicActive) {
      init();
      let value = +numberRefreshValue.value;

      if (!value) {
        alert("Введіть кількість кроків");
        return;
      } else {
        state = setInitialState(gameConfig.size);
        autoRun(value);
        resetAll();
      }
    } else {
      refresh();
      init();
    }

    menuContent.classList.remove("menu-content-show");
    saveLocalStorage();
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
  gameStatus.isAutoRuning = true;
  const id = setInterval(() => {
    const value = getRandomActiveValue(state);
    const elem = document.getElementById(`num_${value}`);

    if (elem) {
      console.log("##", "beforeRunClick");
      elem.click();
      console.log("##", "afterRunClick");
    }

    console.log("AUTORUN", curentCount, count, gameStatus.isAutoRuning);
    ++curentCount;
    if (curentCount === count) {
      clearInterval(id);
      gameStatus.isAutoRuning = false;
      gameStatus.isActiveGame = true;
    }
  }, 300);
}
