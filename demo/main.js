"use strict";

import Reflex from "../Reflex.js";

window.reflex = new Reflex({
  elements: ["h1", "div", "img", "input"],
  state: {
    title: "Awesome monkeys!",
    titleUpperCase: "",
    subtitle: "Everyone <strong>loves</strong> monkeys.",
    show: 3,
    todos: ["foo", "bar"],
    animals: [
      {
        name: "Monk",
        photo: "https://source.unsplash.com/Z05GiksmqYU/150x150",
      },
      {
        name: "Twins",
        photo: "https://source.unsplash.com/aXqlZFeVFrU/150x150",
      },
      {
        name: "Jon Snow",
        photo: "https://source.unsplash.com/iJ7cD_VocxE/150x150",
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
