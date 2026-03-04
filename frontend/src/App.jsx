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
        <p>Easy: {snapshot.easy_percent}%</p>
        <p>Medium: {snapshot.medium_percent}%</p>
        <p>Hard: {snapshot.hard_percent}%</p>
        <p>Weakest Topic: {snapshot.weakest_topic}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">Risk Flags</h2>
        <ul className="list-disc pl-6">
          {risk_flags?.map((flag, index) => (
            <li key={index}>{flag}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
        <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
      </div>
    </div>
  );
}