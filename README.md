# REFLEX

Reflex adds reactivity to build-in HTML elements. It works like [Vue](https://vuejs.org) and [React](https://reactjs.org/), but the Reflex filesize is only **3kb**. Reflex is based on web components – more precisely customized built-in elements.

**Why Reflex?**

- Light, fast and simple
- Minimalistic API
- Global state _(get and set data easily at the site wide)_
- No CLI
- No compiler
- No virtual DOM

**DEMO: https://codepen.io/raneio/full/bGVbrLw**

**NPM: https://www.npmjs.com/package/@raneio/reflex**

---

## Get started

```javascript
import 'https://cdn.skypack.dev/@ungap/custom-elements-builtin?min' // Polyfill for Safari
import Reflex from "https://cdn.skypack.dev/@raneio/reflex?min";

// You can also install Reflex and polyfill locally
// npm install @raneio/reflex @ungap/custom-elements-builtin

window.reflex = new Reflex({
  elements: ["h3", "div", "img", "input"],
  state: {
    title: "Awesome monkeys!",
    titleUpperCase: "",
    subtitle: "Everyone <strong>loves</strong> monkeys.",
    showExample: true,
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
```

## text / html

```html
<h3 is="x-h3" text="title"></h3>
<div is="x-div" html="subtitle"></div>
```

> ### Awesome monkeys!
>
> Everyone **loves** monkeys.

## :attribute

```html
<img is="x-img" :src="animals.0.photo" :alt="animals.0.name" />
```

> ![Monk](https://source.unsplash.com/Z05GiksmqYU/150x150)

## for

```html
<div is="x-div" for="animal in animals">
  <img
    is="x-img"
    :src="animal.photo"
    :alt="animal.name"
    :data-index="#animal"
  /> 
</div>
```

> ![Monk](https://source.unsplash.com/Z05GiksmqYU/150x150) ![Twins](https://source.unsplash.com/aXqlZFeVFrU/150x150) ![Jon Snow](https://source.unsplash.com/iJ7cD_VocxE/150x150)

## show

```html
<div is="x-div" show="showExample"></div>
```

## set()

```javascript
reflex.set("title", "Monkeys are awesome!");
```

```html
<input
  is="x-input"
  :value="title"
  oninput="reflex.set(this.path.value, this.value)"
/>
```

## get()

```javascript
const title = reflex.get("title");
// or
const title = reflex.state.title;
```

## observe()

```javascript
reflex.observe({
  path: "title",
  handler: (newValue, oldValue) => {
    reflex.set("titleUpperCase", newValue.toUpperCase());
  },
  immediate: true,
});
```

```html
<div is="x-div" text="title"></div>
<div is="x-div" text="titleUpperCase"></div>
```

> Monkeys are awesome!  
> MONKEYS ARE AWESOME!

## Package update guide
https://docs.npmjs.com/updating-your-published-package-version-number

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright 2020, Rane Ahonen, [Rane.io](https://rane.io)
