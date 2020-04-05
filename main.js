"use strict";

import Reflex from "./Reflex.js";

window.reflex = new Reflex({
  elements: ["h1", "div", "img", "input"],
  state: {
    title: "Awesome monkeys!",
    titleUpperCase: "",
    subtitle: "Everyone <strong>loves</strong> monkeys.",
    animals: [
      {
        name: "Monk",
        photo: "./docs/monk-1.jpg",
      },
      {
        name: "Twins",
        photo: "./docs/monk-2.jpg",
      },
      {
        name: "Jon Snow",
        photo: "./docs/monk-3.jpg",
      },
    ],
  },
});

reflex.set("title", "Monkeys are awesome!");

reflex.observe(
  "title",
  (newValue, oldValue) => {
    reflex.set("titleUpperCase", newValue.toUpperCase());
  },
  { immediate: true }
);
