// Template Example
var data = {
  name: 'Tan Gueray',
  profile: { age: 52 },
  skills: ['gin', 'css', 'kung-fu']
};

document.querySelector('#content').innerHTML = MDWC.template.render(
  document.querySelector('._tmpl-basic').innerHTML,
  data
);

// Table Example
var testData1 = [
  {
    name: 'Ketel One',
    age: 7,
    repos: 0,
    born: 'September 3, 2010',
    bornTimestamp: 1283486400000
  },
  {
    name: 'Yellowstone Bourbon',
    age: 50,
    repos: 205,
    born: 'May 17, 1968',
    bornTimestamp: -51307200000
  },
  {
    name: 'Carpano Antica Formula',
    age: 255,
    repos: 9831,
    born: 'January 2, 1764',
    bornTimestamp: -6500631838000
  },
  {
    name: 'Mezcal Creyente',
    age: 2,
    repos: 10,
    born: 'March 15, 2016',
    bornTimestamp: 1458014400000
  }
];

var testData2 = [
  {
    name: 'Jim Bean',
    age: 56,
    repos: 1,
    born: 'June 1, 1963',
    bornTimestamp: -207864000000
  },
  {
    name: 'Bombay Sapphire',
    age: 18,
    repos: 10,
    born: 'September 23, 2000',
    bornTimestamp: 969681600000
  },
  {
    name: 'Tan Gueray',
    repos: 1,
    age: 36,
    born: 'May 15, 1982',
    bornTimestamp: 390283200000
  },
  {
    name: 'Beef Eater',
    repos: 2,
    age: 41,
    born: 'April 10, 1977',
    bornTimestamp: 229496400000
  },
  {
    name: 'Aviator Gin',
    repos: 25,
    age: 41,
    born: 'April 1, 1977',
    bornTimestamp: 228718800000
  },
  {
    name: 'Mac Allan',
    repos: 3,
    age: 0,
    born: 'January 31, 2018',
    bornTimestamp: 1517374800000
  }
];

var table = MDWC.table('#tableContent', {
  columns: [
    { label: 'Name', key: 'name' },
    { label: 'Age', key: 'age', type: 'numeric', width: '2%' },
    {
      label: 'Birthday',
      key: 'born',
      sortKey: 'bornTimestamp',
      width: '35%'
    },
    {
      label: 'Quantity',
      columnTemplateSelector: '._tmpl-table-column-quantity',
      width: '100px'
    },
    { columnTemplateSelector: '._tmpl-table-column-actions', width: '50px' }
  ],
  detailsTemplateSelector: '._tmpl-table-details',
  pagination: {
    // enabled: false,
    rowsPerPage: 2,
    rowsPerPageOpts: [1, 2, 4]
  } /*
  sort: {
    enabled: false
  }*/
});

document
  .querySelector('._changeTableData')
  .addEventListener('click', function(e) {
    var btn = e.target,
      key = btn.getAttribute('data-key');
    table.loadData(key === '1' ? testData1 : testData2);
    btn.setAttribute('data-key', key === '1' ? '2' : '1');
  });

document.querySelector('#tableContent').addEventListener('click', function(e) {
  if (e.target.closest('._dataTableActionButton')) {
    var data = table.state.data.all.find(function(obj) {
      return obj._id === e.target.dataset.id;
    });

    var tableActionButtonDialog = MDWC.dialog(
      '#dialogContainer',
      {
        id: 'tableActionDialog',
        contentTemplateSelector: '._tmpl-dialog-dataTableActionButton',
        autoOpen: true,
        closeOnOverlayClick: false,
        buttons: [
          {
            label: 'Dismiss',
            id: 'tableActionDialogDismiss',
            type: 'dismissive',
            callback: function() {
              this.close('dismissive');
            }
          },
          {
            label: 'Accept',
            id: 'tableActionDialogAccept',
            type: 'confirming',
            disabled: true,
            callback: function(a) {
              console.log(this, a);
              setTimeout(
                function() {
                  this.close('confirming');
                }.bind(this),
                2000
              );
            },
            callbackArgs: ['apples']
          }
        ]
      },
      {
        title: data.name,
        content: data
      }
    );
  }
});

// Buttons Example
document
  .querySelector('._disableButtons')
  .addEventListener('click', function(e) {
    var mainButton = e.target;
    var buttons = e.target.closest('._btnContainer').querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      if (button !== mainButton) button.disabled = !button.disabled;
    }
  });

// Dialog Example
document
  .querySelector('._tempShowDialog')
  .addEventListener('click', function(e) {
    var testDialog = MDWC.dialog(
      '#dialogContainer',
      {
        id: 'testDialog',
        contentTemplateSelector: '._tmpl-dialog-sample',
        autoOpen: false
      },
      {
        content: { content: 'Do you wish to continue?' }
      }
    );
    testDialog.open();
  });

document.addEventListener(MDWC.event.DIALOG_CLOSE, function(e) {
  console.log(e.detail);
});
