import {
  createHtmlElement,
  createSvgElement,
} from "../helpers";
import sampleData from "./sampleData.json";

const viewBoxWidth = 400;
const viewBoxHeight = 400;

const centerPointX = viewBoxWidth / 2;
const centerPointY = viewBoxHeight / 2;
const radius = 200;

const createWheelSlice = (item, offset) => {
  const totalAngle = 360;
  const startAngle = (totalAngle * offset) % totalAngle;
  const endAngle = startAngle + totalAngle * item.weight;
  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  // trigonometry formulas
  // to find the x and y coordinates of the start and end points of the arc
  const x1 = centerPointX + Math.sin(startAngleRad) * radius;
  const y1 = centerPointY - Math.cos(startAngleRad) * radius;
  const x2 = centerPointX + Math.sin(endAngleRad) * radius;
  const y2 = centerPointY - Math.cos(endAngleRad) * radius;

  const path = createSvgElement("path");
  path.setAttribute(
    "d",
    `M${centerPointX} ${centerPointY} L${x1},${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} Z`,
  );
  path.setAttribute("fill", item.color);

  return {
    path,
    pathHeight: (item.weight * totalAngle * radius * Math.PI) / 360,
    angles: {
      startAngle,
      endAngle,
    },
  };
};

const createTextBox = (className, item, midpointAngle, pathHeight) => {
  const midpointAngleRad = (midpointAngle * Math.PI) / 180;
  const textBoxX = centerPointX + Math.sin(midpointAngleRad) * (radius / 2);
  const textBoxY = centerPointY - Math.cos(midpointAngleRad) * (radius / 2);

  const textBoxWidth = radius;
  const textBoxHeight = pathHeight;

  const textBox = createSvgElement("foreignObject");
  textBox.setAttribute("class", `${className}`);
  textBox.setAttribute("x", `${textBoxX - textBoxWidth / 2}`);
  textBox.setAttribute("y", `${textBoxY - textBoxHeight / 2}`);
  textBox.setAttribute("width", `${textBoxWidth}`);
  textBox.setAttribute("height", `${textBoxHeight}`);
  textBox.setAttribute(
    "transform",
    `rotate(${midpointAngle + 90}, ${textBoxX}, ${textBoxY})`,
  );

  const container = createHtmlElement("div");

  container.style.width = "80%";
  container.style.height = "80%";
  container.style.margin = "8px";
  container.style.fontSize = `20px`;
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";

  const editableEl = document.createElement("div");
  editableEl.setAttribute("contentEditable", "true");
  editableEl.innerHTML = item.content;
  editableEl.addEventListener("input", (e) => {
    item.content = e.target.innerHTML;
  });
  editableEl.style.width = "100%";

  container.appendChild(editableEl)
  textBox.appendChild(container);

  return textBox;
};

const createButton = ({
  className = "button",
  width = 100,
  height = 100,
  fill = "#fff",
  onClick = () => {},
} = {}) => {
  const buttonSize = width;
  const buttonX = centerPointX - width / 2;
  const buttonY = centerPointY - height / 2;

  const buttonContainer = createSvgElement("g");
  buttonContainer.setAttribute("class", `${className}`);

  // Create the circle background
  const circle = createSvgElement("circle");
  circle.setAttribute("cx", centerPointX);
  circle.setAttribute("cy", centerPointY);
  circle.setAttribute("r", buttonSize / 2);
  circle.setAttribute("fill", fill);
  buttonContainer.appendChild(circle);
  buttonContainer.addEventListener("click", onClick);

  // Create the arrow path from arrowAngle

  const arrowPath = createSvgElement("path");
  const arrowHeight = 30;
  const arrowWidth = 20;
  const arrowX = centerPointX;
  const arrowY = centerPointY - buttonSize / 2 - arrowHeight + 10;
  arrowPath.setAttribute(
    "d",
    `M${arrowX},${arrowY} L${arrowX - arrowWidth},${arrowY + arrowHeight} L${
      arrowX + arrowWidth
    },${arrowY + arrowHeight} Z`,
  );
  arrowPath.setAttribute("fill", fill);
  buttonContainer.appendChild(arrowPath);

  // Create the button HTML to handle click event
  const button = createHtmlElement("button");
  button.classList.add("button");
  button.innerHTML = "Spin the wheel";

  const buttonContainerForeignObject = createSvgElement("foreignObject");
  buttonContainerForeignObject.setAttribute("width", `${buttonSize}`);
  buttonContainerForeignObject.setAttribute("height", `${buttonSize}`);
  buttonContainerForeignObject.setAttribute("x", `${buttonX}`);
  buttonContainerForeignObject.setAttribute("y", `${buttonY}`);

  buttonContainerForeignObject.appendChild(button);
  buttonContainer.appendChild(buttonContainerForeignObject);

  return buttonContainer;
};

const createWheelSlices = (options = []) => {
  const sliceAngles = [];
  const slicePaths = [];
  let cumulativeWeight = 0;
  options.forEach((item) => {
    const offset = cumulativeWeight;
    cumulativeWeight += item.weight;
    const { path, pathHeight, angles } = createWheelSlice(item, offset);
    slicePaths.push(path);

    const textBox = createTextBox(
      "text-box",
      item,
      (angles.startAngle + angles.endAngle) / 2,
      pathHeight,
    );
    slicePaths.push(textBox);

    sliceAngles.push(angles);
  });
  return {
    angles: sliceAngles,
    paths: slicePaths,
  };
};

const createWheelSVG = ({
  options = [],
  onChange = () => {},
} = {}) => {
  const wheel = createSvgElement("svg");
  wheel.setAttribute("class", "wheel");
  wheel.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

  const slicesContainer = createSvgElement("g");
  slicesContainer.setAttribute("class", `slices`);

  const { angles, paths: slicePaths } = createWheelSlices(options);
  slicePaths.forEach((path) => {
    slicesContainer.appendChild(path);
  });
  wheel.appendChild(slicesContainer);


  let rotationAngle = 0;
  const spin = () => {
    const randomIndex = Math.floor(Math.random() * options.length);
    const randomAngle = (randomIndex / options.length) * 360;
    rotationAngle += 3600 + randomAngle; // Accumulate rotation angles

    let duration = 5000;
    let interval = 0;
    const startTime = performance.now();

    let timer = setInterval(() => {
      const elapsedTime = performance.now() - startTime;
      const progress = elapsedTime / duration; // Progress of the animation in the range [0, 1]

      const currentRotationAngle = rotationAngle * progress; // Current rotation angle based on progress

      const absoluteArrowAngle = (currentRotationAngle + 360) % 360;
      let selectedSlice = null;

      angles.forEach(({ startAngle, endAngle }, index) => {
        if (absoluteArrowAngle >= startAngle && absoluteArrowAngle < endAngle) {
          selectedSlice = options[index];
        }
      });

      onChange(selectedSlice);
      // Clear the interval if the animation is completed
      if (elapsedTime >= duration) {
        clearInterval(timer);
      }

    }, interval);

    slicesContainer.style.transform = `rotate(${-rotationAngle}deg)`;
    slicesContainer.style.transformOrigin = "center";
    slicesContainer.style.transition = `transform ${duration}ms ease-out`;
  };



  const button = createButton({
    onClick: spin,
  });

  wheel.appendChild(button);
  return wheel;
};

const init = () => {
  const handleOnChange = (value) => {
    const label = document.querySelector("#wheel-label");
    if(value.content) {
      label.innerHTML = value.content;
    }
  };

  const wheelSVG = createWheelSVG({
    className: "wheel",
    options: sampleData,
    onChange: handleOnChange,
  });

  const wheelContainer = createHtmlElement("div");
  wheelContainer.classList.add("wheel-box");
  wheelContainer.appendChild(wheelSVG);

  const selector = "#wheel";
  const container = document.querySelector(selector);
  container.appendChild(wheelContainer);
};

init();
