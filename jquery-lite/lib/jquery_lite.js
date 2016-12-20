/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);
	
	const readyFuncs = [];
	let docReady = false;
	document.addEventListener("DOMContentLoaded", executeLoad);
	
	
	function executeLoad() {
	  docReady = true;
	  readyFuncs.forEach((fn) => {
	    fn();
	  });
	}
	
	$l = function(selector) {
	
	  if(selector instanceof Function) {
	    if(docReady)
	      selector();
	    else
	      readyFuncs.push(selector);
	  } else if(selector instanceof HTMLElement) {
	    return new DOMNodeCollection([selector]);
	  } else if(typeof(selector) === "string") {
	    const args = [];
	    args.push(document.querySelector(selector));
	    return new DOMNodeCollection(args);
	  }
	};
	
	$l.extend = function(objectA, ...objects) {
	  objects.forEach((object) => {
	    for(let key in object) {
	      objectA[key] = object[key];
	    }
	  });
	  return objectA;
	};
	
	$l.ajax = function(options = {}) {
	  const request = new XMLHttpRequest();
	  const defaults = {
	    method: "GET",
	    url: "",
	    success: function() {},
	    error: function() {},
	    data: {},
	    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
	  };
	
	  options = $l.extend(defaults, options);
	  options.method = options.method.toUpperCase();
	
	  request.open(options.method, options.url, true);
	  request.onload = e => {
	    if (request.status === 200) {
	      options.success(request.response);
	    } else {
	      options.error(request.response);
	    }
	  };
	
	request.send(JSON.stringify(options.data));
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(collection = []) {
	    this.collection = collection;
	  }
	
	  each(cb) {
	    this.collection.forEach(cb);
	  }
	
	  html(arg) {
	    if(arg === undefined) {
	      return this.collection[0].innerHTML;
	    } else {
	      this.each((node) => {
	        node.innerHTML = arg;
	        return this;
	      });
	    }
	  }
	
	  empty() {
	    html("");
	    return this;
	  }
	
	  append(children) {
	     if (this.collection.length === 0) return;
	
	     if (typeof children === 'object' && !(children instanceof DomNodeCollection)) {
	       children = $l(children);
	     }
	
	     if (typeof children === "string") {
	       this.each(node => node.innerHTML += children);
	     } else if (children instanceof DomNodeCollection) {
	       this.each(node => {
	         children.each(childNode => {
	           node.appendChild(childNode.cloneNode(true))
	         });
	       })
	     }
	   }
	
	  attr(arg, val) {
	    if(val === undefined) {
	      return this.collection[0].getAttribute(arg);
	    } else {
	      this.collection[0].setAttribute(arg, val);
	    }
	    return this;
	  }
	
	  addClass(classname) {
	    let classes = this.attr("class").split(" ");
	
	    if(!classes.includes(classname)) {
	      classes.push(classname);
	    }
	
	    this.attr("class", classes.join(" "));
	    return this;
	  }
	
	  removeClass(classname) {
	    let classes = this.attr("class").split(" ");
	
	    let index = classes.indexOf(classname);
	
	    if(index > -1) {
	      classes.splice(index, 1);
	    }
	
	    this.attr("class", classes.join(" "));
	    return this;
	  }
	
	  children() {
	    let childNodes = [];
	    this.each((node) => {
	      childNodes = childNodes.concat(Array.from(node.children));
	    });
	
	    return new DOMNodeCollection(childNodes);
	  }
	
	  parent() {
	    const parentNodes = [];
	    this.each(node => parentNodes.push(node.parentNode));
	    return new DomNodeCollection(parentNodes);
	  }
	
	  find(arg) {
	    return new DOMNodeCollection(this.collection[0].querySelectorAll(arg));
	  }
	
	  remove() {
	    this.collection.forEach((node) => {
	      node.remove();
	    });
	  }
	
	  on(eventName, callback) {
	    this.each(node => {
	      node.addEventListener(eventName, callback);
	      const eventKey = `jqliteEvents-${eventName}`;
	      if (typeof node[eventKey] === "undefined") {
	        node[eventKey] = [];
	      }
	      node[eventKey].push(callback);
	    });
	  }
	
	  off(eventName) {
	    this.each(node => {
	      const eventKey = `jqliteEvents-${eventName}`;
	      if (node[eventKey]) {
	        node[eventKey].forEach(callback => {
	          node.removeEventListener(eventName, callback);
	        });
	      }
	      node[eventKey] = [];
	    });
	  }
	}
	
	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);
//# sourceMappingURL=jquery_lite.js.map