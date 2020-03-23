const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let loc = urlParams.get('loc')
let country = ""
let region = ""
let last_day
let confirmed_cases


if (loc == null) {
  country = "US"
  loc = "US"
}
else {
  if (loc.includes("|")) {
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

document.getElementById("header-title").innerHTML = "COVID-19: Graph The Curve - " + loc.toString()
document.getElementById("loc-region").innerHTML = loc.toString()

const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"

list_of_places = new Array;
filtered_list_of_places = new Array;
let data;

const csvdata = Papa.parse(url, {
  download: true,
  dynamicTyping: true,
  complete: function (results) {
    data = results.data;

    for (i = 1; i < data.length; i++) {

      if (data[i][0] != null) {
        if (!list_of_places.includes(data[i][1]))
          list_of_places.push(data[i][1])
        list_of_places.push(data[i][1] + " | " + data[i][0])
      }
      else if (data[i][1] != null || data[i][1] != "")
        list_of_places.push(data[i][1])

    }


    list_of_places.push("United States of America")
    var ctx = document.getElementById('canvas_ts').getContext('2d');
    var cty = document.getElementById('canvas_new_cases').getContext('2d');

    let ts = new Array;
    for (i = 0; i < data.length; i++) {
      if (data[i][1] == country) {
        if (ts.length > 0 && region == "") {
          temp = data[i].slice(4, data[i].length)
          for (j = 0; j < temp.length; j++) {
            ts[j] += temp[j]
          }
        }
        else if (region != "" && region != data[i][0])
          continue
        else
          ts = data[i].slice(4, data[i].length)
        //region = data[i][0]
      }

    }

    leading_zeros = ts.filter(x => x = 0).length
    ts = ts.slice(leading_zeros, ts.length)
    last_day = ts[ts.length - 1] - ts[ts.length - 2]
    document.getElementById("last_day").innerHTML = last_day
    confirmed_cases = ts[ts.length - 1]
    document.getElementById("confirmed_cases").innerHTML = confirmed_cases


    labels = data[0].slice(4 + leading_zeros, data[0].length)


    var chart_ts = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,

        datasets: [{
          label: loc,
          backgroundColor: "#cc0000",
          pointBackgroundColor: "#FFFF00",
          pointRadius: 0,
          fill: true,
          data: ts,
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
    });

    var chart_new_cases = new Chart(cty, {
      type: 'bar',
      data: {
        labels: labels.slice((labels.length - 7), labels.length),

        datasets: [{
          label: "New Cases",
          backgroundColor: "#cc0000",
          pointRadius: 5,
          fill: true,
          data: [
            ts[ts.length - 7] - ts[ts.length - 8],
            ts[ts.length - 6] - ts[ts.length - 7],
            ts[ts.length - 5] - ts[ts.length - 6],
            ts[ts.length - 4] - ts[ts.length - 5],
            ts[ts.length - 3] - ts[ts.length - 4],
            ts[ts.length - 2] - ts[ts.length - 3],
            ts[ts.length - 1] - ts[ts.length - 2]
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
    });


  } // complete

});

$(function () {
  $("#loc").autocomplete({
    source: list_of_places,
    select: function (event, ui) {
      $(this).val(ui.item.value);
      form.submit();
    }
  }
  );
});
