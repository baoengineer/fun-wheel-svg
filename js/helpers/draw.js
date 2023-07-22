const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

export const createSvgElement= (tagName) => {
  return document.createElementNS(SVG_NAMESPACE, tagName);
}

export const createHtmlElement= (tagName) => {
  return document.createElement(tagName);
}
