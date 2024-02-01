// Global variable to manage the revenue chart instance
let revenueChartInstance = null;

// Function to fetch data and render a chart
async function fetchDataAndRenderChart(
  apiEndpoint,
  chartElementId,
  chartConfig
) {
  try {
    // Fetching the start and end dates from the document
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    // Updating the API endpoint with the date values
    const updatedApiEndpoint = `${apiEndpoint}?start_date=${startDate}&end_date=${endDate}`;

    let response = await fetch(updatedApiEndpoint);
    let data = await response.json();

    // Check if we're updating the revenue chart and if an instance exists
    if (chartElementId === "revenueChart" && revenueChartInstance) {
      // Destroy the existing chart instance to avoid conflicts
      revenueChartInstance.destroy();
      revenueChartInstance = null;
    }

    const ctx = document.getElementById(chartElementId).getContext("2d");
    const newChart = new Chart(ctx, chartConfig(data));

    // If we're updating the revenue chart, store the new instance
    if (chartElementId === "revenueChart") {
      revenueChartInstance = newChart;
    }
  } catch (error) {
    console.error("Error fetching or rendering chart:", error);
  }
}

let defaultStartDate = "2023-05-03";
let defaultEndDate = "2023-08-29";
document.getElementById("start-date").value = defaultStartDate;
document.getElementById("end-date").value = defaultEndDate;

// Function to handle date changes and update the revenue chart
async function handleRevenueChartDateChange() {
  try {
      // Fetching the start and end dates from the document
      const startDate = document.getElementById("start-date").value;
      const endDate = document.getElementById("end-date").value;

      // Updating the API endpoint with the date values
      const updatedApiEndpoint = `/api/revenue_generation?start_date=${startDate}&end_date=${endDate}`;

      let response = await fetch(updatedApiEndpoint);
      let data = await response.json();

      // Check if an instance of the revenue chart exists
      if (revenueChartInstance) {
          // Destroy the existing chart instance to avoid conflicts
          revenueChartInstance.destroy();
          revenueChartInstance = null;
      }

      const ctx = document.getElementById("revenueChart").getContext("2d");
      // Creating a new chart instance and storing it globally
      revenueChartInstance = new Chart(ctx, {
          type: "line",
          data: {
              labels: data.dates,
              datasets: [
                  {
                      label: "Total Revenue",
                      data: data.revenues,
                      // ... other config
                  },
              ],
          },
          // ... other options
      });
  } catch (error) {
      console.error("Error fetching or rendering chart:", error);
  }
}

// Function to open feedback form
function openFeedbackForm() {
  // Replace the window.location.href with your form URL
  window.open("https://forms.office.com/e/QE9MjcYi6s", "_blank");
}

// Add event listener for date picker changes
document.getElementById("start-date").addEventListener("change", handleRevenueChartDateChange);
document.getElementById("end-date").addEventListener("change", handleRevenueChartDateChange);

// Initial revenue chart render on page load
document.addEventListener("DOMContentLoaded", () => {
    // Set default date values
    document.getElementById("start-date").value = defaultStartDate;
    document.getElementById("end-date").value = defaultEndDate;

    // Render revenue chart
    handleRevenueChartDateChange();
});

// Fetch and render other charts
fetchDataAndRenderChart("/api/orders_over_time", "ordersChart", (data) => ({
  type: "line",
  data: {
    labels: data.dates,
    datasets: [
      {
        label: "Number of Orders",
        data: data.counts,
      },
    ],
  },
}));

fetchDataAndRenderChart("/api/low_stock_levels", "stockChart", (data) => ({
  type: "bar",
  data: {
    labels: data.products,
    datasets: [
      {
        label: "Low Stock",
        data: data.quantities,
        // ... other config
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        display: false,
      },
    },
  },
}));

fetchDataAndRenderChart(
  "/api/most_popular_products",
  "popularProductsChart",
  (data) => ({
    type: "bar",
    data: {
      labels: data.map((item) => item.product_name),
      datasets: [
        {
          label: "Quantity Sold",
          data: data.map((item) => item.total_quantity),
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          display: false,
        },
      },
    },
  })
);

fetchDataAndRenderChart(
  "/api/product_category_popularity",
  "categoryPopularityChart",
  (data) => ({
    type: "pie",
    data: {
      labels: data.categories,
      datasets: [
        {
          label: "Total Sales",
          data: data.sales,
        },
      ],
    },
  })
);

fetchDataAndRenderChart(
  "/api/payment_method_popularity",
  "paymentMethodChart",
  (data) => ({
    type: "pie",
    data: {
      labels: data.methods,
      datasets: [
        {
          label: "Transaction Count",
          data: data.counts,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: false,
        },
      },
    },
  })
);

fetchDataAndRenderChart(
  "/api/temperature_over_time",
  "temperatureChart",
  (data) => ({
    type: "line",
    data: {
      labels: data.daily.time,
      datasets: [
        {
          label: "Temperature (°C)",
          data: data.daily.temperature_2m_max,
          borderColor: "rgba(255, 0, 0, 1)",
          backgroundColor: "rgba(200, 0, 192, 0.2)",
          fill: false,
        },
      ],
    },
  })
);
