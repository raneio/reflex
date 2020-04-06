"use strict";

export  default class Reflex {
  constructor(config) {
    this.state = config.state;
    this.observer = {};
    this.define(config.elements);
  }

  get(path) {
    return path.split(".").reduce((obj, key) => {
      return obj ? obj[key] : "";
    }, this.state);
  }

  set(path, value, _keys = null, _obj = this.state) {
    if (!_keys) {
      _keys = path.split(".");
    }

    if (_keys.length > 1) {
      this.set(path, value, _keys.slice(1), _obj[_keys[0]]);
    } else if (value !== _obj[_keys[0]]) {
      const oldValue = _obj[_keys[0]];
      _obj[_keys[0]] = value;
      this.runObserver(path, value, oldValue);
    }
  }

  observe(path, fn, config = {}) {
    if (!this.observer[path]) {
      this.observer[path] = [];
    }

    this.observer[path].push(fn);

    if (config.immediate) {
      fn(this.get(path));
    }
  }

  runObserver(path, value, oldValue) {
    if (this.observer[path]) {
      this.observer[path].forEach((fn) => fn(value, oldValue));
    }
  }

  define(tags) {
    const reflex = this;

    tags.forEach((tag) => {
      customElements.define(
        `reflex-${tag}`,
        class extends document.createElement(tag).constructor {
          constructor() {
            super();
            this.reflex = reflex;
          }

          connectedCallback() {
            this.bindAttributes = Array.from(this.attributes).filter(
              ({ name }) =>
                name.startsWith(":") ||
                name === "for" ||
                name === "text" ||
                name === "html"
            );

            if (this.hasAttribute("for")) {
              const [item, source] = this.getAttribute("for").split(" in ");
              this.removeAttribute("for");
              this.setAttribute("_for", `${item} in ${source}`);
              this.orginalNode = this.cloneNode(true);
              this.setAttribute("for", `${item} in ${source}`);
              this.removeAttribute("_for");
            }

            this._setPaths();
            this.render();
          }

          render() {
            this.bindAttributes.forEach(({ name }) => {
              const path = this.path[name.replace(":", "")];
              const value = this.reflex.get(path, this);

              if (name === "for" || name === "_for") {
                this._renderChilds(this);

                while (this.nextSibling._index > 0) {
                  this.nextSibling.remove();
                }

                if (value.length > 0 && this.orginalNode) {
                  this.hidden = false;

                  for (let index = value.length - 1; index > 0; index--) {
                    const node = this.orginalNode.cloneNode(true);
                    node._index = index;
                    this.after(node);
                    this._renderChilds(node);
                  }
                } else {
                  this.hidden = true;
                }
              } else if (name === "text" && this.textContent !== value) {
                this.textContent = value;
              } else if (name === "html" && this.innerHTML !== value) {
                this.innerHTML = value;
              } else if (name.startsWith(":")) {
                this.setAttribute(name.slice(1), value);
              }

              if (name === ":value" && this.value !== value) {
                this.value = value;
              }
            });
          }

          _renderChilds(node) {
            node
              .querySelectorAll("[is^='reflex-'")
              .forEach((childNode) => childNode.render && childNode.render());
          }

          _setPaths() {
            this.path = {};
            this.bindAttributes.forEach(({ name, value }) => {
              let path =
                name === "for" || name === "_for"
                  ? value.split(" in ")[1]
                  : value;

              const getParents = (el, _parents = []) => {
                const closestEl =
                  el.parentNode && el.parentNode.closest("[for], [_for]");
                if (closestEl) {
                  _parents.push(closestEl);
                  return getParents(closestEl, _parents);
                } else {
                  return _parents;
                }
              };

              const parents = getParents(this);

              if (this.hasAttribute("for") || this.hasAttribute("_for")) {
                parents.unshift(this);
              }

              parents.forEach((parent) => {
                const index = parent._index || 0;
                const [item, source] = parent.hasAttribute("for")
                  ? parent.getAttribute("for").split(" in ")
                  : parent.getAttribute("_for").split(" in ");

                path = path.replace(
                  new RegExp(`(^|\\.)${item}(\\.)`),
                  `$1${source}.${index}$2`
                );
              });

              // Add to path
              this.path[name.replace(":", "")] = path;

              // Observe path
              this.reflex.observe(path, this.render.bind(this));
            });
          }
        },
        { extends: tag }
      );
    });
  }
}
