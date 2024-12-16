// const FIELD_SIZE = 4;
const EMPTY_VALUE = null;
const MOVE_DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};
const gameConfig = { size: 4 };

let state = [];

function setSize(size) {
  gameConfig.size = size;
}

function setInitialState(size) {
  const maxCount = size * size;
  const result = [];

  for (let i = 1; i < maxCount; i++) {
    result.push(i);
  }

  result.push(EMPTY_VALUE);

  return result;
}

function getIndexByCoord(x, y) {
  let index = x + y * gameConfig.size;
  return index;
}

function getValueByIndex(index) {
  return state[index];
}

function getCoordByIndex(index) {
  const y = Math.floor(index / gameConfig.size);
  const x = index - y * gameConfig.size;
  return { x, y };
}

function getCoordByValue(state, value) {
  return getCoordByIndex(state.indexOf(value));
}

function getCoordByEmpty(state) {
  return getCoordByValue(state, EMPTY_VALUE);
}

function checkMoove(state, value) {
  const valueCoord = getCoordByValue(state, value);
  const emptyCoord = { ...getCoordByEmpty(state), direction: null };

  if (valueCoord.x === emptyCoord.x && valueCoord.y - 1 === emptyCoord.y) {
    console.log("up");
    emptyCoord.direction = MOVE_DIRECTION.UP;
    return emptyCoord;
  }

  if (valueCoord.x === emptyCoord.x && valueCoord.y + 1 === emptyCoord.y) {
    console.log("down");
    emptyCoord.direction = MOVE_DIRECTION.DOWN;
    return emptyCoord;
  }

  if (valueCoord.x - 1 === emptyCoord.x && valueCoord.y === emptyCoord.y) {
    console.log("left");
    emptyCoord.direction = MOVE_DIRECTION.LEFT;
    return emptyCoord;
  }

  if (valueCoord.x + 1 === emptyCoord.x && valueCoord.y === emptyCoord.y) {
    console.log("right");
    emptyCoord.direction = MOVE_DIRECTION.RIGHT;
    return emptyCoord;
  }
}

function move(state, value) {
  const coord = checkMoove(state, value);
  if (!coord) return;
  const index = state.indexOf(value);
  const newIndex = getIndexByCoord(coord.x, coord.y);
  [state[index], state[newIndex]] = [state[newIndex], state[index]];

  return coord.direction;
}

function checkState(state) {
  return state.every(
    (value, index) => index === value - 1 || value === EMPTY_VALUE
  );
}

function getActiveValue(state) {
  const result = [];
  const coordEmpty = getCoordByEmpty(state);
  const upIndex = getIndexByCoord(coordEmpty.x, coordEmpty.y - 1);
  if (coordEmpty.y !== 0) {
    result.push(state[upIndex]);
  }

  const downIndex = getIndexByCoord(coordEmpty.x, coordEmpty.y + 1);
  if (coordEmpty.y !== gameConfig.size - 1) {
    result.push(state[downIndex]);
  }

  const leftIndex = getIndexByCoord(coordEmpty.x - 1, coordEmpty.y);
  if (coordEmpty.x !== 0) {
    result.push(state[leftIndex]);
  }

  const rightIndex = getIndexByCoord(coordEmpty.x + 1, coordEmpty.y);
  if (coordEmpty.x !== gameConfig.size - 1) {
    result.push(state[rightIndex]);
  }

  return result;
}

function getRandomValue(maxValue) {
  return Math.floor(Math.random() * (maxValue + 1));
}

function getRandomActiveValue(state) {
  const activeValue = getActiveValue(state);
  const index = getRandomValue(activeValue.length - 1);
  return activeValue[index];
}

function refresh() {
  state = setInitialState(gameConfig.size)
    .map((item) => ({ item, index: Math.random() }))
    .sort((a, b) => a.index - b.index)
    .map(({ item }) => item);
  if (!checkInversion(state)) {
    refresh();
    console.log("repeat refresh");
  }
}

function initGame() {
    state = setInitialState(gameConfig.size);
   refresh();
}

function checkInversion(state) {
  const stateNoEmpty = state.filter((state) => state !== EMPTY_VALUE);
  const emptyY = getCoordByEmpty(state).y + 1;
  let inversion = 0;
  for (let i = 0; i < stateNoEmpty.length; i++) {
    for (let j = i + 1; j < stateNoEmpty.length; j++) {
      if (stateNoEmpty[i] > stateNoEmpty[j]) {
        inversion++;
      }
    }
  }
  if (isEven(gameConfig.size)) {
    return isEven(inversion + emptyY);
  } else {
    return isEven(inversion);
  }
}

function isEven(value) {
  return value % 2 === 0;
}
