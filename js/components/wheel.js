import {createHtmlElement, createSvgElement} from "../helpers";

const createWheelSlice = (part) => {
  const startAngle = (360 * part.offset) % 360;
  const endAngle = startAngle + 360 * part.weight;

  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;

  const x1 = centerPointX + Math.sin(startAngleRad) * radius;
  const y1 = centerPointY - Math.cos(startAngleRad) * radius;
  const x2 = centerPointX + Math.sin(endAngleRad) * radius;
  const y2 = centerPointY - Math.cos(endAngleRad) * radius;

  const path = createSvgElement("path");
  path.setAttribute("d", `M${centerPointX} ${centerPointY} L${x1},${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} Z`);
  path.setAttribute("fill", part.color);

  return path;
}


const data = [
  { label: "free shipping", color: "lightyellow", weight: 0.1 },
  { label: "free shipping free shipping", color: "#DFD7B0", weight: 0.2 },
  { label: "10% off any item 11", color: "#FBCFA8", weight: 0.2 },
  { label: "free free free free free free free free free free free free free free free free free free free", color: "#EFA754", weight: 0.2 },
  { label: "free shipping 📦", color: "#B6BCB0", weight: 0.3 }
];

const TIME_DURATION = 4; // Duration of the spin in seconds
const FRAMES_PER_SECOND = 60;

const svg = createSvgElement("svg");
svg.setAttribute("viewBox", "0 0 400 400");

const totalAngle = 360;
let startAngle = 0;
let endAngle = 0;

const centerPointX = 200;
const centerPointY = 200;
const radius = 200;

for (let i = 0; i < data.length; i++) {
  const part = data[i];

  startAngle = endAngle;
  endAngle = startAngle + part.weight * totalAngle;

  const startAngleRad = (startAngle * Math.PI) / 180;
  const endAngleRad = (endAngle * Math.PI) / 180;


  const x1 = centerPointX + Math.sin(startAngleRad) * radius;
  const y1 = centerPointY - Math.cos(startAngleRad) * radius;
  const x2 = centerPointX + Math.sin(endAngleRad) * radius;
  const y2 = centerPointY - Math.cos(endAngleRad) * radius;

  const path = createSvgElement("path");
  path.setAttribute("d", `M${centerPointX} ${centerPointY} L${x1},${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} Z`);
  path.setAttribute("fill", part.color);

  const midpointAngle = (startAngle + endAngle) / 2;
  const midpointAngleRad = (midpointAngle * Math.PI) / 180;

  const labelFontSize = 20;

  // const labelRadius = radius;

  // const labelX = centerPointX + Math.sin(midpointAngleRad) * labelRadius;
  // const labelY = centerPointY - Math.cos(midpointAngleRad) * labelRadius;

  const foCenterX = centerPointX + Math.sin(midpointAngleRad) * (radius / 2);
  const foCenterY = centerPointY - Math.cos(midpointAngleRad) * (radius / 2);
  const foWidth = radius;
  let foHeight = (part.weight * totalAngle * radius * Math.PI) / 360;
  if (foHeight < 0.0001) {
    foHeight = y2 / 2;
  }

  const foreignObject = createSvgElement("foreignObject");
  foreignObject.setAttribute("x", `${foCenterX - foWidth / 2}`);
  foreignObject.setAttribute("y", `${foCenterY - foHeight / 2}`);
  foreignObject.setAttribute("width", `${foWidth}`);
  foreignObject.setAttribute("height", `${foHeight}`);
  foreignObject.setAttribute("transform", `rotate(${midpointAngle + 90}, ${foCenterX}, ${foCenterY})`);

  const div = createHtmlElement("div");
  div.style.width = "80%";
  div.style.height = "80%";
  div.style.margin = "8px";
  div.style.fontSize = `${labelFontSize}px`;
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.innerHTML = part.label;

  foreignObject.appendChild(div);

  // const text = createSvgElement("text");
  // text.setAttribute("x", `${labelX}`);
  // text.setAttribute("y", `${labelY}`);
  // text.setAttribute("font-size", `${labelFontSize}`);
  // text.setAttribute("dominant-baseline", "central");
  // text.setAttribute("transform", `rotate(${midpointAngle + 90}, ${labelX}, ${labelY})`);
  // text.innerHTML = part.label;

  svg.appendChild(path);
  svg.appendChild(foreignObject);
}

const wheelBox = document.getElementById("wheel");
// wheelBox.appendChild(svg);

const spinButton = document.getElementById("button");
// let intervalId = null;
// const maxSpinSpeed = 500; // Adjust as needed
// const accelerationRate = 10; // Adjust as needed
// const spinAcceleration = 0.2;
// const minSpinSpeed = 1;
// let spinSpeed = 20;
// let spinning = false;
//
// spinButton.addEventListener("click", startSpinning);
//
// function spin(timestamp, currentRotation) {
//   spinning = true;
//
//   currentRotation += spinSpeed;
//   svg.style.transform = `rotate(${currentRotation}deg)`;
//
//   spinSpeed -= spinAcceleration;
//   spinSpeed = Math.max(spinSpeed, minSpinSpeed);
//
//   if (spinSpeed >= minSpinSpeed) {
//     requestAnimationFrame(spin);
//   } else {
//     const normalizedIndex = (randomIndex + numOptions) % numOptions;
//     console.log(data[normalizedIndex]);
//     spinning = false; // Set spinning to false when the spin ends
//     resetButton();
//   }
//
// function startSpinning() {
//   if (spinning) {
//     return; // Prevent multiple concurrent spins
//   }
//
//   const numOptions = data.length;
//   const randomIndex = getRandomIndex(numOptions);
//   const landedRotation = -(randomIndex * (360 / numOptions) + 3600);
//   const svg = document.getElementById("svg");
//
//   spinButton.removeEventListener("click", startSpinning);
//   spinButton.addEventListener("mousedown", startCharging);
//   spinButton.addEventListener("mouseup", releaseWheel);
//   spinButton.addEventListener("mouseleave", releaseWheel);
//
//   let currentRotation = landedRotation;
//
//
//
//
//   requestAnimationFrame(spin);
// }
//
// function startCharging() {
//   intervalId = setInterval(chargeSpeed, 100);
// }
//
// function chargeSpeed() {
//   if (spinSpeed < maxSpinSpeed) {
//     spinSpeed += accelerationRate;
//   }
// }
//
// function releaseWheel() {
//   if (intervalId) {
//     clearInterval(intervalId);
//     if (spinning) { // Check if spinning is true before calling spin() again
//       spin();
//     }
//   }
// }
//
// function resetButton() {
//   spinButton.removeEventListener("mousedown", startCharging);
//   spinButton.removeEventListener("mouseup", releaseWheel);
//   spinButton.removeEventListener("mouseleave", releaseWheel);
//   spinButton.addEventListener("click", startSpinning);
// }
//
// function getRandomIndex(max) {
//   return Math.floor(Math.random() * max);
// }
