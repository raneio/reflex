"use strict";

import Reflex from "../Reflex.js";

window.reflex = new Reflex({
  elements: ["div", "input", "button"],
  state: {
    title: "Reflex Demo",
    titleUpperCase: null,
    showTitleEdit: false,
    newTask: "",
    disableAddButton: null,
    tasks: ["Buy bananas", "Hanging on a tree", "Eat a banana"],
  },
});

reflex.observe({
  path: "title",
  handler: (newValue, oldValue) => {
    reflex.set("titleUpperCase", newValue.toUpperCase());
  },
  immediate: true,
});

reflex.observe({
  path: "newTask",
  handler: (newValue, oldValue) => {
    reflex.set("disableAddButton", !newValue);
  },
  immediate: true,
});

window.addTask = (even) => {
  event.preventDefault();
  const tasks = [reflex.state.newTask, ...reflex.state.tasks];
  reflex.set("tasks", tasks);
  reflex.set("newTask", "");
};

window.removeTask = (index) => {
  const tasks = reflex.state.tasks.filter(
    (task, idx) => idx !== parseInt(index)
  );
  reflex.set("tasks", tasks);
};
