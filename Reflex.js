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
    return path.split(".").reduce((obj, key) => {
      if (!obj) {
        return "";
      } else if (typeof obj[key] === "function") {
        return obj[key]({
          ...this,
          observe: this.observe.bind({ ...this, node }),
        });
      } else {
        return obj[key];
      }
    }, this.state);
  }

  set(path, value, _keys = null, _obj = this.state) {
    if (!_keys) {
      this.set(path, value, path.split("."), _obj);
    } else if (_keys.length > 1) {
      this.set(path, value, _keys.slice(1), _obj[_keys[0]]);
    } else {
      _obj[_keys[0]] = value;
      this.runObserver(path);
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

  runObserver(path) {
    if (this.observer[path]) {
      this.observer[path].forEach((fn) => {
        typeof fn.render === "function" ? fn.render() : fn(this);
      });
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
          }

          connectedCallback() {
            if (this.hasAttribute("for")) {
              const [item, source] = this.getAttribute("for").split(" in ");
              this.removeAttribute("for");
              this.setAttribute("_for", `${item} in ${source}`);
              this.orginalNode = this.cloneNode(true);
              this.setAttribute("for", `${item} in ${source}`);
              this.removeAttribute("_for");
            }

            this.render();
          }

          render() {
            Array.from(this.attributes)
              .filter(
                ({ name }) =>
                  name.startsWith(":") ||
                  name === "for" ||
                  name === "text" ||
                  name === "html"
              )
              .forEach(({ name, value: attrValue }) => {
                const path = this._getPath(name, attrValue);
                const value = reflex.get(path, this);

                if (name === "for" || name === "_for") {
                  this._renderChilds(this);

                  while (this.nextSibling._index > 0) {
                    this.nextSibling.remove()
                  };

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
                } else if (name === ":value" && this.value !== value) {
                  this.value = value;
                } else if (name.startsWith(":")) {
                  this.setAttribute(name.slice(1), value);
                }

                if (name === ":value" || name === "text" || name === "html") {
                  this.path = path;
                }

                reflex.observe.bind({ ...reflex, node: this })(path);
              });
          }

          _getPath(name, attrValue) {
            let path =
              name === "for" || name === "_for"
                ? attrValue.split(" in ")[1]
                : attrValue;

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

            return path;
          }

          _renderChilds(node) {
            node
              .querySelectorAll("[is^='reflex-'")
              .forEach((childNode) => childNode.render && childNode.render());
          }
        },
        { extends: tag }
      );
    });
  }
}
