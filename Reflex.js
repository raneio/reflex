"use strict";

export default class Reflex {
  constructor(config) {
    this.prefix = config.prefix || 'reflex';
    this.state = config.state;
    this.observer = {};
    const tags =
      "a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr";
    this.define(config.tags || tags.split(","));
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
        `${reflex.prefix}-${tag}`,
        class extends document.createElement(tag).constructor {
          constructor() {
            super();
            this.reflex = reflex;

            const validName = `${reflex.prefix}-${this.nodeName.toLowerCase()}`;
            if (this.getAttribute("is") !== validName) {
              console.error(`Chance to is="${reflex.prefix}-${validName}"`, this);
            }
          }

          connectedCallback() {
            this.bindAttributes = Array.from(this.attributes).filter(
              ({ name }) =>
                name.startsWith(":") ||
                name === "for" ||
                name === "if" ||
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
            let show = true;

            this.bindAttributes.forEach(({ name }) => {
              const path = this.path[name.replace(":", "")];
              const value = path.startsWith("#")
                ? this.closest(
                    `[for^="${path.replace("#", "")} in "], ` +
                      `[_for^="${path.replace("#", "")} in "]`
                  )._index
                : this.reflex.get(path);

              if (name === "for" || name === "_for") {
                this._index = 0;
                this._renderChilds(this);

                while (this.nextSibling._index > 0) {
                  this.nextSibling.remove();
                }

                if (value.length > 0 && this.orginalNode) {
                  for (let index = value.length - 1; index > 0; index--) {
                    const node = this.orginalNode.cloneNode(true);
                    node._index = index;
                    this.after(node);
                    this._renderChilds(node);
                  }
                } else {
                  show = false;
                }
              } else if (name === "if" && !value) {
                show = false;
              } else if (name === "text" && this.textContent !== value) {
                this.textContent = value;
              } else if (name === "html" && this.innerHTML !== value) {
                this.innerHTML = value;
              } else if (name.startsWith(":")) {
                if (value === false) {
                  this.removeAttribute(name.slice(1));
                } else if (value === true) {
                  this.setAttribute(name.slice(1), "");
                } else if (name === ":class" || name === ":style") {
                  this.setAttribute(
                    name.slice(1),
                    this.getAttribute(name.slice(1)) + " " + value
                  );
                } else {
                  this.setAttribute(name.slice(1), value);
                }
              }

              if (this[name.slice(1)] !== value) {
                this[name.slice(1)] = value;
              }
            });

            if (show) {
              this.style.removeProperty("display");
            } else {
              this.style.setProperty("display", "none");
            }
          }

          _renderChilds(node) {
            node
              .querySelectorAll(`[is^='${reflex.prefix}-'`)
              .forEach((childNode) => childNode.render && childNode.render());
          }

          _setPaths() {
            this.path = {};
            this.bindAttributes.forEach(({ name, value: path }) => {
              if (name === "for" || name === "_for") {
                path = path.split(" in ")[1];
              }

              if (name === "if") {
                path = path.split(" ")[0];
              }

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
                const index = parent._index;
                const [item, source] = parent.hasAttribute("for")
                  ? parent.getAttribute("for").split(" in ")
                  : parent.getAttribute("_for").split(" in ");

                path = path.replace(
                  new RegExp(`(^|\\.)${item}(\\.|$)`),
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
