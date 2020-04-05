# REFLEX

Reactive HTML like Vue and React, but just **1 kilobyte**. Reflex is based on web components – more precisely customized built-in elements.




## Get started

```javascript
import Reflex from "./Reflex.js";

window.reflex = new Reflex({
  elements: ["h3", "p", "div", "img"],
  state: {
    title: "Awesome monkeys!",
    subtitle: "Everyone <strong>loves</strong> monkeys.",
    animals: [{
      name: "Monk",
      photo: "./docs/monk-1.jpg"
    },{
      name: "Twins",
      photo: "./docs/monk-2.jpg"
    },{
      name: "Jon Snow",
      photo: "./docs/monk-3.jpg"
    }],
  }
});
```




## text / html

```html
<h3 is="reflex-h1" text="title"></h3>
<p is="reflex-p" html="subtitle"></p>
```

### Awesome monkeys!

Everyone **loves** monkeys.




## :attribute

```html
<img is="reflex-img" :src="animals.0.photo" :alt="animals.0.name">
```

![Monk](./docs/monk-1.jpg) 




## for

```html
<div is="reflex-div" for="animal in animals">
  <img is="reflex-img" :src="animal.photo" :alt="animal.name">
</div>
```

![Monk](./docs/monk-1.jpg) ![Twins](./docs/monk-2.jpg) ![Jon Snow](./docs/monk-3.jpg) 




## set()

```javascript
reflex.set("title", "Monkeys are awesome!")
```

```html
<input is="reflex-input" :value="title" oninput="reflex.set(this.path.value, this.value)">
```




## get()

```javascript
const title = reflex.get("title")
```




## observe()

```javascript
window.reflex = new Reflex({
  elements: ["p"],
  state: {
    title: "Awesome monkeys!",
    titleUpperCase: ""
  }
});

reflex.observe("title", (newValue, oldValue) => {
  console.log(`The title has been changed from ${oldValue} to ${newValue}.`);
  reflex.set("titleUppercase", newValue.toUpperCase())
}, {immediate: true});
```

```html
<p is="reflex-p" text="title"></p>
<p is="reflex-p" text="titleUpperCase"></p>
```

Awesome monkeys!
AWESOME MONKEYS!




## License

[MIT](http://opensource.org/licenses/MIT)

Copyright 2020, Rane Ahonen, [Rane.io](https://rane.io)
