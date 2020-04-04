"use strict";

export default {
  name: "Jack",
  nameUpper({ observe, state }) {
    observe("name");
    return state.name.toUpperCase() + " " + state.email;
  },
  email: "jack@example.com",
  image: "https://source.unsplash.com/random/200x100/",
  hide: false,
  todos: [
    {
      title: "Buy milk",
      status: "done",
      persons: [
        {
          name: "albert",
        },
        {
          name: "bella",
        },
      ],
    },
    {
      title: "Wash car",
      status: "not started",
      persons: [
        {
          name: "mike",
          skills: ["red", "nice", "wool"],
        },
        {
          name: "jack",
          skills: ["Great"],
        },
        {
          name: "wolf",
          skills: [],
        },
        {
          name: "emma",
          skills: ["handsom"],
        },
      ],
    },
    {
      title: "Eat pizza",
      status: "not started",
      persons: [
        {
          name: "Yami",
          skills: ["fast", "awesome"],
        },
        {
          name: "Max",
          skills: ["slow", "awesome"],
        },
      ],
    },
  ],
};
