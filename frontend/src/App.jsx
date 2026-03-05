import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analysis")
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

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
      <h1 className="text-4xl font-bold mb-8 text-blue-600">
        Mentora Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Performance Snapshot</h2>
        <p>Total Solved: {snapshot.total}</p>
        <div className="space-y-3">

          <div>
            <p>Easy {snapshot.easy_percent}%</p>
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
            <p>Medium {snapshot.medium_percent}%</p>
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
            <p>Hard {snapshot.hard_percent}%</p>
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
        <div className="mt-4">
          <span className="text-sm text-gray-500">Weakest Topic</span>
          <div className="text-lg font-semibold text-red-600">
            {snapshot.weakest_topic}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Risk Flags</h2>
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

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
        <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
      </div>
    </div>
  );
}