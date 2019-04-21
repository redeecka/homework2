import "babel-polyfill";
import Chart from "chart.js";

const meteoURL = "/xml.meteoservice.ru/export/gismeteo/point/140.xml";

const buttonBuild = document.getElementById("btn");
const canvasCtx = document.getElementById("out").getContext("2d");

buttonBuild.addEventListener("click", async function() {
  const response = await fetch (meteoURL);
  const xmlTest = await response.text();

  const parser = new DOMParser();
  const meteoData = parser.parseFromString(xmlTest, "text/xml");

  var labels_x = [];
  var arrMax = [];
  var arrMin = [];

  var forecastList = meteoData.getElementsByTagName("FORECAST");
  for (var i=0; i<forecastList.length; i++) {
    labels_x[i] = forecastList[i].getAttribute("day") + '.' + forecastList[i].getAttribute("month") + ' '+ forecastList[i].getAttribute("hour") + ':00';
    var temprElem = forecastList[i].getElementsByTagName("TEMPERATURE");
    arrMin[i] = temprElem[0].getAttribute("min");
    arrMax[i] = temprElem[0].getAttribute("max");
  }
  

  var dataMin = {
    label: "Min",
    data: arrMin,
    lineTension: 0.3,
    borderColor: ['rgba(0, 99, 132, 1)'],
    backgroundColor: ['rgba(0, 99, 132, 0)']
  };
     
  var dataMax = {
    label: "Max",
    data: arrMax,
    borderColor: ['rgba(240, 99, 132, 1)'],
    backgroundColor: ['rgba(240, 99, 132, 0)']
    // Set More Options
  };
  
  
  const chartConfig = {
    type: "line",

    data: {
      labels: labels_x,
      datasets: [dataMin, dataMax]
    }
  };

  if (window.chart) {
    chart.data.labels = chartConfig.data.labels;
    chart.data.datasets[0].data = chartConfig.data.datasets[0].data;
    chart.update({
      duration: 800,
      easing: "easeOutBounce"
    });
  } else {
    window.chart = new Chart(canvasCtx, chartConfig);
  }
});
