import { useState, useEffect, useRef } from "react";

// ============================================================================
// CONSTANTS & DATA
// ============================================================================

const TOPICS = [
  { id: "arrays", name: "Arrays & Strings", icon: "▦", difficulty: 1, subtopics: ["Two Pointers", "Sliding Window", "Prefix Sum"] },
  { id: "stack", name: "Stack & Monotonic Stack", icon: "⊟", difficulty: 2, subtopics: ["Next Greater Element", "Valid Parentheses", "Daily Temperatures"] },
  { id: "linkedlist", name: "Linked List", icon: "⊸", difficulty: 2, subtopics: ["Reversal", "Cycle Detection", "Merge"] },
  { id: "trees", name: "Trees & BST", icon: "⋔", difficulty: 3, subtopics: ["DFS/BFS", "Level Order", "BST Operations"] },
  { id: "heap", name: "Heap / Priority Queue", icon: "△", difficulty: 3, subtopics: ["Min/Max Heap", "Kth Largest", "Merge K Lists"] },
  { id: "graphs", name: "Graphs", icon: "⬡", difficulty: 4, subtopics: ["BFS/DFS", "Topological Sort", "Union Find"] },
  { id: "dp", name: "Dynamic Programming", icon: "⬛", difficulty: 5, subtopics: ["1D DP", "2D DP", "Knapsack", "LCS"] },
  { id: "backtrack", name: "Backtracking", icon: "↺", difficulty: 4, subtopics: ["Permutations", "Subsets", "N-Queens"] },
];

const CODE_EXAMPLES = {
  "Stack & Monotonic Stack": {
    title: "Next Greater Element (Monotonic Stack)",
    description: "Find the next greater element for each element in the array using monotonic stack for O(n) solution.",
    code: `// Next Greater Element using Monotonic Stack
public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Stack<Integer> stack = new Stack<>();
    
    // Initialize result with -1
    Arrays.fill(result, -1);
    
    // Traverse from right to left
    for (int i = n - 1; i >= 0; i--) {
        // Pop elements smaller than current
        while (!stack.isEmpty() && stack.peek() <= nums[i]) {
            stack.pop();
        }
        
        // If stack not empty, top is the next greater
        if (!stack.isEmpty()) {
            result[i] = stack.peek();
        }
        
        // Push current element
        stack.push(nums[i]);
    }
    
    return result;
}`,
    concept: "Monotonic Stack",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    approach: "Traverse from right to left, maintaining a monotonic decreasing stack. For each element, pop all smaller elements — the remaining top is the next greater element.",
    steps: [
      "Initialize result array with -1 (default when no greater element exists)",
      "Traverse array from RIGHT to LEFT to build the stack",
      "For current element, pop all stack values ≤ current value",
      "If stack not empty after popping, stack.peek() is the Next Greater Element",
      "Push current element onto stack for future comparisons",
      "Continue until all elements processed"
    ],
    leetcodeLinks: ["496. Next Greater Element I", "503. Next Greater Element II", "739. Daily Temperatures"]
  },
  "Dynamic Programming": {
    title: "Longest Common Subsequence (2D DP)",
    description: "Find the length of longest common subsequence between two strings using dynamic programming.",
    code: `// LCS using 2D DP
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}`,
    concept: "2D Dynamic Programming",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n)",
    approach: "Build a 2D DP table where dp[i][j] represents LCS length of text1[0..i-1] and text2[0..j-1]. If characters match, add 1 to diagonal. Otherwise, take max of top or left cell.",
    steps: [
      "Create (m+1) × (n+1) DP table initialized to 0",
      "Iterate through both strings starting from index 1",
      "If characters match: dp[i][j] = dp[i-1][j-1] + 1",
      "If characters don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
      "Final answer is at dp[m][n]"
    ],
    leetcodeLinks: ["1143. Longest Common Subsequence", "583. Delete Operation for Two Strings"]
  }
};

const QUIZZES = {
  "Stack & Monotonic Stack": [
    { q: "What is the time complexity of Next Greater Element using Monotonic Stack?", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], ans: 2 },
    { q: "In a Monotonic Decreasing Stack, elements are ordered how from bottom to top?", options: ["Increasing", "Decreasing", "Random", "Equal only"], ans: 1 },
    { q: "What does stack.peek() do?", options: ["Removes and returns top", "Returns top without removing", "Returns bottom element", "Returns stack size"], ans: 1 },
    { q: "When do we pop from stack in NGE (right→left pass)?", options: ["When stack is empty", "When current < peek", "When current ≥ peek", "Always before push"], ans: 2 },
    { q: "If no greater element exists to the right, NGE returns?", options: ["0", "null", "-1", "Integer.MAX_VALUE"], ans: 2 },
  ],
  "Dynamic Programming": [
    { q: "What is the base case for LCS DP table?", options: ["All 1s", "All 0s", "Random values", "All -1s"], ans: 1 },
    { q: "In LCS, if characters match, what do we do?", options: ["Take max of neighbors", "Add 1 to diagonal", "Set to 0", "Take min of neighbors"], ans: 1 },
    { q: "Space optimization for LCS reduces space to?", options: ["O(1)", "O(n)", "O(m × n)", "O(log n)"], ans: 1 },
    { q: "What does dp[i][j] represent in LCS?", options: ["Total string length", "LCS of text1[0..i-1] and text2[0..j-1]", "Number of mismatches", "Edit distance"], ans: 1 },
  ]
};

const COLORS = {
  bg: "#0a0a0f",
  card: "#12121a",
  border: "#1e1e2e",
  accent: "#7c3aed",
  accentLight: "#a855f7",
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  blue: "#3b82f6",
  indigo: "#6366f1",
  text: "#e2e8f0",
  muted: "#64748b",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MentoraApp() {
  // Backend data state
  const [backendData, setBackendData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [velocity, setVelocity] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTopic, setCurrentTopic] = useState("Stack & Monotonic Stack");
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  // User progress state
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(3);
  const [sessions, setSessions] = useState([
    { date: new Date().toISOString().split("T")[0], topic: "Stack Basics", duration: 45, notes: "Learned Next Greater Element", score: 75 }
  ]);

  // Quiz state
  const [quiz, setQuiz] = useState({ active: false, index: 0, selected: null, score: 0, done: false });
  const [quizHistory, setQuizHistory] = useState([]);

  // Chat state
  const [chatHistory, setChatHistory] = useState([
    { role: "tutor", text: "👋 Welcome to Mentora! I'm your personal DSA tutor. I've analyzed your LeetCode performance and I'm here to help you improve. Ask me anything about DSA concepts, share your code for review, or ask what to study next!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Session logging
  const [logForm, setLogForm] = useState({ topic: "", duration: "", notes: "", score: "" });

  // ============================================================================
  // EFFECTS & DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadBackendData();
    loadUserProgress();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  async function loadBackendData() {
    try {
      // Fetch from your existing backend
      const analysisRes = await fetch("http://127.0.0.1:8000/analysis");
      const analysisData = await analysisRes.json();
      setBackendData(analysisData);

      const progressRes = await fetch("http://127.0.0.1:8000/progress");
      const progressData = await progressRes.json();
      setProgress(progressData);

      const velocityRes = await fetch("http://127.0.0.1:8000/velocity");
      const velocityData = await velocityRes.json();
      setVelocity(velocityData);

      // Set current topic based on weakest area
      if (analysisData?.snapshot?.weakest_topic) {
        setCurrentTopic(analysisData.snapshot.weakest_topic);
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
      // Use mock data if backend not available
      setBackendData({
        snapshot: { total: 150, easy_percent: 65, medium_percent: 35, hard_percent: 15, weakest_topic: "Stack & Monotonic Stack" },
        skills: { "Array": 75, "Stack": 45, "Dynamic Programming": 30, "Graph": 25 },
        risk_flags: ["Difficulty stagnation", "Topic avoidance: DP"],
        insight: { topic: "Stack", skill_level: "Early Intermediate", today_focus: "Monotonic Stack patterns" }
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProgress() {
    try {
      const result = localStorage.getItem("mentora_progress");

      if (result) {
        const data = JSON.parse(result);
        setXp(data.xp || 120);
        setStreak(data.streak || 3);
        setSessions(data.sessions || []);
        setQuizHistory(data.quizHistory || []);
      }
    } catch (err) {
      console.log("Using default progress data");
    }
  }

  async function saveUserProgress() {
    try {
      localStorage.setItem(
        "mentora_progress",
        JSON.stringify({ xp, streak, sessions, quizHistory })
      );
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  useEffect(() => {
    saveUserProgress();
  }, [xp, streak, sessions, quizHistory]);

  async function syncLeetcode() {
    try {
      await fetch("http://127.0.0.1:8000/sync", { method: "POST" });
      await loadBackendData();
      addActivity("Synced LeetCode data", 10);
    } catch (err) {
      console.error("Sync error:", err);
    }
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  function addActivity(activity, earnedXp) {
    setXp(x => x + earnedXp);
    const newSession = {
      date: new Date().toISOString().split("T")[0],
      topic: activity,
      duration: 0,
      notes: activity,
      score: 0
    };
    setSessions(s => [newSession, ...s.slice(0, 19)]);
  }

  function copyCode() {
    const example = CODE_EXAMPLES[currentTopic];
    if (example) {
      navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addActivity(`Copied ${example.title} code`, 5);
    }
  }

  // ============================================================================
  // QUIZ FUNCTIONS
  // ============================================================================

  function startQuiz() {
    setQuiz({ active: true, index: 0, selected: null, score: 0, done: false });
    setActiveTab("learn");
  }

  function answerQuestion(idx) {
    if (quiz.selected !== null) return;
    setQuiz(q => ({ ...q, selected: idx }));
  }

  function nextQuestion() {
    const quizData = QUIZZES[currentTopic] || QUIZZES["Stack & Monotonic Stack"];
    const correct = quiz.selected === quizData[quiz.index].ans;
    const newScore = quiz.score + (correct ? 1 : 0);

    if (quiz.index + 1 >= quizData.length) {
      const earnedXp = newScore * 15;
      setXp(x => x + earnedXp);
      setQuizHistory(h => [...h, { date: new Date().toLocaleDateString(), topic: currentTopic, score: newScore, total: quizData.length }]);
      setQuiz(q => ({ ...q, done: true, score: newScore }));
      addActivity(`${currentTopic} Quiz: ${newScore}/${quizData.length}`, earnedXp);
    } else {
      setQuiz(q => ({ ...q, index: q.index + 1, selected: null, score: newScore }));
    }
  }

  // ============================================================================
  // CHAT FUNCTIONS
  // ============================================================================

  async function sendChatMessage() {
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    const newHistory = [...chatHistory, { role: "user", text: userMsg }];
    setChatHistory(newHistory);

    try {
      // Prepare context
      const snapshot = backendData?.snapshot || {};
      const skills = backendData?.skills || {};

      // Call YOUR backend (not Anthropic directly)
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, text: m.text })),
          context: {
            snapshot: snapshot,
            skills: skills,
            current_topic: currentTopic
          }
        })
      });

      const result = await response.json();

      if (result.status === "success") {
        setChatHistory([...newHistory, { role: "tutor", text: result.reply }]);
        addActivity("Chat with AI tutor", 5);
      } else {
        setChatHistory([...newHistory, { role: "tutor", text: `Error: ${result.reply || result.message}` }]);
      }

    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory([...newHistory, { role: "tutor", text: "Connection error. Make sure backend is running." }]);
    } finally {
      setChatLoading(false);
    }
  }

  // ============================================================================
  // SESSION LOGGING
  // ============================================================================

  function logSession() {
    if (!logForm.topic || !logForm.duration) return;

    const session = {
      date: new Date().toISOString().split("T")[0],
      topic: logForm.topic,
      duration: parseInt(logForm.duration),
      notes: logForm.notes,
      score: parseInt(logForm.score) || 0
    };

    setSessions([session, ...sessions]);
    setStreak(s => s + 1);
    addActivity(`Logged session: ${logForm.topic}`, 20);
    setLogForm({ topic: "", duration: "", notes: "", score: "" });
  }

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const snapshot = backendData?.snapshot || { total: 0, easy_percent: 0, medium_percent: 0, hard_percent: 0 };
  const skills = backendData?.skills || {};
  const riskFlags = backendData?.risk_flags || [];
  const training = backendData?.training || [];

  const level = xp < 200 ? "Beginner" : xp < 500 ? "Intermediate" : "Advanced";
  const levelColor = xp < 200 ? COLORS.yellow : xp < 500 ? COLORS.indigo : COLORS.green;
  const progressPct = Math.min((xp / 1000) * 100, 100);

  const quizAvg = quizHistory.length
    ? Math.round(quizHistory.reduce((a, b) => a + (b.score / b.total) * 100, 0) / quizHistory.length)
    : -1;

  const totalStudyTime = sessions.reduce((a, s) => a + s.duration, 0);
  const avgScore = sessions.filter(s => s.score > 0).length
    ? Math.round(sessions.filter(s => s.score > 0).reduce((a, s) => a + s.score, 0) / sessions.filter(s => s.score > 0).length)
    : 0;

  const currentExample = CODE_EXAMPLES[currentTopic] || CODE_EXAMPLES["Stack & Monotonic Stack"];
  const currentQuiz = QUIZZES[currentTopic] || QUIZZES["Stack & Monotonic Stack"];

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderDashboard = () => (
    <div>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Solved", value: snapshot.total, color: COLORS.accent },
          { label: "Easy", value: `${snapshot.easy_percent}%`, color: COLORS.green },
          { label: "Medium", value: `${snapshot.medium_percent}%`, color: COLORS.yellow },
          { label: "Hard", value: `${snapshot.hard_percent}%`, color: COLORS.red },
          { label: "Your XP", value: xp, color: levelColor },
          { label: "Streak", value: `${streak} days`, color: COLORS.yellow },
        ].map(stat => (
          <div key={stat.label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Current Focus */}
      <div style={{ background: `linear-gradient(135deg, #1a0a2e, ${COLORS.card})`, border: `1px solid ${COLORS.accent}44`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: COLORS.accentLight, letterSpacing: 2, marginBottom: 8 }}>▶ CURRENT FOCUS</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{snapshot.weakest_topic || currentTopic}</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 12 }}>Your weakest area — master this before advancing</div>
        <button onClick={() => { setCurrentTopic(snapshot.weakest_topic || currentTopic); setActiveTab("learn"); }}
          style={{ background: COLORS.accent, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
          Start Learning →
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { label: "💻 Learn Code", sub: "Study solutions", color: COLORS.indigo, onClick: () => setActiveTab("learn") },
          { label: "🎯 Take Quiz", sub: `+${currentQuiz.length * 15} XP`, color: COLORS.blue, onClick: startQuiz },
          { label: "💬 Ask Tutor", sub: "Get AI help", color: COLORS.accentLight, onClick: () => setActiveTab("tutor") },
          { label: "📊 View Progress", sub: "Track stats", color: COLORS.green, onClick: () => setActiveTab("progress") },
        ].map(btn => (
          <button key={btn.label} onClick={btn.onClick}
            style={{ background: COLORS.card, border: `1px solid ${btn.color}40`, color: btn.color, borderRadius: 8, padding: 14, cursor: "pointer", fontSize: 12, fontFamily: "inherit", textAlign: "center" }}>
            <div>{btn.label}</div>
            <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 5 }}>{btn.sub}</div>
          </button>
        ))}
      </div>

      {/* Skills & Risk Flags */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>💪 Topic Mastery</div>
          {Object.entries(skills).slice(0, 6).map(([topic, score]) => (
            <div key={topic} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: COLORS.text }}>{topic}</span>
                <span style={{ color: score >= 70 ? COLORS.green : score >= 40 ? COLORS.yellow : COLORS.red, fontWeight: 600 }}>{score}%</span>
              </div>
              <div style={{ height: 6, background: COLORS.border, borderRadius: 3 }}>
                <div style={{ width: `${score}%`, height: "100%", background: score >= 70 ? COLORS.green : score >= 40 ? COLORS.yellow : COLORS.red, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.red}33`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.red, marginBottom: 12 }}>⚠ Risk Flags</div>
          {riskFlags.length > 0 ? riskFlags.map((flag, i) => (
            <div key={i} style={{ fontSize: 11, padding: "6px 10px", marginBottom: 6, background: `${COLORS.red}15`, border: `1px solid ${COLORS.red}30`, borderRadius: 6, color: "#fca5a5" }}>
              {flag}
            </div>
          )) : (
            <div style={{ fontSize: 12, color: COLORS.muted }}>No risk flags detected ✓</div>
          )}
        </div>
      </div>

      {/* Today's Training */}
      {training.length > 0 && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>🎯 Recommended Problems</div>
          {training.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < training.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div>
                <a href={p.link} target="_blank" rel="noreferrer" style={{ color: COLORS.accentLight, fontSize: 13, textDecoration: "none" }}>
                  {p.title}
                </a>
                <span style={{ marginLeft: 8, fontSize: 11, color: COLORS.muted }}>({p.difficulty})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLearn = () => {
    if (quiz.active && !quiz.done) {
      // Render Quiz
      const q = currentQuiz[quiz.index];
      const answered = quiz.selected !== null;

      return (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 12 }}>
            <span style={{ color: COLORS.muted }}>Question {quiz.index + 1} / {currentQuiz.length}</span>
            <span style={{ color: COLORS.accentLight }}>Score: {quiz.score}</span>
          </div>
          <div style={{ height: 4, background: COLORS.border, borderRadius: 2, marginBottom: 24 }}>
            <div style={{ width: `${(quiz.index / currentQuiz.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`, borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 15, color: COLORS.text, marginBottom: 24, lineHeight: 1.6 }}>{q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = COLORS.bg, border = `1px solid ${COLORS.border}`, color = COLORS.muted;
              if (answered) {
                if (i === q.ans) { bg = `${COLORS.green}15`; border = `1px solid ${COLORS.green}`; color = COLORS.green; }
                else if (i === quiz.selected && i !== q.ans) { bg = `${COLORS.red}15`; border = `1px solid ${COLORS.red}`; color = COLORS.red; }
              }
              return (
                <button key={i} onClick={() => answerQuestion(i)}
                  style={{ background: bg, border, color, borderRadius: 8, padding: "12px 16px", textAlign: "left", fontSize: 13, cursor: answered ? "default" : "pointer", fontFamily: "inherit" }}>
                  <span style={{ marginRight: 10, opacity: 0.5 }}>{["A", "B", "C", "D"][i]}.</span>{opt}
                  {answered && i === q.ans && <span style={{ float: "right" }}>✓</span>}
                  {answered && i === quiz.selected && i !== q.ans && <span style={{ float: "right" }}>✗</span>}
                </button>
              );
            })}
          </div>
          {answered && (
            <button onClick={nextQuestion}
              style={{ marginTop: 20, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {quiz.index < currentQuiz.length - 1 ? "Next →" : "Finish ✓"}
            </button>
          )}
        </div>
      );
    }

    if (quiz.done) {
      // Quiz Results
      const pct = Math.round((quiz.score / currentQuiz.length) * 100);
      return (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📖"}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Quiz Complete!</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.accentLight, marginBottom: 4 }}>{quiz.score}/{currentQuiz.length}</div>
          <div style={{ color: COLORS.muted, marginBottom: 18 }}>{pct}% accuracy</div>
          <div style={{ background: `${COLORS.green}15`, border: `1px solid ${COLORS.green}30`, borderRadius: 8, padding: "12px 20px", marginBottom: 20, color: COLORS.green, fontSize: 13 }}>
            +{quiz.score * 15} XP earned!
          </div>
          <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
            {pct === 100 ? `Perfect score! You've mastered ${currentTopic}.` :
              pct >= 80 ? "Great work! You're ready to move forward." :
                pct >= 60 ? "Good effort! Review the concepts and try again." :
                  "Keep practicing! Review the code examples and try again."}
          </div>
          <button onClick={() => setQuiz({ active: false, index: 0, selected: null, score: 0, done: false })}
            style={{ background: COLORS.border, color: COLORS.accentLight, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 28px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", marginRight: 12 }}>
            Retake
          </button>
          <button onClick={() => setQuiz({ active: false, index: 0, selected: null, score: 0, done: false })}
            style={{ background: `${COLORS.accent}20`, color: COLORS.accentLight, border: `1px solid ${COLORS.accent}40`, borderRadius: 8, padding: "10px 28px", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Back to Learn
          </button>
        </div>
      );
    }

    // Learning Content
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Topic Selection */}
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>Select Topic</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TOPICS.map(topic => (
              <button key={topic.id} onClick={() => setCurrentTopic(topic.name)}
                style={{ background: currentTopic === topic.name ? COLORS.accent : COLORS.bg, color: currentTopic === topic.name ? "#fff" : COLORS.muted, border: `1px solid ${currentTopic === topic.name ? COLORS.accent : COLORS.border}`, borderRadius: 6, padding: "6px 12px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                {topic.icon} {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code Example */}
        {currentExample && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.accentLight }}>{currentExample.title}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{currentExample.description}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ background: `${COLORS.green}20`, color: COLORS.green, padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>⏱ {currentExample.timeComplexity}</span>
                <span style={{ background: `${COLORS.blue}20`, color: COLORS.blue, padding: "4px 10px", borderRadius: 6, fontSize: 11 }}>💾 {currentExample.spaceComplexity}</span>
              </div>
            </div>

            {/* Code Block */}
            <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", background: COLORS.card, borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.red }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.yellow }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.green }} />
                </div>
                <span style={{ fontSize: 10, color: COLORS.muted }}>Java</span>
                <button onClick={copyCode}
                  style={{ background: copied ? `${COLORS.green}20` : COLORS.border, color: copied ? COLORS.green : COLORS.muted, border: "none", borderRadius: 4, padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </button>
              </div>
              <pre style={{ margin: 0, padding: "20px 24px", fontSize: 13, lineHeight: 1.8, overflowX: "auto", color: COLORS.text }}>
                {currentExample.code}
              </pre>
            </div>
          </div>
        )}

        {/* Approach */}
        {currentExample && (
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 10 }}>🧠 How It Works</div>
            <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>{currentExample.approach}</div>
            <button onClick={() => setShowSteps(s => !s)}
              style={{ background: COLORS.border, color: COLORS.accentLight, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              {showSteps ? "▲ Hide" : "▼ Show"} Step-by-Step
            </button>
            {showSteps && (
              <div style={{ marginTop: 16 }}>
                {currentExample.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 22, height: 22, background: `${COLORS.accentLight}20`, color: COLORS.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                    <div style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.6 }}>{step}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={startQuiz}
            style={{ flex: 1, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            🎯 Take Quiz (+{currentQuiz.length * 15} XP)
          </button>
          <button onClick={() => addActivity(`Studied ${currentTopic}`, 10)}
            style={{ flex: 1, background: COLORS.card, color: COLORS.green, border: `1px solid ${COLORS.green}40`, borderRadius: 8, padding: "12px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            ✓ Mark as Studied (+10 XP)
          </button>
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {[
          ["Total XP", xp, levelColor, "⭐"],
          ["Level", level, levelColor, "🏅"],
          ["Streak", `${streak}d`, COLORS.yellow, "🔥"],
          ["Study Time", `${Math.round(totalStudyTime / 60)}h`, COLORS.blue, "⏱"],
          ["Avg Score", avgScore > 0 ? `${avgScore}%` : "—", COLORS.green, "🎯"],
          ["Sessions", sessions.length, COLORS.accentLight, "📚"]
        ].map(([label, val, color, icon]) => (
          <div key={label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color, margin: "4px 0" }}>{val}</div>
            <div style={{ fontSize: 11, color: COLORS.muted }}>{label}</div>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: COLORS.text }}>Journey to Expert</span>
          <span style={{ fontSize: 12, color: COLORS.muted }}>{xp} / 1000 XP</span>
        </div>
        <div style={{ height: 12, background: COLORS.border, borderRadius: 6 }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`, borderRadius: 6, transition: "width 0.6s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {["Beginner", "Intermediate", "Advanced", "Expert"].map((l, i) => (
            <span key={l} style={{ fontSize: 10, color: xp >= [0, 200, 500, 800][i] ? COLORS.accentLight : COLORS.border }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Quiz History */}
      {quizHistory.length > 0 && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>📊 Quiz Performance</div>
          {quizHistory.slice(0, 10).map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < quizHistory.length - 1 ? `1px solid ${COLORS.border}` : "none", fontSize: 12 }}>
              <div>
                <span style={{ color: COLORS.text }}>{r.topic}</span>
                <span style={{ marginLeft: 8, fontSize: 10, color: COLORS.muted }}>{r.date}</span>
              </div>
              <span style={{ color: r.score / r.total >= 0.8 ? COLORS.green : r.score / r.total >= 0.6 ? COLORS.yellow : COLORS.red, fontWeight: 600 }}>
                {r.score}/{r.total} ({Math.round((r.score / r.total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>📋 Recent Activity</div>
        {sessions.slice(0, 10).map((log, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < sessions.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
            <div>
              <div style={{ fontSize: 12, color: COLORS.text }}>{log.topic || log.notes}</div>
              <div style={{ fontSize: 10, color: COLORS.muted }}>{log.date}</div>
            </div>
            {log.duration > 0 && <div style={{ color: COLORS.blue, fontSize: 11 }}>{log.duration}m</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTutor = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "70vh" }}>
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>
        Ask me anything about DSA, share your code for review, or get personalized study recommendations.
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: "auto", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ marginBottom: 14, display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: msg.role === "tutor" ? COLORS.accent : COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
              {msg.role === "tutor" ? "M" : "Y"}
            </div>
            <div style={{ background: msg.role === "tutor" ? "#1a1a2e" : "#1e3a5f", border: `1px solid ${msg.role === "tutor" ? COLORS.accent + "33" : COLORS.blue + "33"}`, borderRadius: 10, padding: "10px 14px", maxWidth: "80%", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {msg.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>M</div>
            <div style={{ background: "#1a1a2e", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: COLORS.muted }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()} placeholder="Ask your tutor anything, or paste your code here..."
          style={{ flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontFamily: "inherit", fontSize: 12 }} />
        <button onClick={sendChatMessage} disabled={chatLoading}
          style={{ background: chatLoading ? COLORS.border : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", cursor: chatLoading ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>
          SEND
        </button>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Log Form */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}44`, borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, color: COLORS.accentLight, letterSpacing: 2, marginBottom: 14 }}>+ LOG TODAY'S SESSION</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input value={logForm.topic} onChange={e => setLogForm({ ...logForm, topic: e.target.value })} placeholder="Topic studied..."
            style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: 12 }} />
          <input value={logForm.duration} onChange={e => setLogForm({ ...logForm, duration: e.target.value })} placeholder="Duration (min)" type="number"
            style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: 12 }} />
          <input value={logForm.score} onChange={e => setLogForm({ ...logForm, score: e.target.value })} placeholder="Score (0-100)" type="number"
            style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: 12 }} />
        </div>
        <textarea value={logForm.notes} onChange={e => setLogForm({ ...logForm, notes: e.target.value })} placeholder="What did you learn? Any problems faced?" rows={2}
          style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontFamily: "inherit", fontSize: 12, width: "100%", resize: "none", marginBottom: 10, boxSizing: "border-box" }} />
        <button onClick={logSession}
          style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`, border: "none", borderRadius: 6, padding: "8px 20px", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>
          LOG SESSION
        </button>
      </div>

      {/* Session History */}
      {sessions.map((s, i) => (
        <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontWeight: 600, color: COLORS.text }}>{s.topic}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{s.date} · {s.duration}min</div>
          </div>
          {s.notes && <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>{s.notes}</div>}
          {s.score > 0 && (
            <div style={{ fontSize: 12, color: s.score >= 70 ? COLORS.green : COLORS.yellow }}>Score: {s.score}%</div>
          )}
        </div>
      ))}
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (loading) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accentLight, fontFamily: "monospace", fontSize: 18 }}>
        Loading Mentora...
      </div>
    );
  }

  const tabs = ["dashboard", "learn", "progress", "tutor", "sessions"];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.bg} 0%, #1a0a2e 50%, ${COLORS.bg} 100%)`, borderBottom: `1px solid ${COLORS.border}`, padding: "20px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.accentLight, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>◈ MENTORA</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>AI-Powered DSA Learning System</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: levelColor }}>{xp} XP</div>
              <div style={{ fontSize: 10, color: COLORS.muted }}>{level}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.yellow }}>🔥 {streak}</div>
              <div style={{ fontSize: 10, color: COLORS.muted }}>Streak</div>
            </div>
            <button onClick={syncLeetcode}
              style={{ background: COLORS.accent, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              Sync LeetCode
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ background: activeTab === tab ? COLORS.accent : "transparent", color: activeTab === tab ? "#fff" : COLORS.muted, border: "none", borderRadius: "6px 6px 0 0", padding: "8px 16px", cursor: "pointer", fontSize: 12, fontFamily: "inherit", textTransform: "uppercase", letterSpacing: 1, transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px", maxWidth: 960, margin: "0 auto" }}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "learn" && renderLearn()}
        {activeTab === "progress" && renderProgress()}
        {activeTab === "tutor" && renderTutor()}
        {activeTab === "sessions" && renderSessions()}
      </div>
    </div>
  );
}