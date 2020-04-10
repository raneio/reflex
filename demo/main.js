"use strict";

import Reflex from "../Reflex.js";

window.reflex = new Reflex({
  state: {
    title: "Reflex Demo",
    titleUpperCase: "",
    showTitleEdit: false,
    newTask: "",
    tasks: ["Buy bananas", "Hanging on a tree", "Eat a banana"]
  }
});

reflex.observe(
  "title",
  (newValue, oldValue) => {
    reflex.set("titleUpperCase", newValue.toUpperCase());
  },
  { immediate: true }
);

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
