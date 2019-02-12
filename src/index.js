var data = {
  name: "Tan Gueray",
  profile: { age: 52 },
  skills: ["gin", "css", "kung-fu"]
};

var template = document.querySelector("._tmpl-basic").innerHTML;

document.querySelector("#content").innerHTML = MDL.template.render(
  template,
  data
);

var table = MDL.table("#tableContent", {
  columns: [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Birthday", key: "born", sortKey: "bornTimestamp" }
  ],
  detailsTemplateSelector: "._tmpl-table-details"
});

var testData = [
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

table.loadData(testData);
