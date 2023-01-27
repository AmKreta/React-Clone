import createElement from "./lib/createDiceElement";
import DiceDom from "./lib/diceDom.class.ts";

/** @jsx  createElement*/
function TestComponent(){
  return <div>
    this is another functional component
  </div>
}

/** @jsx  createElement*/
function App() {
  return (
    <div>
      {[1, 2, 3, 4].map((item) => (
        <p onClick={(e) => alert(e.currentTarget.innerHTML)}>
          this is paragraph {item}
        </p>
      ))}
      <TestComponent />
    </div>
  );
}

const diceDom = new DiceDom();
/** @jsx  createElement*/
diceDom.render(<App />, document.getElementById("app-root"));
console.log(diceDom)
