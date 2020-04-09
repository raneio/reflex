"use strict";

import Reflex from "../Reflex.js";

window.reflex = new Reflex({
  elements: ["span", "div", "input", "button"],
  state: {
    title: "Reflex Todo",
    titleUpperCase: "",
    showTitleEdit: false,
    newTask: "",
    tasks: ["Buy bananas", "Hang on the tree", "Eat banana"],
  },
});

reflex.observe(
  "title",
  (newValue, oldValue) => {
    reflex.set("titleUpperCase", newValue.toUpperCase());
  },
  { immediate: true }
);

window.addTask = () => {
  const tasks = [...reflex.state.tasks, reflex.state.newTask];
  reflex.set("tasks", tasks);
  reflex.set("newTask", "");
};

window.removeTask = (index) => {
  const tasks = reflex.state.tasks.filter(
    (task, idx) => idx !== parseInt(index)
  );
  reflex.set("tasks", tasks);
};
