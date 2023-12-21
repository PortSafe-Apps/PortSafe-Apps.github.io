// Sample data
const mainChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [{
        label: "Total Violations",
        data: [10, 20, 15, 25, 30],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
    }]
};

const breakdownChartData = {
    labels: ["Location A", "Location B", "Location C", "Location D"],
    datasets: [{
        label: "Violations by Location",
        data: [5, 10, 8, 12],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 159, 64, 1)", "rgba(255, 205, 86, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1
    }]
};

const areaChartData = {
    labels: ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6"],
    datasets: [{
        label: "Violations by Area",
        data: [15, 18, 25, 10, 12, 20],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 159, 64, 1)", "rgba(255, 205, 86, 1)", "rgba(54, 162, 235, 1)", "rgba(153, 102, 255, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1
    }]
};

const unitChartData = {
    labels: ["Unit 1", "Unit 2", "Unit 3"],
    datasets: [{
        label: "Violations by Unit",
        data: [8, 15, 10],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 159, 64, 1)", "rgba(255, 205, 86, 1)"],
        borderWidth: 1
    }]
};

const subUnitChartData = {
    labels: ["Sub-Unit A", "Sub-Unit B", "Sub-Unit C"],
    datasets: [{
        label: "Violations by Sub-Unit",
        data: [4, 6, 8],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 159, 64, 1)", "rgba(255, 205, 86, 1)"],
        borderWidth: 1
    }]
};

// Function to create chart
function createChart(chartId, chartData, chartType, clickCallback) {
    const ctx = document.getElementById(chartId).getContext("2d");
    const chart = new Chart(ctx, {
        type: chartType,
        data: chartData
    });

    // Add click event listener
    document.getElementById(chartId).onclick = function(event) {
        const activePoints = chart.getElementsAtEvent(event);
        if (activePoints.length > 0 && clickCallback) {
            const clickedIndex = activePoints[0]._index;
            clickCallback(clickedIndex);
        }
    };
}

// Create main chart
createChart("mainChart", mainChartData, "line", function(index) {
    // Implement breakdown chart based on the clicked index
    createChart("breakdownChart", breakdownChartData, "horizontalBar", function(index) {
        // Implement area chart based on the clicked index
        createChart("areaChart", areaChartData, "bar", function(index) {
            // Implement unit chart based on the clicked index
            createChart("unitChart", unitChartData, "pie", function(index) {
                // Implement sub-unit chart based on the clicked index
                createChart("subUnitChart", subUnitChartData, "doughnut", function(index) {
                    // Implement further breakdown or action based on the sub-unit chart
                    alert(`You clicked on Sub-Unit: ${subUnitChartData.labels[index]}`);
                    // ...
                });
            });
        });
    });
});
