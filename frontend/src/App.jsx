import { useEffect, useState } from "react";
import { getAnalysis } from "./api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

export default function App() {

  const [data, setData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

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

      loadDashboard();

    } catch (err) {
      console.error(err);
    }
  }

  const snapshot = data?.snapshot;
  const risk_flags = data?.risk_flags;
  const analysis = data?.analysis;
  const insight = data?.insight;
  const skills = data?.skills || {};

  const training = data?.training || [];
  const curriculum = data?.curriculum || [];

  async function submitAttempt(problem, result) {

    try {

      await fetch("http://127.0.0.1:8000/submit-attempt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          problem: problem.title,
          topic: snapshot?.weakest_topic,
          difficulty: problem.difficulty,
          result: result,
          time_taken: 0
        })
      });

      alert("Attempt recorded");

    } catch (err) {
      console.error(err);
    }

  }

  const radarData = [
    { topic: "Array", score: skills["Array"] || 0 },
    { topic: "Tree", score: skills["Tree"] || 0 },
    { topic: "Graph", score: skills["Graph"] || 0 },
    { topic: "DP", score: skills["Dynamic Programming"] || 0 },
    { topic: "Backtracking", score: skills["Backtracking"] || 0 },
    { topic: "Heap", score: skills["Heap"] || 0 },
    { topic: "LinkedList", score: skills["Linked List"] || 0 }
  ];

  if (!snapshot) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">

        <h2 className="text-xl font-semibold">Mentora is not synced yet</h2>

        <button
          onClick={syncLeetcode}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Run First Sync
        </button>

      </div>
    );
  }

  return (

    <div className="min-h-screen w-full bg-gray-50 px-12 py-10">

      <div className="max-w-[1800px] mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm px-8 py-4 flex items-center justify-between mb-10">

          <div className="flex items-center gap-3">
            <div className="rounded-lg">
              <img src="/mentora.png" alt="Mentora" className="rounded-lg w-12 h-12" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-blue-600">
                Mentora
              </h1>
              <p className="text-xs text-gray-500">
                Autonomous AI Learning System
              </p>
            </div>
          </div>

          <button
            onClick={syncLeetcode}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Sync LeetCode
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Solved</p>
            <p className="text-3xl font-bold">{snapshot.total}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Easy</p>
            <p className="text-3xl font-bold text-green-600">
              {snapshot.easy_percent}%
            </p>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Medium</p>
            <p className="text-3xl font-bold text-yellow-600">
              {snapshot.medium_percent}%
            </p>
          </div>

          <div className="bg-red-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Hard</p>
            <p className="text-3xl font-bold text-red-600">
              {snapshot.hard_percent}%
            </p>
          </div>

        </div>


        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Progress */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Progress Over Time
              </h2>

              <ResponsiveContainer width="100%" height={320}>

                <LineChart data={progress}>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />

                  <Line type="monotone" dataKey="easy" stroke="#22c55e" strokeWidth={3} />
                  <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={3} />
                  <Line type="monotone" dataKey="hard" stroke="#ef4444" strokeWidth={3} />

                </LineChart>

              </ResponsiveContainer>

            </div>


            {/* Radar */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                DSA Skill Profile
              </h2>

              <ResponsiveContainer width="100%" height={360}>

                <RadarChart data={radarData}>

                  <PolarGrid />
                  <PolarAngleAxis dataKey="topic" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />

                  <Radar
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />

                  <Tooltip />

                </RadarChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* RIGHT COLUMN */}
          <div className="space-y-8">

            {/* Weakest */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-2 text-gray-700">
                Weakest Topic
              </h2>

              <div className="text-3xl font-bold text-red-600">
                {snapshot.weakest_topic}
              </div>

            </div>


            {/* Insight */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                AI Insight
              </h2>

              <p><b>Weak Topic:</b> {insight?.topic || "N/A"}</p>
              <p><b>Skill Level:</b> {insight?.skill_level || "N/A"}</p>
              <p><b>Today's Focus:</b> {insight?.today_focus || "N/A"}</p>

              {insight?.risk && (
                <p className="mt-2 text-red-600 text-sm">
                  ⚠ {insight.risk}
                </p>
              )}

              <button
                onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                className="text-blue-600 text-sm mt-4"
              >
                {showFullAnalysis ? "Hide Full Analysis ▲" : "Show Full Analysis ▼"}
              </button>

              {showFullAnalysis && (
                <div className="whitespace-pre-wrap text-sm text-gray-600 mt-3">
                  {(analysis || "").split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

            </div>


            {/* Training */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Today's Training
              </h2>

              {training.map((p, i) => (

                <div key={i} className="border-b py-3 flex justify-between items-center">

                  <div>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {p.title}
                    </a>

                    <span className="ml-2 text-sm text-gray-500">
                      ({p.difficulty})
                    </span>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => submitAttempt(p, "solved")}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Solved
                    </button>

                    <button
                      onClick={() => submitAttempt(p, "failed")}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Failed
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}