"use strict";

var MDL = {};

(function(_NS) {
  function _closestPolyfill() {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        var el = this;

        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  }

  function _customEventPolyfill() {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  (function polyfill() {
    _closestPolyfill();
    _customEventPolyfill();
  })();

  function isObject(obj) {
    return (
      obj !== null &&
      Object.prototype.toString.call(obj).slice(8, -1) === "Object"
    );
  }

  function hasProperty(obj, property) {
    return isObject(obj) && obj.hasOwnProperty(property);
  }

  function hasPropertyAndIsTruthy(obj, property) {
    return hasProperty(obj, property) && obj[property];
  }

  function hasPropertyAndIsNotEmpty(obj, property) {
    if (hasProperty(obj, property) && obj[property] !== null) {
      var prop = obj[property],
        propPrototype = Object.prototype.toString.call(prop).slice(8, -1);
      switch (propPrototype) {
        case "Array":
          return prop.length > 0;
        case "String":
          return prop.trim().length > 0;
        case "Object":
          return Object.keys(prop).length > 0;
        default:
          return true;
      }
    }
    return false;
  }

  function sortArray(arr, direction, key) {
    if (!Array.isArray(arr)) return null;
    return arr.concat().sort(function(a, b) {
      if (key && (!hasProperty(a, key) || !hasProperty(b, key))) return 0;

      var sortA = key ? a[key] : a,
        sortB = key ? b[key] : b,
        comparison = 0;

      if (sortA > sortB) {
        comparison = 1;
      } else if (sortA < sortB) {
        comparison = -1;
      }
      return direction == "desc" ? comparison * -1 : comparison;
    });
  }

  function mutate(obj, src) {
    if (!isObject(obj)) return;
    Object.keys(src).forEach(function(key) {
      obj[key] = src[key];
    });
  }

  function extend() {
    var extended = {},
      deep = false,
      i = 0;

    if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
      deep = arguments[0];
      i++;
    }

    var merge = function(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          if (deep && isObject(obj[prop])) {
            extended[prop] = extend(true, extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    for (; i < arguments.length; i++) {
      merge(arguments[i]);
    }
    return extended;
  }

  mutate(_NS, {
    name: "MDL",
    utils: {
      isObject: isObject,
      hasProperty: hasProperty,
      hasPropertyAndIsTruthy: hasPropertyAndIsTruthy,
      hasPropertyAndIsNotEmpty: hasPropertyAndIsNotEmpty,
      sortArray: sortArray,
      mutate: mutate,
      extend: extend
    },
    defaults: {
      pagination: {
        rowsPerPage: 10,
        rowsPerPageOpts: [10, 25, 50]
      }
    },
    dispatchEvent: function(type, detail) {
      document.dispatchEvent(new CustomEvent(type, {
        detail: detail,
        bubbles: true,
        cancelable: true
      }));
    },
    event: {
      DIALOG_CLOSE: "mdl.dialog.close"
    }
  });
})(MDL);
