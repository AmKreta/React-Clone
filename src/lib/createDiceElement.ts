import { DICE_ELEMENT } from "./types/types";
import { normalizeArray } from "./util";

// converts the jsx parsed JSX into
// DICE_ELEMENT form
const createElement: (
  type: string,
  props: object,
  ...children: DICE_ELEMENT[]
) => DICE_ELEMENT = (type, props, ...children) => {
  console.log({type, props, children})
  children=normalizeArray(children);
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        ["string", "number"].includes(typeof child) ? createTextElement(child as any) : child
      ),
    },
  };
};

const createTextElement: (str: string) => DICE_ELEMENT = (str) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: str,
      children: [],
    },
  };
};

export default createElement;
