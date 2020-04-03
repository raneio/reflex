"use strict";

import Reflex from "./Reflex.js";
import state from "./state.js";

const storage = JSON.parse(localStorage.getItem("reflex"));
if (storage) {
  state.name = storage.name;
}

window.reflex = new Reflex({
  elements: [
    "div",
    "span",
    "img",
    "li",
    "section",
    "input",
    "textarea",
    "select",
    "h4"
  ],
  state,
  watch: {
    name() {
      console.log("name has changed!");
    }
  }
});

window.set = (path, value) => {
  reflex.set(path, value);
  localStorage.setItem("reflex", JSON.stringify(reflex.state));
};
