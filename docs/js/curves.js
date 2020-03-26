const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let loc = urlParams.get('loc');
let country = "";
let region = "";
let last_day;
let confirmed_cases;

let chart_new_cases;
let chart_ts_data;

if (loc == null || loc == "") {
  country = "US"
  loc = "United States of America"
}
else {
  if (loc == "US | New York"){
    loc = "United States of America"
    country = "US"
    region = ""
  }
  else if (loc.includes("|")) {
    country = loc.split('|')[0].trim()
    if (country == "United States of America")
    country = "US"
    region = loc.split('|')[1].trim()
  }
  else
  country = loc
  if (country == "United States of America")
  country = "US"
  if (country == "Taiwan")
  country = "Taiwan*"
}

document.getElementById("loc-region").innerHTML = loc.toString()

const confirmed_ts_url = "https://raw.githubusercontent.com/sricola/graphthecurve.com/master/data/time_series_covid19_confirmed_global.csv.2020-03-25"
const deaths_ts_url = "https://raw.githubusercontent.com/sricola/graphthecurve.com/master/data/time_series_covid19_deaths_global.csv"

let list_of_places = new Array;
let confirmed_ts_data;
let deaths_ts_data;

const deaths_ts_csvdata = Papa.parse(deaths_ts_url, {
  download: true,
  dynamicTyping: true,
  complete: function(results){deaths_ts_data = results.data;}
});

const confirmed_ts_csvdata = Papa.parse(confirmed_ts_url, {
  download: true,
  dynamicTyping: true,
  complete: function(results){
    confirmed_ts_data = results.data;
    process_data(results.data)
    }
});

function process_data(confirmed_ts_data) {
  for (i = 1; i < confirmed_ts_data.length; i++) {
    if (confirmed_ts_data[i][0] != null) {
      if (!list_of_places.includes(confirmed_ts_data[i][1]))
      list_of_places.push(confirmed_ts_data[i][1])
      list_of_places.push(confirmed_ts_data[i][1] + " | " + confirmed_ts_data[i][0])
    }
    else if (confirmed_ts_data[i][1] != null || confirmed_ts_data[i][1] != "")
    list_of_places.push(confirmed_ts_data[i][1])
  }
  
  list_of_places.push("United States of America")
  var ctx = document.getElementById('canvas_ts').getContext('2d');
  var cty = document.getElementById('canvas_new_cases').getContext('2d');
  
  let confirmed_ts = new Array;
  for (i = 0; i < confirmed_ts_data.length; i++) {
    if (confirmed_ts_data[i][1] == country) {
      if (confirmed_ts.length > 0 && region == "") {
        confirmed_temp = confirmed_ts_data[i].slice(4, confirmed_ts_data[i].length)
        for (j = 0; j < confirmed_temp.length; j++) {
          confirmed_ts[j] += confirmed_temp[j]
        }
      }
      else if (region != "" && region != confirmed_ts_data[i][0])
        continue
      else{
        confirmed_ts = confirmed_ts_data[i].slice(4, confirmed_ts_data[i].length)
      }
    }
    
  }
  
  if (confirmed_ts.length == 0){
    window.location.replace("error.html");
  }
  
  leading_zeros = confirmed_ts.filter(x => x = 0).length
  confirmed_ts = confirmed_ts.slice(leading_zeros, confirmed_ts.length)
  last_day = confirmed_ts[confirmed_ts.length - 1] - confirmed_ts[confirmed_ts.length - 2]
  document.getElementById("last_day").innerHTML = last_day
  confirmed_cases = confirmed_ts[confirmed_ts.length - 1]
  document.getElementById("confirmed_cases").innerHTML = confirmed_cases
  
  
  labels = confirmed_ts_data[0].slice(4 + leading_zeros, confirmed_ts_data[0].length)
  
  let chart_ts_data = {
    type: 'line',
    data: {
      labels: labels,
      
      datasets: [{
        label: "Cases",
        backgroundColor: "#cc0000",
        pointBackgroundColor: "#FFFF00",
        pointRadius: 0,
        fill: true,
        data: confirmed_ts,
      }],
    },
    options: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: false
      },
      responsive: true,
      
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
          
        }],
        yAxes: [{
          display: true,
          legend: {
            position: 'bottom'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          ticks: {
            min: 0, //minimum tick
            callback: function (value, index, values) {
              return Number(value.toString());
            }
          },
          type: 'logarithmic',
        }]
      }
    }
  }
  chart_ts = new Chart(ctx, chart_ts_data);
  
  let chart_new_cases_data = {
    type: 'bar',
    data: {
      labels: labels.slice((labels.length - 7), labels.length),
      
      datasets: [{
        label: "New Cases",
        backgroundColor: "#cc0000",
        pointRadius: 5,
        fill: true,
        data: [
          confirmed_ts[confirmed_ts.length - 7] - confirmed_ts[confirmed_ts.length - 8],
          confirmed_ts[confirmed_ts.length - 6] - confirmed_ts[confirmed_ts.length - 7],
          confirmed_ts[confirmed_ts.length - 5] - confirmed_ts[confirmed_ts.length - 6],
          confirmed_ts[confirmed_ts.length - 4] - confirmed_ts[confirmed_ts.length - 5],
          confirmed_ts[confirmed_ts.length - 3] - confirmed_ts[confirmed_ts.length - 4],
          confirmed_ts[confirmed_ts.length - 2] - confirmed_ts[confirmed_ts.length - 3],
          confirmed_ts[confirmed_ts.length - 1] - confirmed_ts[confirmed_ts.length - 2]
        ],
      }],
    },
    options: {
      
      legend: {
        display: false
      },
      responsive: true,
      
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
          
        }],
        yAxes: [{
          display: true,
          legend: {
            position: 'bottom'
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          ticks: {
            min: 0, //minimum tick
            callback: function (value, index, values) {
              return Number(value.toString());
            }
          },
          type: 'linear',
        }]
      }
    }
  }

  chart_new_cases = new Chart(cty, chart_new_cases_data);

  
}





$(function () {
  $("#loc").autocomplete({
    source: list_of_places,
    autoFocus: true,
    select: function (event, ui) {
      $(this).val(ui.item.value);
      form.submit();
    }
  })})
