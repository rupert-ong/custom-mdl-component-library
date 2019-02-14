"use strict";

(function(_NS) {
  function Pagination(selector, userConfig) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      limit: 10,
      total: 0,
      current: 1,
      callback: null,
      totalPages: 0
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);
    config.totalPages = Math.ceil(config.total / config.limit);

    this.selector = selector;
    this.state = {
      config: config
    };
    this._addEventHandlers();
    this._render();
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
          console.log(stateConfig.current);
          // update UI to reflect state
        }.bind(this)
      );
    },
    _render: function() {
      document.querySelector(this.selector).innerHTML = _NS.template.render(
        Pagination.template,
        null
      );
    }
  };

  Pagination.template = document.querySelector("._tmpl-pagination").innerHTML;

  _NS.pagination = function(selector, config) {
    return new Pagination(selector, config);
  };
})(MDL);
