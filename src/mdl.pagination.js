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

    this.selector = selector;
    this.state = {
      config: config
    };

    this._render();
  }

  Pagination.prototype = {
    _render: function(){
      document.querySelector(this.selector).innerHTML = _NS.template.render(Pagination.template, null);
    }
  };

  Pagination.template = document.querySelector("._tmpl-pagination").innerHTML;

  _NS.pagination = function(selector, config) {
    return new Pagination(selector, config);
  };
})(MDL);
