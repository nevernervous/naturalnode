/**
 * Created by Boleslaw on 1/13/2017.
 */
var monthlyData;

function requestData() {
    $.get('/admin/monthlyData',function (data, status) {
        if(status == 'success') {
            Highcharts.chart( {
                chart: {
                    renderTo: 'chart-quote',
                    // defaultSeriesType: 'spline',
                    // events: {
                    //     load: requestData
                    // }
                },
                title: {
                    text: 'Number of requests',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Quotes & Samples',
                    x: -20
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                // tooltip: {
                //     valueSuffix: '°C'
                // },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Quotes',
                    data: data.quotes
                }, {
                    name: 'Samples',
                    data: data.samples
                }]
            });
        }
    });
}

$(function () {
    requestData();
});