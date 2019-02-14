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
    this._sortDataAndRenderTableBody();
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
          } else if (e.target.classList.contains("_mdl-table-detailsToggle")) {
            this._expandRowDetailsView(e.target);
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
      this._sortDataAndRenderTableBody();
    },

    _updateSortHeaderView: function(key, direction) {
      if (!Array.isArray(this.state.data) || !this.state.data.length) return;

      var elem = document.querySelector(
        this.selector +
          " ._mdl-table > thead ._mdl-table-th[data-sort-key=" +
          key +
          "]"
      );
      if (elem === null) return;

      var parentTable = elem.closest("._mdl-table"),
        headers = parentTable.querySelectorAll("._mdl-table-th"),
        i = 0,
        CLASS_SORT_PREFIX = "mdl-table__header--sort-",
        CLASS_SORT_ASC = CLASS_SORT_PREFIX + "asc",
        CLASS_SORT_DESC = CLASS_SORT_PREFIX + "desc";

      for (; i < headers.length; i++) {
        var header = headers[i];
        header.classList.contains(CLASS_SORT_ASC)
          ? header.classList.remove(CLASS_SORT_ASC)
          : header.classList.remove(CLASS_SORT_DESC);
      }

      elem.classList.add(CLASS_SORT_PREFIX + direction);
    },

    _sortDataAndRenderTableBody: function() {
      this._changeStateSortData();
      if (this.state.config.sort.enabled) {
        this._updateSortHeaderView(
          this.state.config.sort.key,
          this.state.config.sort.direction
        );
      }
      this._renderTableBody();
    },

    _expandRowDetailsView: function(elem) {
      var parentRow = elem.closest("._mdl-table-row");
      parentRow.classList.toggle("mdl-table__row--expanded");
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
      this._sortDataAndRenderTableBody();
    }
  };

  Table.template = document.querySelector("._tmpl-table").innerHTML;
  Table.rowTemplate = document.querySelector("._tmpl-tableRow").innerHTML;

  _NS.table = function(selector, config, data) {
    return new Table(selector, config, data);
  };
})(MDL);
