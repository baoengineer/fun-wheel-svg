import { createHtmlElement, createSvgElement } from "../helpers";

const data = [
  { content: "free shipping", color: "lightyellow", weight: 0.1 },
  { content: "free shipping free shipping", color: "#DFD7B0", weight: 0.2 },
  { content: "10% off any item 11", color: "#FBCFA8", weight: 0.2 },
  {
    content:
      "free free free free free free free free free free free free free free free free free free free",
    color: "#EFA754",
    weight: 0.2,
  },
  { content: "free shipping 📦", color: "#B6BCB0", weight: 0.3 },
];

const viewBoxWidth = 400;
const viewBoxHeight = 400;

const totalAngle = 360;
const centerPointX = viewBoxWidth / 2;
const centerPointY = viewBoxHeight / 2;
const radius = 200;

const createWheelSlice = (item, offset) => {
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
    midpointAngle: (startAngle + endAngle) / 2,
  };
};

const createTextBox = (item, midpointAngle, pathHeight) => {
  const midpointAngleRad = (midpointAngle * Math.PI) / 180;
  const textBoxX = centerPointX + Math.sin(midpointAngleRad) * (radius / 2);
  const textBoxY = centerPointY - Math.cos(midpointAngleRad) * (radius / 2);

  const textBoxWidth = radius;
  const textBoxHeight = pathHeight;

  const textBox = createSvgElement("foreignObject");
  textBox.setAttribute("x", `${textBoxX - textBoxWidth / 2}`);
  textBox.setAttribute("y", `${textBoxY - textBoxHeight / 2}`);
  textBox.setAttribute("width", `${textBoxWidth}`);
  textBox.setAttribute("height", `${textBoxHeight}`);
  textBox.setAttribute(
    "transform",
    `rotate(${midpointAngle + 90}, ${textBoxX}, ${textBoxY})`,
  );

  const div = createHtmlElement("div");

  div.style.width = "80%";
  div.style.height = "80%";
  div.style.margin = "8px";
  div.style.fontSize = `20px`;
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.innerHTML = item.content;

  textBox.appendChild(div);

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

  // Create the arrow path
  const arrowPath = createSvgElement("path");
  const arrowHeight = 30;
  const arrowWidth = 20
  const arrowX = centerPointX;
  const arrowY = centerPointY - buttonSize / 2 - arrowHeight + 10; // Position the arrow on top of the button, +10 is to overlap arrow and cirlce
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

const createWheelSlices = ({ className = "wheel-slices" } = {}) => {
  const wheelContainer = createSvgElement("g");
  wheelContainer.setAttribute("class", `${className}`);

  let cumulativeWeight = 0;
  data.forEach((item) => {
    const offset = cumulativeWeight;
    cumulativeWeight += item.weight;
    const { path, pathHeight, midpointAngle } = createWheelSlice(item, offset);
    wheelContainer.appendChild(path);

    const textBox = createTextBox(item, midpointAngle, pathHeight);
    wheelContainer.appendChild(textBox);
  });
  return wheelContainer;
};

const createWheel = ({ className = "wheel" } = {}) => {
  const svg = createSvgElement("svg");
  svg.setAttribute("class", className);
  svg.setAttribute("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

  const handleSpin = () => {
    const randomAngle = Math.floor(Math.random() * 360);
    wheelContainer.style.transform = `rotate(${randomAngle}deg)`;
    wheelContainer.style.transformOrigin = "center";
  };

  const wheelContainer = createWheelSlices();
  const button = createButton({
    onClick: handleSpin,
  });

  svg.appendChild(wheelContainer);
  svg.appendChild(button);
  return svg;
};

const init = () => {
  const wheelSVG = createWheel();

  const wheelContainer = createHtmlElement("div");
  wheelContainer.classList.add("wheel-box");
  wheelContainer.appendChild(wheelSVG);

  const selector = ".wheel-section";
  const container = document.querySelector(selector);
  container.appendChild(wheelContainer);
};

init();
