import createElement from "./lib/createDiceElement";
import DiceDom from "./lib/diceDom.class.ts";

/** @jsx  createElement*/
const el = (
  <div>
    {[1, 2, 3, 4].map((item) => (
      <p onClick={(e) => alert(e.currentTarget.innerHTML)}>
        this is paragraph {item}
      </p>
    ))}
  </div>
);

const diceDom = new DiceDom();
diceDom.render(el, document.getElementById("app-root"));
