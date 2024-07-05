"use strict";
(function () {
    // Sample data for each hour (including zero values)
    let sampleData = [
        20, 15, 0, 1, 2, 0, 0, 10, 12, 20, 50, 0,
        20, 22, 25, 10, 0, 40, 10, 70, 20, 10, 30, 50
    ];

    // Filter out zero values from the data
    let filteredData = sampleData.filter(users => users > 0);

    // Generate categories for the x-axis labels
    let categories = [];
    for (let i = 0; i < sampleData.length; i++) {
        if (sampleData[i] > 0) {
            categories.push(`${i % 12 === 0 ? 12 : i % 12}${i < 12 ? 'am' : 'pm'}`);
        }
    }

    // Chart configuration
    let chartConfig = {
        series: [{ data: filteredData }],
        chart: {
            height: 300,
            parentHeightOffset: 0,
            stacked: true,
            type: "bar",
            toolbar: { show: false }
        },
        tooltip: { enabled: false },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%", // Changed column width to 50% for thicker bars
                dataLabels: {
                    enabled: true, // Enabled data labels on the bars
                    offsetY: -20, // Adjust the vertical offset of data labels
                    style: {
                        fontSize: "13px",
                        colors: ["#ffffff"], // Text color for data labels
                        fontFamily: "Public Sans"
                    }
                }
            }
        },
        colors: ["#7367f0"], // Setting the primary color
        stroke: { width: 0 },
        legend: {
            show: false
        },
        grid: { show: false },
        xaxis: {
            categories: categories,
            labels: { style: { fontSize: "13px", colors: "#333", fontFamily: "Public Sans" } },
            axisTicks: { show: false },
            axisBorder: { show: false }
        },
        yaxis: {
            labels: { show: false }, // Hide y-axis labels
            min: 0,
            max: 100,
            tickAmount: 10
        },
        responsive: [
            { breakpoint: 1441, options: { chart: { height: 422 } } },
            { breakpoint: 1025, options: { chart: { height: 390 } } },
            { breakpoint: 449, options: { chart: { height: 360 } } }
        ],
        states: { hover: { filter: { type: "none" } }, active: { filter: { type: "none" } } }
    };

    // Render the chart
    let chart = new ApexCharts(document.querySelector("#totalRevenueChart"), chartConfig);
    chart.render();

    // Add hover effect to bars
    let bars = document.querySelectorAll(".apexcharts-bar-area path");
    bars.forEach(bar => {
        bar.addEventListener("mouseenter", () => {
            let originalColor = bar.getAttribute("fill");
            let darkerColor = lightenDarkenColor(originalColor, -20); // Adjust the darkness level as needed
            bar.setAttribute("fill", darkerColor);
        });

        bar.addEventListener("mouseleave", () => {
            let originalColor = bar.getAttribute("fill");
            bar.setAttribute("fill", originalColor);
        });
    });

    // Function to lighten or darken a color
    function lightenDarkenColor(col, amt) {
        var usePound = false;
        if (col[0] === "#") {
            col = col.slice(1);
            usePound = true;
        }
        var num = parseInt(col, 16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    }
})();
