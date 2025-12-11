import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/Card";
import { Calendar, TrendingUp, ShoppingBag } from "lucide-react";
import { fetchSalesReport } from "../../library/services/report_service";

export default function SalesReport() {
  const [filter, setFilter] = useState("daily");
  const [reportData, setReportData] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);

  useEffect(() => {
    const getReport = async () => {
      const data = await fetchSalesReport(filter);
      setReportData(data.reportData || []);
      setMostOrdered(data.mostOrdered || []);
    };
    getReport();
  }, [filter]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          Sales Report
        </h1>
        <div className="flex gap-2">
          {["daily", "weekly", "monthly"].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 rounded-md font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                filter === period
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilter(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">
              {reportData.reduce((sum, r) => sum + r.orders, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold">
              Rs. {reportData.reduce((sum, r) => sum + r.total, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Selected Period</p>
            <p className="text-lg font-semibold capitalize">{filter}</p>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Total Orders</th>
                <th className="px-4 py-2 text-left">Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((r, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{r._id}</td>
                  <td className="px-4 py-2">{r.orders}</td>
                  <td className="px-4 py-2">Rs. {r.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Most Ordered Items */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            Most Ordered Items
          </h2>
          <ul className="divide-y divide-gray-200">
            {mostOrdered.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg"
              >
                <span>{item.name}</span>
                <span className="font-semibold">{item.qty} orders</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
