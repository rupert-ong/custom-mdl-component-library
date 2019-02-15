"use strict";

(function(_NS) {
  function Pagination(selector, userConfig) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      rowsPerPage: 10,
      totalRows: 0,
      current: 1,
      callback: null,
      totalPages: 0
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);
    config.totalPages = Math.ceil(config.totalRows / config.rowsPerPage);

    this.selector = selector;
    this.state = {
      config: config
    };

    this._addEventHandlers();
    this._render();
    this._update();
  }

  Pagination.prototype = {
    _addEventHandlers: function() {
      document.querySelector(this.selector).addEventListener(
        "click",
        function(e) {
          var classTokenList = e.target.classList,
            stateConfig = this.state.config;
          if (classTokenList.contains("_mdl-pagination-first")) {
            stateConfig.current = 1;
          } else if (classTokenList.contains("_mdl-pagination-prev")) {
            stateConfig.current = Math.max(1, stateConfig.current - 1);
          } else if (classTokenList.contains("_mdl-pagination-next")) {
            stateConfig.current = Math.min(
              stateConfig.totalPages,
              stateConfig.current + 1
            );
          } else if (classTokenList.contains("_mdl-pagination-last")) {
            stateConfig.current = stateConfig.totalPages;
          }
          this._update();

          if (typeof stateConfig.callback === "function")
            stateConfig.callback(stateConfig.current);
        }.bind(this)
      );
    },
    _render: function() {
      document.querySelector(this.selector).innerHTML = _NS.template.render(
        Pagination.template,
        null
      );
    },
    _update: function() {
      var buttons = document.querySelectorAll(this.selector + " button"),
        stateConfig = this.state.config,
        current = stateConfig.current,
        totalPages = stateConfig.totalPages,
        i = 0;

      for (; i < buttons.length; i++) {
        var button = buttons[i],
          classTokenList = button.classList;

        button.removeAttribute("disabled");

        if (
          (current === 1 &&
            (classTokenList.contains("_mdl-pagination-first") ||
              classTokenList.contains("_mdl-pagination-prev"))) ||
          (current === totalPages &&
            (classTokenList.contains("_mdl-pagination-next") ||
              classTokenList.contains("_mdl-pagination-last"))) ||
          totalPages === 0
        ) {
          button.disabled = true;
        }
      }
    }
  };

  Pagination.template = document.querySelector("._tmpl-pagination").innerHTML;

  _NS.pagination = function(selector, config) {
    return new Pagination(selector, config);
  };
})(MDL);
