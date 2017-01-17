/**
 * Created by Boleslaw on 1/13/2017.
 */

var item_show_mode = 0;
var monthCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @return {number}
 */
function SortByDate(a, b){
    return new Date(a.date) - new Date(b.date);
}

function requestMonthData() {
    $.get('/admin/monthlyData',function (data, status) {
        if(status == 'success') {
            Highcharts.chart( {
                chart: {
                    renderTo: 'chart-quote',
                    // defaultSeriesType: 'spline',
                    // events: {
                    //     load: requestMonthData
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
                    categories: monthCategories
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
                //     valueSuffix: ''
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

function requestweekData() {
    $.get('/admin/weeklyData',function (data, status) {
        if(status == 'success') {
            data.quotes.sort(SortByDate);
            data.samples.sort(SortByDate);
            var quotes = [];
            var samples = [];
            data.quotes.forEach(function (element) {
                quotes.push(element.count);
            });
            data.samples.forEach(function (element) {
                samples.push(element.count);
            });
            Highcharts.chart( {
                chart: {
                    renderTo: 'chart-quote',
                    // defaultSeriesType: 'spline',
                    // events: {
                    //     load: requestMonthData
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
                    categories: data.categories
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
                //     valueSuffix: ''
                // },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Quotes',
                    data: quotes
                }, {
                    name: 'Samples',
                    data: samples
                }]
            });
        }
    });
}

function requestItemNames() {
    $.get('/admin/itemNames', function (data, status) {
        if(status == 'success') {
            for(var i = 0; i < data.length; i++) {
                $('#item_names')
                    .append($("<option></option>")
                        .attr("value",data[i]._id.id_product)
                        .text(data[i]._id.title_product));
            }
            requestSelectedItemData();
        }
    })
}

function requestSelectedItemData() {
    var url = '/admin/';
    if(item_show_mode == 0) {
        url += 'itemMonthData';
    }else {
        url += 'itemWeekData';
    }

    url += '?id=' + $('#item_names').val();
    var scrollTop = document.body.scrollTop;
    console.log(scrollTop);
    $.get(url, function (data, status) {
        if(status == 'success') {
            var quotes = [];
            var samples = [];
            if(item_show_mode == 1) {
                data.quotes.sort(SortByDate);
                data.samples.sort(SortByDate);
                data.quotes.forEach(function (element) {
                    quotes.push(element.count);
                });
                data.samples.forEach(function (element) {
                    samples.push(element.count);
                });
            } else {
                quotes = data.quotes;
                samples = data.samples;
            }
            Highcharts.chart( {
                chart: {
                    renderTo: 'chart-item',
                    // defaultSeriesType: 'spline',
                    // events: {
                    //     load: requestMonthData
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
                    categories: !item_show_mode ? monthCategories : data.categories
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
                //     valueSuffix: ''
                // },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Quotes',
                    data: quotes
                }, {
                    name: 'Samples',
                    data: samples
                }]
            });
        }
        document.body.scrollTop = scrollTop;

    });
}

$(function () {
    requestMonthData();
    requestItemNames();

    $('#quote_month_opt').click(function () {
        requestMonthData();
        return false;
    });

    $('#quote_week-opt').click(function () {
        requestweekData();
        return false;
    });

    $('#item_month_opt').click(function () {
        item_show_mode = 0;
        requestSelectedItemData();
    });

    $('#item_week-opt').click(function () {
        item_show_mode = 1;
        requestSelectedItemData();
    });

    $('#item_names').change(function () {
        console.log('change');
        requestSelectedItemData();
    })
    ;
});

