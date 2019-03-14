'use strict';

(function(_NS) {
  function Table(selector, userConfig, data) {
    if (!selector || !_NS.utils.isObject(userConfig)) return;

    var defaultConfig = {
      columns: null,
      detailsTemplateSelector: null,
      sort: {
        enabled: true,
        key: null,
        direction: 'asc'
      },
      zebraStriping: false,
      pagination: {
        enabled: true,
        rowsPerPage: _NS.defaults.pagination.rowsPerPage,
        rowsPerPageOpts: _NS.defaults.pagination.rowsPerPageOpts.slice(),
        current: 1
      }
    };

    var config = _NS.utils.extend(true, defaultConfig, userConfig);

    data = Array.isArray(data) ? data : null;

    var sortConfig = config.sort;
    if (_NS.utils.hasPropertyAndIsTruthy(sortConfig, 'enabled')) {
      config = _NS.utils.extend(true, config, {
        sort: {
          key: _NS.utils.hasPropertyAndIsNotEmpty(sortConfig, 'key')
            ? sortConfig.key
            : config.columns[0].key,
          direction: _NS.utils.hasPropertyAndIsNotEmpty(sortConfig, 'direction')
            ? sortConfig.direction
            : 'asc'
        }
      });
    }

    this.selector = selector;
    this.domRef = document.querySelector(this.selector);
    this.state = {
      config: config,
      data: {
        all: this._addIdsToData(data),
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
        this.selector + '> table > tbody'
      ).innerHTML = _NS.template.render(Table.rowTemplate, this.state);
    },

    _renderPagination: function() {
      if (
        !this.state.config.pagination.enabled ||
        !_NS.utils.hasPropertyAndIsNotEmpty(this.state.data, 'all')
      )
        return null;

      var paginationSelector = '._mdwc-table-pagination',
        paginationElem = this.domRef.querySelector(paginationSelector),
        paginationConfig = this.state.config.pagination;

      if (paginationElem) {
        this.domRef.removeChild(paginationElem);
        paginationElem = null;
      }

      var paginationContainer = document.createElement('div');
      paginationContainer.classList.add(paginationSelector.slice(1));
      this.domRef.appendChild(paginationContainer);

      return _NS.pagination(paginationSelector, {
        rowsPerPage: paginationConfig.rowsPerPage,
        rowsPerPageOpts: paginationConfig.rowsPerPageOpts,
        current: paginationConfig.current,
        totalRows: this.state.data.all.length,
        callback: this._paginationCallback.bind(this)
      });
    },

    _paginationCallback: function(current, rowsPerPage) {
      this.state.config.pagination.current = current;
      this.state.config.pagination.rowsPerPage = rowsPerPage;
      this._changeStateRenderData();
      this._renderTableBody();
    },

    _addEventHandlers: function() {
      this.domRef.addEventListener(
        'click',
        function(e) {
          var target = e.target;
          if (
            target.closest('._mdwc-table-th') &&
            this.state.config.sort.enabled
          ) {
            this._updateSortView(
              target.closest('._mdwc-table-th').dataset.sortKey
            );
          } else if (target.matches('._mdwc-table-detailsToggle')) {
            this._expandRowDetailsView(target);
          }
        }.bind(this),
        false
      );
    },

    _updateSortView: function(key) {
      var sortConfig = this.state.config.sort,
        direction =
          sortConfig.key === key
            ? sortConfig.direction === 'asc'
              ? 'desc'
              : 'asc'
            : 'asc';

      this._changeStateConfigSort(key, direction);
      this._sortDataAndRenderTableBody();
    },

    _updateSortHeaderView: function(key, direction) {
      if (!Array.isArray(this.state.data.all) || !this.state.data.all.length)
        return;

      var elem = document.querySelector(
        this.selector +
          ' ._mdwc-table > thead ._mdwc-table-th[data-sort-key=' +
          key +
          ']'
      );
      if (elem === null) return;

      var parentTable = elem.closest('._mdwc-table'),
        headers = parentTable.querySelectorAll('._mdwc-table-th'),
        i = 0,
        CLASS_SORT_PREFIX = 'mdwc-table__header--sort-',
        CLASS_SORT_ASC = CLASS_SORT_PREFIX + 'asc',
        CLASS_SORT_DESC = CLASS_SORT_PREFIX + 'desc';

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
      var parentRow = elem.closest('._mdwc-table-row');
      parentRow.classList.toggle('mdwc-table__row--expanded');
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

      if (!_NS.utils.hasPropertyAndIsNotEmpty(this.state.data, 'all')) {
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

    _addIdsToData: function(data) {
      if (!Array.isArray(data)) return data;
      return data.map(function(obj) {
        if (!obj.hasOwnProperty('_id')) obj['_id'] = _NS.utils.generateId();
        return obj;
      });
    },

    loadData: function(data) {
      this.state.data.all = this._addIdsToData(data);
      this.state.data.rendered = data ? data.slice() : null;
      this.state.config.pagination.current = 1;
      this._sortDataAndRenderTableBody();
      this.pagination = this._renderPagination();
    }
  };

  Table.template = document.querySelector('._mdwc-tmpl-table').innerHTML;
  Table.rowTemplate = document.querySelector('._mdwc-tmpl-tableRow').innerHTML;

  _NS.table = function(selector, config, data) {
    return new Table(selector, config, data);
  };
})(MDWC);
