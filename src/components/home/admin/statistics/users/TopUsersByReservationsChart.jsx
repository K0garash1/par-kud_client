//import "./Statistics.css";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

// eslint-disable-next-line react/prop-types
function TopUsersByReservationsChart() {
  const [chart, setChart] = useState({});

  useEffect(() => {
    fetch("https://par-kudserver-production.up.railway.app/user/users-by-reservations/5")
      .then((response) => response.json())
      .then((data) => {
        setChart(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos.", error);
      });
  }, []);

  console.log("chart", chart);

  var data = {
    labels: chart?.users?.map((x) => x.userName),
    datasets: [
      {
        label: "Usuarios",
        data: chart?.users?.map((x) => x.bookings),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  var options = {
    maintainAspectRatio: false,
    scales: {},
    legend: {
      labels: {
        fontSize: 25,
      },
    },
  };

  return (
    <div>
      <Bar data={data} height={400} options={options} />
    </div>
  );
}

export default TopUsersByReservationsChart;
