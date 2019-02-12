"use strict";

(function(_NS) {
  function Table(selector, userConfig, data) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      columns: null,
      detailsTemplateSelector: null,
      sort: {
        enabled: true,
        key: null,
        direction: "asc"
      }
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);

    data = Array.isArray(data) ? data : null;

    var sortConfig = config.sort;
    if (_NS.utils.hasPropertyAndIsTruthy(sortConfig, "enabled")) {
      config = _NS.utils.extend(true, config, {
        sort: {
          key: _NS.utils.hasPropertyAndIsNotEmpty(sortConfig, "key")
            ? sortConfig.key
            : config.columns[0].key,
          direction: _NS.utils.hasPropertyAndIsNotEmpty(sortConfig, "direction")
            ? sortConfig.direction
            : "asc"
        }
      });
    }

    this.selector = selector;
    this.state = {
      config: config,
      data: data
    };

    this._renderTableHeader();
    this._changeStateSortData();
    this._renderTableBody();

    this._addEventHandlers();
  }

  Table.prototype = {
    _renderTableHeader: function() {
      document.querySelector(this.selector).innerHTML = _NS.template.render(
        Table.template,
        this.state
      );
    },

    _renderTableBody: function() {
      document.querySelector(
        this.selector + "> table > tbody"
      ).innerHTML = _NS.template.render(Table.rowTemplate, this.state);
    },

    _addEventHandlers: function() {
      document.querySelector(this.selector).addEventListener(
        "click",
        function(e) {
          if (
            e.target.classList.contains("_mdl-table-th") &&
            this.state.config.sort.enabled
          ) {
            this._updateSortView(e.target.getAttribute("data-sort-key"));
          }
        }.bind(this)
      );
    },

    _updateSortView: function(key) {
      var sortConfig = this.state.config.sort,
        direction =
          sortConfig.key === key
            ? sortConfig.direction === "asc"
              ? "desc"
              : "asc"
            : "asc";

      this._changeStateConfigSort(key, direction);
      this._changeStateSortData();
      this._renderTableBody();
      console.log(this.state.config);
    },

    _changeStateConfigSort: function(key, direction) {
      this.state = _NS.utils.extend(true, this.state, {
        config: {
          sort: {
            key: key,
            direction: direction
          }
        }
      });
    },

    _changeStateSortData: function() {
      this.state.data = _NS.utils.sortArray(
        this.state.data,
        this.state.config.sort.direction,
        this.state.config.sort.key
      );
    },

    loadData: function(data) {
      this.state.data = data;
      this._changeStateSortData();
      this._renderTableBody();
    },

    getState: function() {
      return this.state;
    }
  };

  Table.template = document.querySelector("._tmpl-table").innerHTML;
  Table.rowTemplate = document.querySelector("._tmpl-tableRow").innerHTML;

  _NS.table = function(selector, config, data) {
    return new Table(selector, config, data);
  };
})(MDL);
