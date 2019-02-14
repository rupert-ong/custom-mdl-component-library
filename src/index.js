// Template Example
var data = {
  name: "Tan Gueray",
  profile: { age: 52 },
  skills: ["gin", "css", "kung-fu"]
};

document.querySelector("#content").innerHTML = MDL.template.render(
  document.querySelector("._tmpl-basic").innerHTML,
  data
);

// Table Example
var table = MDL.table("#tableContent", {
  columns: [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Birthday", key: "born", sortKey: "bornTimestamp" }
  ],
  detailsTemplateSelector: "._tmpl-table-details",
  pagination: {
    // enabled: false,
    limit: 2
  }
});

var testData1 = [
  {
    name: "Ketel One",
    age: 7,
    repos: 0,
    born: "September 3, 2010",
    bornTimestamp: 1283486400000
  },
  {
    name: "Yellowstone Bourbon",
    age: 50,
    repos: 205,
    born: "May 17, 1968",
    bornTimestamp: -51307200000
  },
  {
    name: "Carpano Antica Formula",
    age: 255,
    repos: 9831,
    born: "January 2, 1764",
    bornTimestamp: -6500631838000
  },
  {
    name: "Mezcal Creyente",
    age: 2,
    repos: 10,
    born: "March 15, 2016",
    bornTimestamp: 1458014400000
  }
];

var testData2 = [
  {
    name: "Jim Bean",
    age: 56,
    repos: 1,
    born: "June 1, 1963",
    bornTimestamp: -207864000000
  },
  {
    name: "Bombay Sapphire",
    age: 18,
    repos: 10,
    born: "September 23, 2000",
    bornTimestamp: 969681600000
  },
  {
    name: "Tan Gueray",
    repos: 1,
    age: 36,
    born: "May 15, 1982",
    bornTimestamp: 390283200000
  },
  {
    name: "Beef Eater",
    repos: 2,
    age: 41,
    born: "April 10, 1977",
    bornTimestamp: 229496400000
  },
  {
    name: "Aviator Gin",
    repos: 25,
    age: 41,
    born: "April 1, 1977",
    bornTimestamp: 228718800000
  },
  {
    name: "Mac Allan",
    repos: 3,
    age: 0,
    born: "January 31, 2018",
    bornTimestamp: 1517374800000
  }
];

document
  .querySelector("._changeTableData")
  .addEventListener("click", function(e) {
    var btn = e.target,
      key = btn.getAttribute("data-key");
    table.loadData(key === "1" ? testData1 : testData2);
    btn.setAttribute("data-key", key === "1" ? "2" : "1");
  });
