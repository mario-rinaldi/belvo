// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function buildAreaChart(labels, data) {
  var ctx = document.getElementById("myAreaChart");
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: "Earnings",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: data,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
              return '$' + number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}

function buildPieChart(labels, data, bgColor, hBgColor) {
  // Set new default font family and font color to mimic Bootstrap's default styling
  Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  // Pie Chart Example
  var ctx = document.getElementById("myPieChart");
  var myPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: bgColor,
        hoverBackgroundColor: hBgColor,
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  });
}

var userData;
var socket = io()
socket.emit('successPageLoad')
socket.on('linkInfo', (a, b) => {
    document.getElementById('linkId').innerHTML = 'Link: <b>' + a.link + '</b>';
    document.getElementById('institutionName').innerHTML = 'Connected to: <b>' + a.institution + '</b>';
    userData = b;

    //Builds cards with Account Owners API Info 
    document.getElementById('ownerName').innerHTML = '<b>' + 
      JSON.parse(userData[0]).results[0].display_name + '</b>'
    document.getElementById('document_type').innerHTML = '<b>' + 
      JSON.parse(userData[0]).results[0].document_id.document_type + '</b>'
    document.getElementById('document_number').innerHTML = '<b>' + 
      JSON.parse(userData[0]).results[0].document_id.document_number + '</b>'
    document.getElementById('email').innerHTML = '<b>' + 
      JSON.parse(userData[0]).results[0].email + '</b>'
    document.getElementById('phone_number').innerHTML = '<b>' + 
      JSON.parse(userData[0]).results[0].phone_number + '</b>'

    //Builds table with Accounts API Info
    var accountsSum = 0;
    var accountTable = "";
    for(let i = 0; i < JSON.parse(userData[1]).count; i++) {
      if(JSON.parse(userData[1]).results[i].category == 'PENSION_FUND_ACCOUNT') {
        let thisAccountSum = 0;
        accountTable += '<tr>' +
                          '<th>'+ JSON.parse(userData[1]).results[i].name +'</th>' +
                          '<th>'+ JSON.parse(userData[1]).results[i].category +'</th>' +
                          '<th>'+ JSON.parse(userData[1]).results[i].currency +'</th>'
        for(let j = 0; j < JSON.parse(userData[1]).results[i].funds_data.length; j++) {
          accountsSum += JSON.parse(userData[1]).results[i].funds_data[j].balance
          thisAccountSum += JSON.parse(userData[1]).results[i].funds_data[j].balance
        }
        accountTable +=   '<th>'+ formatter.format(thisAccountSum) +'</th>' +
                      '</tr>'
      } else {
        accountTable += '<tr>' +
                          '<th>'+ JSON.parse(userData[1]).results[i].name +'</th>' +
                          '<th>'+ JSON.parse(userData[1]).results[i].category +'</th>' +
                          '<th>'+ JSON.parse(userData[1]).results[i].currency +'</th>' +
                          '<th>'+ formatter.format(JSON.parse(userData[1]).results[i].balance.current) +'</th>' +
                      '</tr>'
        accountsSum += JSON.parse(userData[1]).results[i].balance.current
      }
    }
    document.getElementById('accountsTable').innerHTML = accountTable;
    document.getElementById('accountsSum').innerHTML = '<b>' + formatter.format(accountsSum) + '</b>';

    //Builds pie chart with Transactions API Info
    let pieChartData = new Array(); //currency values
    let pieChartBgColor = new Array();
    let pieChartHBgColor = new Array();
    //logic here
    let categories = new Array();
    for(let i = 0; i < JSON.parse(userData[2]).results.length; i++){
      categories[i] = JSON.parse(userData[2]).results[i].category
    }
    function onlyUniq(value, index, self) {
      return self.indexOf(value) === index;
    }
    let uniq = categories.filter(onlyUniq);
    let htSum;
    for(let i = 0; i < uniq.length; i++) {
      htSum = 0;
      for(let j = 0; j < JSON.parse(userData[2]).results.length; j++){
        if(JSON.parse(userData[2]).results[j].category == uniq[i]) {
          htSum += JSON.parse(userData[2]).results[j].amount
        }
      }
      pieChartData[i] = htSum.toFixed(2);
    }
    var colors = [
      {"name": "text-success", "colorHex": "#1cc88a", "hoverColorHex": "#13855c"},
      {"name": "text-info", "colorHex": "#36b9cc", "hoverColorHex": "#258391"},
      {"name": "text-warning", "colorHex": "#f6c23e", "hoverColorHex": "#dda20a"},
      {"name": "text-danger", "colorHex": "#e74a3b", "hoverColorHex": "#be2617"},
      {"name": "text-dark", "colorHex": "#5a5c69", "hoverColorHex": "#373840"},
      {"name": "text-secondary", "colorHex": "#858796", "hoverColorHex": "#60616f"},
      {"name": "text-light", "colorHex": "#f8f9fc", "hoverColorHex": "#c2cbe5"},
      {"name": "text-primary", "colorHex": "#4e73df", "hoverColorHex": "#224abe"}
    ]
    let pieChartLables = "";
    for(let i = 0; i < uniq.length && i < colors.length; i++) {
      pieChartBgColor[i] = colors[i].colorHex
      pieChartHBgColor[i] = colors[i].hoverColorHex
      pieChartLables += '<span class="mr-2">' +
                        '<i class="fas fa-circle ' + colors[i].name + '"></i> ' + uniq[i] + '</span>'             
    }
    document.getElementById('pieChartLables').innerHTML = pieChartLables;
    buildPieChart(uniq, pieChartData, pieChartBgColor, pieChartHBgColor);

    //Builds area chart with Incomes API Info
    let areaChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];//new Array(); //dates
    let areaChartData = [0, 1500, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 150000];//new Array(); //currency values
    let transactions = new Array();
    let idx = 0;
    for(let i = 0; i < JSON.parse(userData[3])[0].sources.length; i++) {
      for(let j = 0; j < JSON.parse(userData[3])[0].sources[i].transactions.length; j++) {
        transactions[idx] = { "date": JSON.parse(userData[3])[0].sources[i].transactions[j].value_date,
                              "month": new Date(JSON.parse(userData[3])[0].sources[i].transactions[j].value_date).getUTCMonth() + 1,
                              "year": new Date(JSON.parse(userData[3])[0].sources[i].transactions[j].value_date).getUTCFullYear(),
                              "amount": JSON.parse(userData[3])[0].sources[i].transactions[j].amount
                            }
        idx++
      }
    }

    let incomeSum = new Array(12);
    for(let i = 0; i < 12; i++) {
      incomeSum[i] = 0;
      for(let j = 0; j < transactions.length; j++){
        if(transactions[j].month == i + 1 && transactions[j].year == new Date().getUTCFullYear()) {
          incomeSum[i] += parseFloat(transactions[j].amount);
        }
      }
    }
    document.getElementById('areaChartTitle').innerHTML = 'Income Overview ' + new Date().getUTCFullYear();
    buildAreaChart(areaChartLabels, incomeSum)
})