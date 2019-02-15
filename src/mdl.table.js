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
      },
      pagination: {
        enabled: true,
        rowsPerPage: 20,
        current: 1
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
    this.domRef = document.querySelector(this.selector);
    this.state = {
      config: config,
      data: {
        all: data,
        rendered: Array.isArray(data) ? data.slice() : null
      }
    };

    this._renderTableHeader();
    this._sortDataAndRenderTableBody();
    this.pagination = this._renderPagination();
    this._addEventHandlers();
  }

  Table.prototype = {
    _renderTableHeader: function() {
      this.domRef.innerHTML = _NS.template.render(Table.template, this.state);
    },

    _renderTableBody: function() {
      document.querySelector(
        this.selector + "> table > tbody"
      ).innerHTML = _NS.template.render(Table.rowTemplate, this.state);
    },

    _renderPagination: function() {
      if (
        !this.state.config.pagination.enabled ||
        !_NS.utils.hasPropertyAndIsNotEmpty(this.state.data, "all")
      )
        return null;

      var paginationSelector = "._mdl-table-pagination",
        paginationElem = this.domRef.querySelector(paginationSelector),
        paginationConfig = this.state.config.pagination;

      if (paginationElem) {
        this.domRef.removeChild(paginationElem);
        paginationElem = null;
      }

      var paginationContainer = document.createElement("div");
      paginationContainer.classList.add(paginationSelector.slice(1));
      this.domRef.appendChild(paginationContainer);

      return _NS.pagination(paginationSelector, {
        rowsPerPage: paginationConfig.rowsPerPage,
        current: paginationConfig.current,
        totalRows: this.state.data.all.length,
        callback: this._paginationCallback.bind(this)
      });
    },

    _paginationCallback: function(current) {
      this.state.config.pagination.current = current;
      this._changeStateRenderData();
      this._renderTableBody();
    },

    _addEventHandlers: function() {
      this.domRef.addEventListener(
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
      if (!Array.isArray(this.state.data.all) || !this.state.data.all.length)
        return;

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
      var sortConfig = this.state.config.sort;
      this._changeStateSortData();
      if (sortConfig.enabled) {
        this._updateSortHeaderView(sortConfig.key, sortConfig.direction);
      }
      this._changeStateRenderData();
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
      this.state.data.all = _NS.utils.sortArray(
        this.state.data.all,
        this.state.config.sort.direction,
        this.state.config.sort.key
      );
    },

    _changeStateRenderData: function() {
      var paginationConfig = this.state.config.pagination,
        current = paginationConfig.current,
        rowsPerPage = paginationConfig.rowsPerPage;

      if (!_NS.utils.hasPropertyAndIsNotEmpty(this.state.data, "all")) {
        this.state.data.rendered = null;
        return;
      }

      if (paginationConfig.enabled) {
        this.state.data.rendered = this.state.data.all.slice(
          (current - 1) * rowsPerPage,
          current * rowsPerPage
        );
      } else {
        this.state.data.rendered = this.state.data.all.slice();
      }
    },

    loadData: function(data) {
      this.state.data.all = data;
      this.state.data.rendered = data.slice();
      this.state.config.pagination.current = 1;
      this._sortDataAndRenderTableBody();
      this.pagination = this._renderPagination();
    }
  };

  Table.template = document.querySelector("._tmpl-table").innerHTML;
  Table.rowTemplate = document.querySelector("._tmpl-tableRow").innerHTML;

  _NS.table = function(selector, config, data) {
    return new Table(selector, config, data);
  };
})(MDL);
