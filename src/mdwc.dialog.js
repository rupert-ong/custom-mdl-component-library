'use strict';

(function(_NS) {
  function Dialog(selector, userConfig, data) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      id: null,
      scrollable: false,
      closeOnOverlayClick: true,
      buttons: [
        {
          label: 'Cancel',
          type: 'dismissive'
        },
        {
          label: 'Ok',
          type: 'confirming'
        }
      ],
      contentTemplateSelector: null,
      autoOpen: false,
      openCallback: null,
      openCallbackArgs: null
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);

    this.selector = selector;
    this.domRef = document.querySelector(this.selector);
    this.contentDomRef = null;
    this.actionsDomRef = null;

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
      this.contentDomRef = this.domRef.querySelector('._mdwc-dialog-content');
      this.actionsDomRef = this.domRef.querySelector('._mdwc-dialog-actions');
    },

    _addEventHandlers: function() {
      this.domRef.querySelector('._mdwc-dialog').addEventListener(
        'click',
        function(e) {
          var target = e.target;
          if (
            target.matches('._mdwc-dialog-scrim') &&
            this.state.config.closeOnOverlayClick
          ) {
            this.close(target.dataset.type);
          } else if (target.matches('._mdwc-dialog-btn')) {
            var buttonData = this.state.config.buttons[
              Number(target.dataset.index)
            ];
            if (buttonData.callback) {
              buttonData.callback.apply(
                this,
                buttonData.callbackArgs ? buttonData.callbackArgs : []
              );
            } else {
              this.close(target.dataset.type);
            }
          }
        }.bind(this)
      );
    },

    open: function() {
      this._render();
      this._addEventHandlers();

      var stateConfig = this.state.config;

      if (stateConfig.openCallback) {
        stateConfig.openCallback.apply(
          this,
          stateConfig.openCallbackArgs ? stateConfig.openCallbackArgs : []
        );
      }
      setTimeout(
        function() {
          this.domRef
            .querySelector('._mdwc-dialog')
            .classList.add('mdwc-dialog--open');
        }.bind(this),
        100
      );
    },

    close: function(type) {
      var type =
        typeof type !== 'undefined' && typeof type !== 'null' ? type : null;
      var dialogElem = this.domRef.querySelector('._mdwc-dialog'),
        transitionEndHandler = function(e) {
          var target = e.target;
          target.removeEventListener('transitionend', transitionEndHandler);
          target.parentNode.removeChild(target);
        };

      _NS.dispatchEvent(this.domRef, _NS.event.DIALOG_CLOSE, {
        id: this.state.config.id,
        type: type
      });

      dialogElem.classList.remove('mdwc-dialog--open');
      dialogElem.addEventListener('transitionend', transitionEndHandler, false);
      this.contentDomRef = null;
      this.actionsDomRef = null;
    }
  };

  Dialog.template = document.querySelector('._mdwc-tmpl-dialog').innerHTML;

  _NS.dialog = function(selector, config, data) {
    return new Dialog(selector, config, data);
  };
})(MDWC);
