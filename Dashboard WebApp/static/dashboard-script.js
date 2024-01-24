// Function to fetch data and render chart
async function fetchDataAndRenderChart(apiEndpoint, chartElementId, chartConfig) {
  try {
    // Fetch data
    let response = await fetch(apiEndpoint);
    let data = await response.json();

    // Get the latest date values
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    // Update the API endpoint with the latest date values
    const updatedApiEndpoint = `${apiEndpoint}?start_date=${startDate}&end_date=${endDate}`;

    // Render chart
    const ctx = document.getElementById(chartElementId).getContext("2d");
    new Chart(ctx, chartConfig(data));
  } catch (error) {
    console.error("Error fetching or rendering chart:", error);
  }
}

// Function to handle date changes and update the revenue chart
async function handleRevenueChartDateChange() {
  try {
    // Get the latest date values
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    // Update the API endpoint with the latest date values
    const updatedApiEndpoint = `/api/revenue_generation?start_date=${startDate}&end_date=${endDate}`;

    // Fetch data
    let response = await fetch(updatedApiEndpoint);
    let data = await response.json();

    // Render chart
    const ctx = document.getElementById("revenueChart").getContext("2d");
    new Chart(ctx, {
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
handleRevenueChartDateChange();

// Fetch and render other charts
fetchDataAndRenderChart("/api/orders_over_time", "ordersChart", (data) => ({
  type: "line",
  data: {
    labels: data.dates,
    datasets: [
      {
        label: "Number of Orders",
        data: data.counts,
        // ... other config
      },
    ],
  },
  // ... other options
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

fetchDataAndRenderChart("/api/most_popular_products", "popularProductsChart", (data) => ({
  type: "bar",
  data: {
    labels: data.map((item) => item.product_name),
    datasets: [
      {
        label: "Quantity Sold",
        data: data.map((item) => item.total_quantity),
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

fetchDataAndRenderChart("/api/product_category_popularity", "categoryPopularityChart", (data) => ({
  type: "pie",
  data: {
    labels: data.categories,
    datasets: [
      {
        label: "Total Sales",
        data: data.sales,
        // ... other config
      },
    ],
  },
}));

fetchDataAndRenderChart("/api/payment_method_popularity", "paymentMethodChart", (data) => ({
  type: "pie",
  data: {
    labels: data.methods,
    datasets: [
      {
        label: "Transaction Count",
        data: data.counts,
        // ... other config
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
}));

fetchDataAndRenderChart("/api/temperature_over_time", "temperatureChart", (data) => ({
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
  // ... other options can be added as needed
}));