//https://www.youtube.com/watch?v=sYGreL-lxkg
//https://moodle.lut.fi/mod/page/view.php?id=701261
import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";

const query = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021"
        ]
      }
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"]
      }
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"]
      }
    }
  ],
  response: {
    format: "json-stat2"
  }
};

const getData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(query)
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  return data;
};

const buildChart = async (check, kunta) => {
  if (check === "true") {
    const url =
      "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const res = await fetch(url, {
      method: "GET"
    });
    const dataCode = await res.json();

    const dataC = await getData();
    //let years = Object.values(dataC.dimension.Vuosi.category.label);

    let muniCode = Object.values(dataCode.variables[1])[2];
    //let infoCode = muniCode[2]; //antaa koodi jono, infoCode[2] paikka

    let muniName = Object.values(dataCode.variables[1])[3];
   //console.log(Object.values(dataCode.variables[1])[3])
    //let infoName = muniName[3]; //antaa nimi jonon,infoName[2] paikka

    let area = "";
    for (let n = 0; n < 310; n++) {
      if (kunta.toLowerCase() === muniName[n].toLowerCase()) {
        area = muniCode[n]
        kunta = muniName[n]
      }
    }

    query.query[1].selection.values[0] = area;
  }
  const data = await getData();
  let years = Object.values(data.dimension.Vuosi.category.label);
  //const alue = Object.values(data.dimension.Alue);
  const luku = data.value;

  let charData = {
    labels: years,
    datasets: [{ values: luku }]
  };

  const chart = new Chart("#chart", {
    title: "Finnish municipalities",
    data: charData,
    type: "line",
    colors: ["#eb5146"],
    height: 450
  });
};

let clicked = "false";
let kunta = "";

const submitBtn = document.getElementById("submit-data");
//discussion with Kirveskoski
submitBtn.addEventListener("click", function (event) {
  kunta = document.getElementById("input-area").value;
  clicked = "true";
  buildChart(clicked, kunta);
  event.preventDefault();
});

buildChart(clicked, kunta);
