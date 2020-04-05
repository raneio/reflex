"use strict";

import Reflex from "./Reflex.js";
import state from "./state.js";

// const storage = JSON.parse(localStorage.getItem("reflex"));
// if (storage) {
//   state.name = storage.name;
// }

window.reflex = new Reflex({
  elements: [
    "div",
    "span",
    "img",
    "article",
    "h1",
    "h2",
    "main",
    "button",
    "input",
    "a",
  ],
  state: {
    title: "Api test",
    titleUpper: null,
    photo: "https://picsum.photos/id/237/200/300",
    posts: [],
    fivePosts: [],
    true: true,
    false: false,
  },
});

reflex.observe("posts", () => {
  reflex.set("fivePosts", reflex.state.posts.slice(0, 5));
});

// reflex.observe(
//   "photo",
//   (newValue) => reflex.set("titleUpper", newValue.toUpperCase()),
//   { immediate: true }
// )

reflex.observe(
  "title",
  (newValue) => reflex.set("titleUpper", newValue.toUpperCase()),
  { immediate: true }
)

// ["title", "photo"].forEach((path) =>
  
// );

// Fetch blog posts
fetch("https://www.wpkube.com/wp-json/wp/v2/posts")
  .then((raw) => raw.json())
  .then((response) => {
    reflex.set("posts", response);
  });

// window.set = (path, value) => {
//   console.log(path, value);
//   reflex.set(path, value);
//   localStorage.setItem("reflex", JSON.stringify(reflex.state));
// };
