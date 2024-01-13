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

const controllerContainer = {
  element: null,
  width: mainContainer.width * 0.9,
  height: mainContainer.height * 0.15,
  pressedButtonNum: 0,
  buttonList: ["🔨", "🚩"],
  status: {
    leftButtonPressed: false,
    rightButtonPressed: false,
  },
  changeStatus: (buttonText, isPressed) => {
    switch (buttonText) {
      case "◀":
        controllerContainer.status.leftButtonPressed = isPressed;
        break;
      case "▶":
        controllerContainer.status.rightButtonPressed = isPressed;
        break;
      default:
        // empty
        break;
    }
  },
  resetStatus: () => {
    controllerContainer.status.leftButtonPressed = false;
    controllerContainer.status.rightButtonPressed = false;
  },
};

const cellSize = 30;
const cellRow = Math.trunc(screenContainer.width / cellSize);
const cellCol = Math.trunc(screenContainer.height / cellSize);
const mineCount = 10;

const cells = Array.from({ length: cellRow * cellCol }).map((_, index) => ({
  element: null,
  x: 0,
  y: 0,
  isMine: false,
  isActve: true,
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
    this.element.style.fontSize = cellSize * 0.7 + "px";
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

  open() {
    if (this.isMine) {
      this.element.textContent = "💥";
      gameStatus.isGameOver = true;
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

    console.log("open");
    let openTarget = [];
    openTarget.push(this);

    while (openTarget.length) {
      const target = openTarget.pop();
      let mineCount = 0;
      directions.forEach(([dx, dy]) => {
        if (target.x + dx < 0 || target.x + dx >= cellRow) {
          return;
        }
        if (target.y + dy < 0 || target.y + dy >= cellCol) {
          return;
        }

        if (target.getCell(this.x + dx, this.y + dy).isMine) {
          mineCount++;
        } else {
          openTarget.push(this.getCell(this.x + dx, this.y + dy));
        }
      });

      console.log(openTarget);
      target.element.textContent = mineCount === 0 ? "" : mineCount;
    }
  },

  handleButtonDown(selfObject) {
    return (e) => {
      e.preventDefault();
      e.target.style.border = "1px solid #808080";
      e.target.style.backgroundColor = "#d3d3d3";
      selfObject.open();
    };
  },
}));

const gameStatus = {
  isGameOver: false,
};

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

  initController();
  cells.forEach((cell) => cell.init());
  [...Array(mineCount)].map(() =>
    cells[Math.trunc(Math.random() * cells.length)].setMine()
  );
};

const initController = () => {
  controllerContainer.buttonList.forEach((name) => {
    let buttonElement = document.createElement("div");
    buttonElement.style.position = "relative";
    buttonElement.style.width = controllerContainer.width * 0.35 + "px";
    buttonElement.style.height = controllerContainer.height * 0.5 + "px";
    buttonElement.style.margin = "15px";
    buttonElement.style.fontSize = controllerContainer.width * 0.1 + "px";
    buttonElement.style.backgroundColor = "orange";
    buttonElement.style.borderBottom = "5px solid #b84c00";
    buttonElement.style.borderRadius = "7px";
    buttonElement.style.boxSizing = "border-box";
    buttonElement.style.cursor = "pointer";
    buttonElement.style.display = "flex";
    buttonElement.style.alignItems = "center";
    buttonElement.style.justifyContent = "center";
    buttonElement.textContent = name;
    controllerContainer.element.appendChild(buttonElement);

    const handleButtonDown = (e) => {
      e.preventDefault();
      controllerContainer.pressedButtonNum++;
      if (controllerContainer.pressedButtonNum >= 2) {
        return;
      }
      e.target.style.borderBottom = "1px solid #b84c00";
      e.target.style.backgroundColor = "#b84c00";
      controllerContainer.changeStatus(e.target.textContent, true);
    };

    const handleButtonUp = (e) => {
      e.preventDefault();
      controllerContainer.pressedButtonNum--;
      e.target.style.borderBottom = "5px solid #b84c00";
      e.target.style.backgroundColor = "orange";
      controllerContainer.changeStatus(e.target.textContent, false);
    };

    if (window.ontouchstart === null) {
      buttonElement.ontouchstart = handleButtonDown;
      buttonElement.ontouchend = handleButtonUp;
    } else {
      buttonElement.onpointerdown = handleButtonDown;
      buttonElement.onpointerup = handleButtonUp;
    }
  });

  document.onkeydown = (e) => {
    e.preventDefault();
    switch (e.key) {
      case "ArrowLeft":
        controllerContainer.changeStatus("◀", true);
        break;
      case "ArrowRight":
        controllerContainer.changeStatus("▶", true);
        break;
      default:
        // empty
        break;
    }
  };
  document.onkeyup = (e) => {
    controllerContainer.resetStatus();
    e.preventDefault();
  };
};

const showGameClearMessage = () => {
  let messageElement = document.createElement("div");
  messageElement.style.position = "relative";
  messageElement.style.zIndex = "1";
  messageElement.style.width = screenContainer.width + "px";
  messageElement.style.height = screenContainer.height * 0.9 + "px";
  messageElement.style.display = "flex";
  messageElement.style.alignItems = "center";
  messageElement.style.justifyContent = "center";
  messageElement.style.color = "yellow";
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
  if (gameStatus.isGameOver) {
    showGameOverMessage();
    return;
  }

  requestAnimationFrame(tick);
};

window.onload = () => {
  init();
  tick();
};
