# REFLEX

Reflex adds reactivity to build-in HTML elements. It works like [Vue](https://vuejs.org) and [React](https://reactjs.org/), but the Reflex filesize is only **1 kilobyte** (min+gzip). Reflex is based on web components – more precisely customized built-in elements.

**DEMO: https://codepen.io/raneio/pen/GRJXowj**

---

## Get started

```javascript
import Reflex from "./Reflex.js";

window.reflex = new Reflex({
  elements: ["h3", "div", "img", "input"],
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
```

## text / html

```html
<h3 is="reflex-h3" text="title"></h3>
<div is="reflex-div" html="subtitle"></div>
```

> ### Awesome monkeys!
>
> Everyone **loves** monkeys.

## :attribute

```html
<img is="reflex-img" :src="animals.0.photo" :alt="animals.0.name" />
```

> ![Monk](./docs/monk-1.jpg)

## for

```html
<div is="reflex-div" for="animal in animals">
  <img is="reflex-img" :src="animal.photo" :alt="animal.name" />
</div>
```

> ![Monk](./docs/monk-1.jpg) ![Twins](./docs/monk-2.jpg) ![Jon Snow](./docs/monk-3.jpg)

## set()

```javascript
reflex.set("title", "Monkeys are awesome!");
```

```html
<input
  is="reflex-input"
  :value="title"
  oninput="reflex.set(this.path.value, this.value)"
/>
```

## get()

```javascript
const title = reflex.get("title");
```

## observe()

```javascript
reflex.observe(
  "title",
  (newValue, oldValue) => {
    reflex.set("titleUpperCase", newValue.toUpperCase());
  },
  { immediate: true }
);
```

```html
<div is="reflex-div" text="title"></div>
<div is="reflex-div" text="titleUpperCase"></div>
```

> Monkeys are awesome!  
> MONKEYS ARE AWESOME!

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright 2020, Rane Ahonen, [Rane.io](https://rane.io)
