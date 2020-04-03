"use strict";

export default class {
  constructor(config) {
    this.state = config.state;
    this.observer = {};
    this.define(config.elements);

    Object.entries(config.watch).forEach(([path, fn]) => {
      this.observe(path, fn);
    });
  }

  get(path, node) {
    const value = path
      .split(".")
      .reduce((obj, key) => obj[key] || "", this.state);

    if (typeof value === "function") {
      return value({
        ...this,
        observe: this.observe.bind({ ...this, node })
      });
    } else {
      return value;
    }
  }

  set(path, value, _keys = null, _obj = this.state) {
    if (!_keys) {
      this.set(path, value, path.split("."), _obj);
    } else if (_keys.length > 1) {
      this.set(path, value, _keys.slice(1), _obj[_keys[0]]);
    } else {
      _obj[_keys[0]] = value;

      this.observer[path].forEach(fn => {
        typeof fn.render === "function" ? fn.render() : fn(this);
      });
    }
  }

  observe(path, fn) {
    if (!this.observer[path]) {
      this.observer[path] = [];
    }

    if (fn && !this.observer[path].includes(fn)) {
      this.observer[path].push(fn);
    } else if (this.node && !this.observer[path].includes(this.node)) {
      this.observer[path].push(this.node);
    }
  }

  define(tags) {
    const reflex = this;

    tags.forEach(tag => {
      customElements.define(
        `reflex-${tag}`,
        class extends document.createElement(tag).constructor {
          constructor() {
            super();
          }

          connectedCallback() {
            if (this.hasAttribute(":for")) {
              const [item, source] = this.getAttribute(":for").split(" in ");
              this.removeAttribute(":for");
              this.setAttribute("_for", `${item} in ${source}`);
              this.orginalNode = this.cloneNode(true);
              this.setAttribute(":for", `${item} in ${source}`);
              this.removeAttribute("_for");
            }

            this.render();
          }

          render() {
            Array.from(this.attributes)
              .filter(({ name }) => name.startsWith(":"))
              .forEach(({ name, value: path }) => {
                const forParents = this._getParents("[\\:for], [_for]", this);

                if (this.hasAttribute(":for") || this.hasAttribute("_for")) {
                  forParents.unshift(this);
                }

                forParents.forEach(parent => {
                  const index = parent._index || 0;
                  const [item, source] = parent.hasAttribute(":for")
                    ? parent.getAttribute(":for").split(" in ")
                    : parent.getAttribute("_for").split(" in ");

                  path = path.replace(
                    new RegExp(`(^|\\.| in )${item}(\\.|$)`),
                    `$1${source}.${index}$2`
                  );
                });

                if (name === ":value") {
                  this.path = path;
                }

                if (name === ":for" || name === "_for") {
                  const source = path.split(" in ")[1];
                  const lastIndex = reflex.get(source).length - 1;

                  reflex.observe.bind({ ...reflex, node: this })(source);
                  this._renderChilds(this);

                  // Remove items
                  while (this.nextSibling._index > 0) {
                    this.nextSibling.remove();
                  }

                  // Create for items
                  if (lastIndex >= 0 && this.orginalNode) {
                    this.hidden = false;

                    for (let index = lastIndex; index > 0; index--) {
                      const node = this.orginalNode.cloneNode(true);
                      node._index = index;
                      reflex.observe.bind({ ...reflex, node: node })(source);
                      this.after(node);
                      this._renderChilds(node);
                    }
                  } else {
                    this.hidden = true;
                  }
                } else if (name.startsWith(":")) {
                  reflex.observe.bind({ ...reflex, node: this })(path);

                  const pascal = name
                    .slice(1)
                    .replace(/(^|-)(html|dom|uri)/, ($0, $1, $2) =>
                      `${$2}`.toUpperCase()
                    )
                    .replace(/-(.)/g, ($0, $1) => $1.toUpperCase());

                  if (typeof this[pascal] !== undefined) {
                    this[pascal] = reflex.get(path, this);
                  } else {
                    this.setAttribute(name.slice(1), reflex.get(path, this));
                  }
                }
              });
          }

          _getParents(selector, el, _parents = []) {
            const closestEl = el.parentNode && el.parentNode.closest(selector);
            if (closestEl) {
              _parents.push(closestEl);
              return this._getParents(selector, closestEl, _parents);
            } else {
              return _parents;
            }
          }

          _renderChilds(node) {
            node
              .querySelectorAll("[is^='reflex-'")
              .forEach(childNode => childNode.render && childNode.render());
          }
        },
        { extends: tag }
      );
    });
  }
}