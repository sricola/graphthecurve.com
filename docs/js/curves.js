const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let loc = urlParams.get('loc')
let country = ""
let region = ""

if (loc == null)
    country = "US"
else {
    if (loc.includes("|")){
        country = loc.split('|')[0].trim()
        region = loc.split('|')[1].trim()
        console.log(country)
        console.log(region)
    }
    else
        country = loc
}

const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv"

list_of_places = new Array;
let data;

const csvdata = Papa.parse(url, {
  download: true,
  dynamicTyping: true,
  complete: function(results) {
    data = results.data;

    for (i=1;i<data.length;i++){
      
      if (data[i][0] != null) {
        list_of_places.push(data[i][1])
        list_of_places.push(data[i][1] + " | " + data[i][0])
      }
      else
        list_of_places.push(data[i][1])
      
    }


    console.log(list_of_places)
    
    var ctx = document.getElementById('canvas').getContext('2d');
    let ts = new Array;
    for (i=0; i<data.length; i++){
      if (data[i][1] == country){
        if (ts.length > 0 && region == "") {
          temp = data[i].slice(4,data[i].length)
          for (j=0; j<temp.length; j++){
            ts[j]+=temp[j]
          }
        }
        else if (region != "" && region != data[i][0])
          continue
        else
          ts = data[i].slice(4,data[i].length)
          //region = data[i][0]
      }
      
    }
    leading_zeros = ts.filter(x => x<100).length
    ts = ts.slice(leading_zeros,ts.length)
    labels = data[0].slice(4+leading_zeros,data[0].length)


    var mychart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        
        datasets: [{
          label: country + region,
          backgroundColor: window.chartColors.red,
          pointRadius: 5,
          fill: true,
          data: ts,
        }],
      },
      options: {
        annotateDisplay: true,
        responsive: true,
        title: {
          display: true,
          text: country + "-" +region
        },
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }

          }],
          yAxes: [{
            display: true,
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
            },
            ticks: {
              min: 100, //minimum tick
              callback: function (value, index, values) {
                return Number(value.toString());
              }
            },
            type: 'logarithmic',
          }]
        }
      }
    });

   
    // console.log(mychart)
    // mychart.update.datasets.data.push(ts);
    // mychart.data.labels.push("test");
    // mychart.update();        

    
} // complete

});

array_list_of_places = Array.from(list_of_places)
console.log(array_list_of_places)
console.log(Array.from(list_of_places))
$( function() {
    $( "#loc" ).autocomplete({
      source: list_of_places,
      select: function (event, ui) {
        $(this).val(ui.item.value);
        form.submit();
    }
    }
    );
  } );
