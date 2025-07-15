import { Card } from "flowbite-react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useEffect } from "react";
import { unixToDate } from "#/api/utils";
export const ProfileWatchDynamic = (props: { watchDynamic: Array<any> }) => {
  const lastTenDays = props.watchDynamic.slice(
    Math.max(props.watchDynamic.length - 10, 0)
  );
  const data = {
    ids: lastTenDays.map((item) => item.id),
    counts: lastTenDays.map((item) => item.count),
    timestamps: lastTenDays.map((item) =>
      unixToDate(item.timestamp, "dayMonth")
    ),
  };

  const options: ApexOptions = {
    chart: {
      height: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      theme:"dark",
      x: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#1C64F2",
        gradientToColors: ["#1C64F2"],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 6,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0,
      },
    },
    series: [
      {
        name: "Серий",
        data: data.counts,
        color: "#1C64F2",
      },
    ],
    xaxis: {
      categories: data.timestamps,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  useEffect(() => {
    if (
      document.getElementById("area-chart") &&
      typeof ApexCharts !== "undefined"
    ) {
      const chart = new ApexCharts(
        document.getElementById("area-chart"),
        options
      );
      chart.render();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <h1 className="text-2xl font-bold">Динамика просмотра серий</h1>
      <div id="area-chart"></div>
    </Card>
  );
};
