"use strict";

(function(_NS) {
  function Dialog(selector, userConfig, data) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      id: null,
      scrollable: false,
      buttons: [
        { label: "Cancel", type: "dismissive" },
        { label: "Ok", type: "confirming" }
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
      this.domRef.querySelector("._mdwc-dialog").addEventListener(
        "click",
        function(e) {
          var target = e.target;
          if (
            target.matches("._mdwc-dialog-scrim") ||
            target.matches("._mdwc-dialog-btn")
          ) {
            this.close();
            _NS.dispatchEvent(this.domRef, _NS.event.DIALOG_CLOSE, {
              id: this.state.config.id,
              type: target.dataset.type
            });
          }
        }.bind(this)
      );
    },

    open: function() {
      this._render();
      this._addEventHandlers();
      //window.requestAnimationFrame(
      setTimeout(
        function() {
          this.domRef
            .querySelector("._mdwc-dialog")
            .classList.add("mdwc-dialog--open");
        }.bind(this),
        //);
        100
      );
    },

    close: function() {
      var dialogElem = this.domRef.querySelector("._mdwc-dialog"),
        transitionEndHandler = function(e) {
          var target = e.target;
          target.removeEventListener("transitionend", transitionEndHandler);
          target.parentNode.removeChild(target);
        };

      dialogElem.classList.remove("mdwc-dialog--open");
      dialogElem.addEventListener("transitionend", transitionEndHandler, false);
    }
  };

  Dialog.template = document.querySelector("._mdwc-tmpl-dialog").innerHTML;

  _NS.dialog = function(selector, config, data) {
    return new Dialog(selector, config, data);
  };
})(MDWC);
