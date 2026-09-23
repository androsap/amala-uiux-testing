jQuery(function($){

    var canvas = document.getElementById('memberChart');
    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Amala Member ",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(0,61,122,0.4)",
                borderColor: "rgba(0,61,122,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(0,61,122,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(0,61,122,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: [65, 59, 80, 0, 56, 55, 40],
            }
        ]
    };

    var option = {
        showLines: true
    };
    var myLineChart = Chart.Line(canvas,{
        data:data,
        options:option
    });

    function adddata(){
        myLineChart.data.datasets[0].data[7] = 50;
        myLineChart.data.labels[7] = "lms";
        myLineChart.update();
    }




// bar chart

    /*var numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    var dataPack1 = [40, 47, 44, 38, 27, 31];
    var dataPack2 = [10, 12, 7, 5, 4, 6];
    var dataPack3 = [17, 11, 22, 18, 12, 7];
    var dates = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];



    var bar_ctx = document.getElementById('bar-chart');
    var bar_chart = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'VIP',
                        data: dataPack1,
                        backgroundColor: "#258Cb9",
                        hoverBackgroundColor: "#2a8ff4",
                        hoverBorderWidth: 0
                    },
                    {
                        label: 'EC+',
                        data: dataPack2,
                        backgroundColor: "#ff4900",
                        hoverBackgroundColor: "#a42f00",
                        hoverBorderWidth: 0
                    },
                    {
                        label: 'Fresh Blue',
                        data: dataPack3,
                        backgroundColor: "#2a8ff4",
                        hoverBackgroundColor: "#56abff",
                        hoverBorderWidth: 0
                    },
                ]
            },
            options: {
                animation: {
                    duration: 10,
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function(value) { return numberWithCommas(value); },
                        },
                    }],
                }, // scales
                legend: {display: true}
            } // options
        }
    );*/


    // 3rd chart
    var ctx = document.getElementById("accrualChart").getContext('2d');
    var accrualChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Airline", "Non Air", "Private", "Other"],
            datasets: [{
                backgroundColor: [
                    "#00f372",
                    "#03a9f4",
                    "#962aea",
                    "#ffcc00"
                ],
                data: [12, 19, 3, 17]
            }]
        }
    });


    // multi
    var lineChartData = {
        labels: ["January", "February", "March", "April", "May", "June"],
        option: {
            legend: {
                position: 'bottom',
            }
        },
        datasets: [{
            label: "Airline Redemption",
            data: [50, 85, 56, 50, 60, 70],
            yAxisID: "y-axis-1",
            borderColor: "#03a9f4"
        }, {
            label: "Non airline Redemption",
            data: [35, 45, 75, 40, 55, 73],
            yAxisID: "y-axis-2",
            borderColor: "#972aea"
        }]
    };


    var ctx = document.getElementById("redemptChart").getContext("2d");
    window.myLine = Chart.Line(ctx, {
        data: lineChartData,
        options: {
            responsive: true,
            hoverMode: 'label',
            stacked: false,
            title: {
                display: false,
                text: 'Redemption - Amala'
            },
            animation: {
                duration: 0
            },
            legend: {
                display: false,
                position: 'bottom',
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        offsetGridLines: false
                    }
                }],
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-1",
                    scaleLabel: {
                        display: true,
                        labelString: "Airline"
                    }
                }, {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    scaleLabel: {
                        display: true,
                        labelString: "Non Airline",
                    },

                    gridLines: {
                        drawOnChartArea: false,
                    },
                }],
            }
        }
    });







});