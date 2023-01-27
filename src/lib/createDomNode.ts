import { DICE_ELEMENT } from "./types/types";

const createDomNode: (element: DICE_ELEMENT) => HTMLElement | Text = (
  element
) => {
  if(typeof(element.type)==='function') return null;
  let el;
  if (element.type === "TEXT_ELEMENT") {
    el = document.createTextNode("");
    el.nodeValue = element.props["nodeValue"];
  } else {
    el = document.createElement(element.type);
    for (let propName in element.props) {
      if (propName === "children") continue;
      if (["string, number"].includes(typeof element.props[propName]))
        el.setAttribute(propName, element.props[propName]);
      if (
        propName.startsWith("on") &&
        element.props[propName] instanceof Function
      ) {
        let eventName = propName.slice(2).toLowerCase();
        el.addEventListener(eventName, element.props[propName]);
      }
    }
  }
  return el;
};

export default createDomNode;
