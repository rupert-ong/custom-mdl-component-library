"use strict";

(function(_NS) {
  function Dialog(selector, userConfig, data) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      id: null,
      scrollable: false,
      buttons: [
        { label: "Cancel", type: "dismissive" },
        { label: "Ok", type: "confirming", disabled: true }
      ],
      contentTemplateSelector: null,
      autoOpen: false
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);

    this.selector = selector;
    this.domRef = document.querySelector(this.selector);
    this.state = {
      config: config,
      data: {
        title: data.title ? data.title : null,
        content: data.content
      }
    };

    if (config.autoOpen) {
      this.open();
    }
  }

  Dialog.prototype = {
    _render: function() {
      this.domRef.innerHTML = _NS.template.render(Dialog.template, this.state);
    },

    _addEventHandlers: function() {
      this.domRef.querySelector("._mdl-dialog").addEventListener(
        "click",
        function(e) {
          var target = e.target;
          if (target.matches("._mdl-dialog-scrim")) {
            this.close();
          } else if (target.matches("._mdl-dialog-btn")) {
            if (target.dataset.type === "dismissive") {
              this.close();
            }
          }
        }.bind(this)
      );
    },

    open: function() {
      this._render();
      this._addEventHandlers();
      window.requestAnimationFrame(
        function() {
          this.domRef
            .querySelector("._mdl-dialog")
            .classList.add("mdl-dialog--open");
        }.bind(this)
      );
    },

    close: function() {
      var dialogElem = this.domRef.querySelector("._mdl-dialog"),
        transitionEndHandler = function(e) {
          var target = e.target;
          target.removeEventListener("transitionend", transitionEndHandler);
          target.parentNode.removeChild(target);
        };

      dialogElem.classList.remove("mdl-dialog--open");
      dialogElem.addEventListener("transitionend", transitionEndHandler, false);
    }
  };

  Dialog.template = document.querySelector("._tmpl-dialog").innerHTML;

  _NS.dialog = function(selector, config, data) {
    return new Dialog(selector, config, data);
  };
})(MDL);
