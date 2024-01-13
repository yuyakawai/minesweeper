const mainContainer = {
  element: null,
  width: 320,
  height: 480,
};

const screenContainer = {
  element: null,
  width: mainContainer.width * 0.9375,
  height: mainContainer.height * 0.75,
};

const timeMessageContainer = {
  element: null,
  width: mainContainer.width * 0.9375,
  height: mainContainer.height * 0.05,
};

const controllerContainer = {
  element: null,
  width: mainContainer.width * 0.9,
  height: mainContainer.height * 0.15,
};

const controller = {
  pressedButtonNum: 0,
  buttons: [
    { name: "🔨", element: null, isPressed: true },
    { name: "🚩", element: null, isPressed: false },
  ],

  init: () => {
    controller.buttons.forEach((button) => {
      let buttonElement = document.createElement("div");
      buttonElement.style.position = "relative";
      buttonElement.style.width = controllerContainer.width * 0.35 + "px";
      buttonElement.style.height = controllerContainer.height * 0.5 + "px";
      buttonElement.style.margin = "15px";
      buttonElement.style.fontSize = controllerContainer.width * 0.08 + "px";
      buttonElement.style.backgroundColor = "orange";
      buttonElement.style.borderBottom = "5px solid #b84c00";
      buttonElement.style.borderRadius = "7px";
      buttonElement.style.boxSizing = "border-box";
      buttonElement.style.cursor = "pointer";
      buttonElement.style.display = "flex";
      buttonElement.style.alignItems = "center";
      buttonElement.style.justifyContent = "center";
      buttonElement.textContent = button.name;
      button.element = buttonElement;
      controllerContainer.element.appendChild(buttonElement);

      const handleButtonDown = (e) => {
        e.preventDefault();
        controller.pressedButtonNum++;
        if (controller.pressedButtonNum >= 2) {
          return;
        }
        controller.changeStatus(e.target.textContent, !button.isPressed);
      };

      const handleButtonUp = (e) => {
        e.preventDefault();
        controller.pressedButtonNum--;
      };

      if (window.ontouchstart === null) {
        buttonElement.ontouchstart = handleButtonDown;
        buttonElement.ontouchend = handleButtonUp;
      } else {
        buttonElement.onpointerdown = handleButtonDown;
        buttonElement.onpointerup = handleButtonUp;
      }
    });

    controller.update();
  },

  changeStatus: (buttonText, isPressed) => {
    controller.buttons.forEach((button) => {
      if (button.name === buttonText) {
        button.isPressed = isPressed;
      } else {
        button.isPressed = !isPressed;
      }
    });
    controller.update();
  },

  update: () => {
    controller.buttons.forEach((button) => {
      if (button.isPressed) {
        button.element.style.borderBottom = "1px solid #b84c00";
        button.element.style.backgroundColor = "#b84c00";
      } else {
        button.element.style.borderBottom = "5px solid #b84c00";
        button.element.style.backgroundColor = "orange";
      }
    });
  },
};

const gameParameter = Object.freeze({
  remainingTime: 180,
});

const gameStatus = {
  isGameStart: false,
  isGameClear: false,
  isGameOver: false,
  startTime: 0,
  remainingTime: 0,
};

const cellSize = 30;
const cellRow = Math.trunc(screenContainer.width / cellSize);
const cellCol = Math.trunc(screenContainer.height / cellSize);
const mineCount = 15;

const init = () => {
  mainContainer.element = document.getElementById("main-container");
  mainContainer.element.style.position = "relative";
  mainContainer.element.style.width = mainContainer.width + "px";
  mainContainer.element.style.height = mainContainer.height + "px";
  mainContainer.element.style.margin = "5px";
  mainContainer.element.style.fontFamily =
    "'Helvetica Neue',Arial, 'Hiragino Kaku Gothic ProN','Hiragino Sans', Meiryo, sans-serif";
  mainContainer.element.style.backgroundColor = "#f5deb3";
  mainContainer.element.style.border = "2px solid #deb887";
  mainContainer.element.style.boxSizing = "border-box";
  mainContainer.element.style.borderRadius = "5px";
  mainContainer.element.style.display = "flex";
  mainContainer.element.style.alignItems = "center";
  mainContainer.element.style.justifyContent = "center";
  mainContainer.element.style.flexDirection = "column";
  mainContainer.element.style.overflow = "hidden";
  mainContainer.element.style.userSelect = "none";
  mainContainer.element.style.webkitUserSelect = "none";

  screenContainer.element = document.createElement("div");
  screenContainer.element.style.position = "relative";
  screenContainer.element.style.width = screenContainer.width + "px";
  screenContainer.element.style.height = screenContainer.height + "px";
  screenContainer.element.style.margin = "1px";
  screenContainer.element.style.display = "flex";
  screenContainer.element.style.alignItems = "center";
  screenContainer.element.style.justifyContent = "center";
  screenContainer.element.style.backgroundColor = "black";
  mainContainer.element.appendChild(screenContainer.element);

  timeMessageContainer.element = document.createElement("div");
  timeMessageContainer.element.style.position = "relative";
  timeMessageContainer.element.style.width = timeMessageContainer.width + "px";
  timeMessageContainer.element.style.height =
    timeMessageContainer.height + "px";
  timeMessageContainer.element.style.margin = "1px";
  timeMessageContainer.element.style.fontSize = "20px";
  timeMessageContainer.element.textContent =
    "⌛ " + gameParameter.remainingTime.toFixed(2);
  mainContainer.element.appendChild(timeMessageContainer.element);

  controllerContainer.element = document.createElement("div");
  controllerContainer.element.style.position = "relative";
  controllerContainer.element.style.width = controllerContainer.width + "px";
  controllerContainer.element.style.height = controllerContainer.height + "px";
  controllerContainer.element.style.margin = "0px";
  controllerContainer.element.style.fontSize = "32px";
  controllerContainer.element.style.boxSizing = "border-box";
  controllerContainer.element.style.display = "flex";
  controllerContainer.element.style.alignItems = "center";
  controllerContainer.element.style.justifyContent = "center";
  mainContainer.element.appendChild(controllerContainer.element);

  controller.init();
  cells.forEach((cell) => cell.init());
  [...Array(mineCount)].map(() =>
    cells[Math.trunc(Math.random() * cells.length)].setMine()
  );
};

const cells = Array.from({ length: cellRow * cellCol }).map((_, index) => ({
  element: null,
  x: 0,
  y: 0,
  isMine: false,
  isOpen: false,
  init() {
    this.x = index % cellRow;
    this.y = Math.trunc(index / cellRow);
    this.element = document.createElement("div");
    this.element.style.position = "absolute";
    this.element.style.width = cellSize + "px";
    this.element.style.height = cellSize + "px";
    this.element.style.left = this.x * cellSize + "px";
    this.element.style.top = this.y * cellSize + "px";
    this.element.style.border = "3px ridge #cb986f";
    this.element.style.backgroundColor = "#ccb28e";
    this.element.style.boxSizing = "border-box";
    this.element.style.fontSize = cellSize * 0.6 + "px";
    this.element.style.display = "flex";
    this.element.style.alignItems = "center";
    this.element.style.justifyContent = "center";
    screenContainer.element.appendChild(this.element);

    if (window.ontouchstart === null) {
      this.element.ontouchstart = this.handleButtonDown(this);
    } else {
      this.element.onpointerdown = this.handleButtonDown(this);
    }
  },

  setMine() {
    this.isMine = true;
  },

  getCell(x, y) {
    return cells[y * cellRow + x];
  },

  update() {
    cells
      .filter((cell) => cell.isOpen)
      .forEach((cell) => {
        cell.element.style.border = "1px solid #808080";
        cell.element.style.backgroundColor = "#d3d3d3";
      });
  },

  open() {
    if (gameStatus.isGameStart === false) {
      gameStatus.isGameStart = true;
    }

    let isFlagMode = false;
    if (
      controller.buttons.filter((button) => button.name === "🚩").shift()
        .isPressed
    ) {
      isFlagMode = true;
    }

    if (isFlagMode && this.isOpen === false) {
      this.element.textContent === ""
        ? (this.element.textContent = "🚩")
        : (this.element.textContent = "");
      return;
    }

    if (this.element.textContent === "🚩") {
      return;
    }

    if (this.isMine) {
      this.element.textContent = "💥";
      gameStatus.isGameOver = true;
      showGameOverMessage();
      return;
    }

    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    let openTargetCells = [this];

    while (openTargetCells.length) {
      const target = openTargetCells.pop();

      if (target.isOpen) {
        continue;
      }

      target.isOpen = true;
      let mineCount = 0;
      let nextCells = [];
      directions.forEach(([dx, dy]) => {
        if (
          target.x + dx < 0 ||
          target.x + dx >= cellRow ||
          target.y + dy < 0 ||
          target.y + dy >= cellCol
        ) {
          return;
        }

        nextCells.push(target.getCell(target.x + dx, target.y + dy));
        if (target.getCell(target.x + dx, target.y + dy).isMine) {
          mineCount++;
        }
      });

      if (mineCount === 0) {
        openTargetCells.push(...nextCells);
      }

      target.element.textContent = mineCount === 0 ? "" : mineCount;

      if (cells.every((cell) => cell.isOpen || cell.isMine)) {
        gameStatus.isGameClear = true;
        cells
          .filter((cell) => cell.isMine)
          .forEach((cell) => (cell.element.textContent = "💣"));
        showGameClearMessage();
      }
    }
  },

  handleButtonDown(selfObject) {
    return (e) => {
      e.preventDefault();
      if (gameStatus.isGameClear || gameStatus.isGameOver) {
        return;
      }
      selfObject.open();
      selfObject.update();
    };
  },
}));

const showGameClearMessage = () => {
  let messageElement = document.createElement("div");
  messageElement.style.position = "relative";
  messageElement.style.zIndex = "1";
  messageElement.style.width = screenContainer.width + "px";
  messageElement.style.height = screenContainer.height * 0.9 + "px";
  messageElement.style.display = "flex";
  messageElement.style.alignItems = "center";
  messageElement.style.justifyContent = "center";
  messageElement.style.color = "blue";
  messageElement.style.fontSize = "32px";
  messageElement.textContent = "Game Clear !!";
  screenContainer.element.appendChild(messageElement);
};

const showGameOverMessage = () => {
  let messageElement = document.createElement("div");
  messageElement.style.position = "relative";
  messageElement.style.zIndex = "1";
  messageElement.style.width = screenContainer.width + "px";
  messageElement.style.height = screenContainer.height * 0.9 + "px";
  messageElement.style.display = "flex";
  messageElement.style.alignItems = "center";
  messageElement.style.justifyContent = "center";
  messageElement.style.color = "red";
  messageElement.style.fontSize = "32px";
  messageElement.textContent = "Game Over";
  screenContainer.element.appendChild(messageElement);
};

const tick = () => {
  if (gameStatus.isGameClear || gameStatus.isGameOver) {
    return;
  }

  if (gameStatus.isGameStart) {
    if (gameStatus.startTime === 0) {
      gameStatus.startTime = performance.now();
    }

    gameStatus.remainingTime = Math.max(
      0,
      gameParameter.remainingTime -
        (performance.now() - gameStatus.startTime) / 1000
    );

    timeMessageContainer.element.textContent =
      "⌛ " + gameStatus.remainingTime.toFixed(2);

    if (gameStatus.remainingTime <= 0) {
      gameStatus.isGameOver = true;
      cells
        .filter((cell) => cell.isMine)
        .forEach((cell) => (cell.element.textContent = "💣"));
      showGameOverMessage();
    }
  }

  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
  tick();
};
