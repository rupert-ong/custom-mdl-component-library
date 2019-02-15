"use strict";

(function(_NS) {
  function Pagination(selector, userConfig) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      rowsPerPage: 5,
      rowsPerPageOpts: [1, 2, 5],
      totalRows: 0,
      current: 1,
      callback: null,
      totalPages: 0
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);
    config.totalPages = Math.ceil(config.totalRows / config.rowsPerPage);

    this.selector = selector;
    this.domRef = document.querySelector(this.selector);
    this.state = {
      config: config
    };

    this._addEventHandlers();
    this._render();
    this._renderPageSelect();
    this._update();
  }

  Pagination.prototype = {
    _renderPageSelect: function() {
      this.domRef.querySelector(
        "._mdl-pagination-pageSelectContainer"
      ).innerHTML = _NS.template.render(
        Pagination.pageSelectTemplate,
        this.state.config
      );
    },
    _addEventHandlers: function() {
      var stateConfig = this.state.config;

      this.domRef.addEventListener(
        "click",
        function(e) {
          var classTokenList = e.target.classList;

          if (
            !(
              classTokenList.contains("_mdl-pagination-prev") ||
              classTokenList.contains("_mdl-pagination-next")
            )
          ) {
            return false;
          }

          if (classTokenList.contains("_mdl-pagination-prev")) {
            stateConfig.current = Math.max(1, stateConfig.current - 1);
          } else {
            stateConfig.current = Math.min(
              stateConfig.totalPages,
              stateConfig.current + 1
            );
          }
          this._update();
          this._runCallback();
        }.bind(this)
      );

      this.domRef.addEventListener(
        "change",
        function(e) {
          var classTokenList = e.target.classList;

          if (
            !(
              classTokenList.contains("_mdl-pagination-pageSelect") ||
              classTokenList.contains("_mdl-pagination-rowsPerPageSelect")
            )
          ) {
            return false;
          }

          if (classTokenList.contains("_mdl-pagination-pageSelect")) {
            stateConfig.current = Number(e.target.value);
          } else {
            stateConfig.current = 1;
            stateConfig.rowsPerPage = Number(e.target.value);
            stateConfig.totalPages = Math.ceil(
              stateConfig.totalRows / stateConfig.rowsPerPage
            );
            this._renderPageSelect();
          }

          this._update();
          this._runCallback();
        }.bind(this)
      );
    },
    _render: function() {
      this.domRef.innerHTML = _NS.template.render(
        Pagination.template,
        this.state.config
      );
    },
    _update: function() {
      var rowsPerPageSelect = this.domRef.querySelector(
          "._mdl-pagination-rowsPerPageSelect"
        ),
        pageSelect = this.domRef.querySelector("._mdl-pagination-pageSelect"),
        prevBtn = this.domRef.querySelector("._mdl-pagination-prev"),
        nextBtn = this.domRef.querySelector("._mdl-pagination-next"),
        stateConfig = this.state.config,
        current = stateConfig.current,
        rowsPerPage = stateConfig.rowsPerPage,
        totalPages = stateConfig.totalPages;

      prevBtn.disabled = totalPages === 0 || current === 1 ? true : false;
      nextBtn.disabled =
        totalPages === 0 || current === totalPages ? true : false;
      if (pageSelect.value !== current) pageSelect.value = current;
      if (rowsPerPageSelect.value !== rowsPerPage)
        rowsPerPageSelect.value = rowsPerPage;
    },

    _runCallback: function() {
      var stateConfig = this.state.config;
      if (typeof stateConfig.callback === "function")
        stateConfig.callback(stateConfig.current, stateConfig.rowsPerPage);
    }
  };

  Pagination.template = document.querySelector("._tmpl-pagination").innerHTML;
  Pagination.pageSelectTemplate = document.querySelector(
    "._tmpl-paginationPageSelect"
  ).innerHTML;

  _NS.pagination = function(selector, config) {
    return new Pagination(selector, config);
  };
})(MDL);
