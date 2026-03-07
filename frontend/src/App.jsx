import { useEffect, useState } from "react";
import { getAnalysis } from "./api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function App() {

  const [data, setData] = useState(null);
  const [progress, setProgress] = useState([]);

  async function loadDashboard() {
    try {

      const result = await getAnalysis();
      setData(result);

      const res = await fetch("http://127.0.0.1:8000/progress");
      const progressData = await res.json();
      setProgress(progressData);

    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);


  async function syncLeetcode() {

    try {

      await fetch("http://127.0.0.1:8000/sync", {
        method: "POST"
      });

      // reload everything after sync
      loadDashboard();

    } catch (err) {
      console.error(err);
    }
  }


  const snapshot = data?.snapshot;
  const risk_flags = data?.risk_flags;
  const analysis = data?.analysis;


  if (!snapshot) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading Mentora...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-gray-100 p-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold text-blue-600">
          Mentora Dashboard
        </h1>

        <button
          onClick={syncLeetcode}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Sync LeetCode
        </button>

      </div>


      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Solved</p>
          <p className="text-2xl font-bold">{snapshot.total}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Easy</p>
          <p className="text-2xl font-bold text-green-600">
            {snapshot.easy_percent}%
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Medium</p>
          <p className="text-2xl font-bold text-yellow-600">
            {snapshot.medium_percent}%
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Hard</p>
          <p className="text-2xl font-bold text-red-600">
            {snapshot.hard_percent}%
          </p>
        </div>

      </div>


      {/* Difficulty Distribution */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Difficulty Distribution
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-sm mb-1">Easy</p>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-green-500 text-xs text-white text-center rounded"
                style={{ width: `${snapshot.easy_percent}%` }}
              >
                {snapshot.easy_percent}%
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm mb-1">Medium</p>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-yellow-500 text-xs text-white text-center rounded"
                style={{ width: `${snapshot.medium_percent}%` }}
              >
                {snapshot.medium_percent}%
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm mb-1">Hard</p>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-red-500 text-xs text-white text-center rounded"
                style={{ width: `${snapshot.hard_percent}%` }}
              >
                {snapshot.hard_percent}%
              </div>
            </div>
          </div>

        </div>

      </div>


      {/* Progress Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Progress Over Time
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={progress}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="easy"
              stroke="#22c55e"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="medium"
              stroke="#eab308"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="hard"
              stroke="#ef4444"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>


      {/* Weakest Topic */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-semibold mb-2">
          Weakest Topic
        </h2>

        <div className="text-2xl font-bold text-red-600">
          {snapshot.weakest_topic}
        </div>

      </div>


      {/* Risk Flags */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Risk Flags
        </h2>

        <div className="flex flex-wrap gap-2">

          {risk_flags?.map((flag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
            >
              {flag}
            </span>
          ))}

        </div>

      </div>


      {/* AI Analysis */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          AI Analysis
        </h2>

        <div className="whitespace-pre-wrap text-sm space-y-3">

          {(analysis || "").split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}

        </div>

      </div>

    </div>
  );
}