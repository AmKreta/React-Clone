import createDomNode from "./createDomNode";
import { FIBER, PROPS, DICE_ELEMENT } from "./types/types";

class Fiber implements FIBER {
  parent: FIBER | null;
  child: FIBER | null;
  sibling: FIBER | null;
  dom: HTMLElement | Text | null;
  props: PROPS;
  alternate: FIBER | null;
  effectTag: "UPDATE" | "PLACEMENT" | "DELETION" | null;
  type: string | Function;

  constructor(element: DICE_ELEMENT, oldFiber?: FIBER) {
    this.parent = null;
    this.child = null;
    this.sibling = null;
    this.dom =
      typeof element.type ==='function'
        ? null
        : oldFiber?.dom || createDomNode(element);
    this.props = element.props;
    this.alternate = oldFiber || null;
    this.effectTag = null;
    this.type = element.type;
  }
}

export default Fiber;
