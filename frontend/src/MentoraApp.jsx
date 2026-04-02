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
  bg: "#0d0d14",
  card: "#13131f",
  cardHover: "#18182a",
  border: "#22223a",
  accent: "#7c3aed",
  accentLight: "#a855f7",
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
  blue: "#3b82f6",
  indigo: "#6366f1",
  text: "#e2e8f0",
  textSub: "#94a3b8",
  muted: "#4a5568",
  surface: "#1a1a2e",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MentoraApp() {
  // Backend data state
  const [backendData, setBackendData] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentTopic, setCurrentTopic] = useState("Stack & Monotonic Stack");
  const [showSteps, setShowSteps] = useState(false);
  const [copied, setCopied] = useState(false);

  // User progress state
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(3);
  const [lastSessionDate, setLastSessionDate] = useState(null);
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
  const [logError, setLogError] = useState("");

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
      const analysisRes = await fetch("http://127.0.0.1:8000/analysis");
      const analysisData = await analysisRes.json();
      setBackendData(analysisData);
      setBackendOnline(true);

      const progressRes = await fetch("http://127.0.0.1:8000/progress");
      await progressRes.json(); // consumed for side-effects; charts can be extended here

      const velocityRes = await fetch("http://127.0.0.1:8000/velocity");
      await velocityRes.json(); // consumed for side-effects; charts can be extended here

      if (analysisData?.snapshot?.weakest_topic) {
        setCurrentTopic(analysisData.snapshot.weakest_topic);
      }
    } catch (err) {
      console.error("Backend fetch error:", err);
      setBackendOnline(false);
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
        setLastSessionDate(data.lastSessionDate || null);
        setSessions(data.sessions || []);
        setQuizHistory(data.quizHistory || []);
      }
    } catch {
      console.log("Using default progress data");
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem(
        "mentora_progress",
        JSON.stringify({ xp, streak, lastSessionDate, sessions, quizHistory })
      );
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [xp, streak, lastSessionDate, sessions, quizHistory]);

  async function syncLeetcode() {
    if (syncing) return;
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/sync", { method: "POST" });
      const data = await res.json();
      await loadBackendData();
      setSyncMsg({ type: "success", text: data.message || "Synced successfully!" });
    } catch (err) {
      console.error("Sync error:", err);
      setSyncMsg({ type: "error", text: "Sync failed — backend unreachable." });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(null), 4000);
    }
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  function addXp(amount) {
    setXp(x => x + amount);
  }

  function copyCode() {
    const example = CODE_EXAMPLES[currentTopic];
    if (example) {
      navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addXp(5);
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
      addXp(earnedXp);
      setQuizHistory(h => [...h, { date: new Date().toLocaleDateString(), topic: currentTopic, score: newScore, total: quizData.length }]);
      setQuiz(q => ({ ...q, done: true, score: newScore }));
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
        addXp(5);
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
    if (!logForm.topic.trim()) { setLogError("Topic is required."); return; }
    if (!logForm.duration || parseInt(logForm.duration) <= 0) { setLogError("Duration must be a positive number."); return; }
    setLogError("");

    const today = new Date().toISOString().split("T")[0];
    const session = {
      date: today,
      topic: logForm.topic.trim(),
      duration: parseInt(logForm.duration),
      notes: logForm.notes.trim(),
      score: parseInt(logForm.score) || 0
    };

    setSessions(s => [session, ...s]);
    addXp(20);

    // Increment streak only once per calendar day
    if (lastSessionDate !== today) {
      setStreak(s => s + 1);
      setLastSessionDate(today);
    }

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

  const totalStudyTime = sessions.reduce((a, s) => a + s.duration, 0);
  const avgScore = sessions.filter(s => s.score > 0).length
    ? Math.round(sessions.filter(s => s.score > 0).reduce((a, s) => a + s.score, 0) / sessions.filter(s => s.score > 0).length)
    : 0;

  const currentExample = CODE_EXAMPLES[currentTopic] || CODE_EXAMPLES["Stack & Monotonic Stack"];
  const currentQuiz = QUIZZES[currentTopic] || QUIZZES["Stack & Monotonic Stack"];

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const cardStyle = {
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "20px 24px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  };

  const inputStyle = {
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: "10px 14px",
    color: COLORS.text,
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const btnPrimary = {
    background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.2s",
  };

  const renderDashboard = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Demo mode banner */}
      {!backendOnline && (
        <div style={{ background: `${COLORS.yellow}18`, border: `1px solid ${COLORS.yellow}50`, borderRadius: 10, padding: "12px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <span style={{ fontWeight: 600, color: COLORS.yellow, fontSize: 14 }}>Demo Mode</span>
            <span style={{ color: COLORS.textSub, fontSize: 13, marginLeft: 8 }}>Backend is offline — showing sample data. Start the backend and click <strong>Sync LeetCode</strong>.</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
        {[
          { label: "Problems Solved", value: snapshot.total, color: COLORS.accent, icon: "🏆" },
          { label: "Easy", value: `${snapshot.easy_percent}%`, color: COLORS.green, icon: "🟢" },
          { label: "Medium", value: `${snapshot.medium_percent}%`, color: COLORS.yellow, icon: "🟡" },
          { label: "Hard", value: `${snapshot.hard_percent}%`, color: COLORS.red, icon: "🔴" },
          { label: "Total XP", value: xp, color: levelColor, icon: "⭐" },
          { label: "Day Streak", value: streak, color: COLORS.yellow, icon: "🔥" },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, textAlign: "center", padding: "18px 12px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: COLORS.textSub, marginTop: 6 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Current Focus */}
      <div style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #13131f 100%)", border: `1px solid ${COLORS.accent}55`, borderRadius: 14, padding: "24px 28px", boxShadow: `0 0 24px ${COLORS.accent}18` }}>
        <div style={{ fontSize: 11, color: COLORS.accentLight, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>▶ Current Focus</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{snapshot.weakest_topic || currentTopic}</div>
        <div style={{ fontSize: 14, color: COLORS.textSub, marginBottom: 18 }}>Your weakest area — master this before advancing</div>
        <button
          onClick={() => { setCurrentTopic(snapshot.weakest_topic || currentTopic); setActiveTab("learn"); }}
          style={btnPrimary}
        >
          Start Learning →
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        {[
          { label: "💻 Learn Code", sub: "Study solutions", color: COLORS.indigo, onClick: () => setActiveTab("learn") },
          { label: "🎯 Take Quiz", sub: `+${currentQuiz.length * 15} XP`, color: COLORS.blue, onClick: startQuiz },
          { label: "💬 Ask Tutor", sub: "Get AI help", color: COLORS.accentLight, onClick: () => setActiveTab("tutor") },
          { label: "📊 View Progress", sub: "Track stats", color: COLORS.green, onClick: () => setActiveTab("progress") },
        ].map(btn => (
          <button key={btn.label} onClick={btn.onClick}
            style={{ ...cardStyle, padding: "16px 14px", border: `1px solid ${btn.color}40`, color: btn.color, borderRadius: 10, cursor: "pointer", fontSize: 14, fontFamily: "inherit", textAlign: "center", transition: "border-color 0.2s, background 0.2s" }}>
            <div style={{ fontWeight: 600 }}>{btn.label}</div>
            <div style={{ fontSize: 12, color: COLORS.textSub, marginTop: 6 }}>{btn.sub}</div>
          </button>
        ))}
      </div>

      {/* Skills & Risk Flags */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>💪 Topic Mastery</div>
          {Object.entries(skills).length === 0 && (
            <div style={{ color: COLORS.textSub, fontSize: 14 }}>No skill data yet. Run a sync.</div>
          )}
          {Object.entries(skills).slice(0, 6).map(([topic, score]) => (
            <div key={topic} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                <span style={{ color: COLORS.text }}>{topic}</span>
                <span style={{ color: score >= 70 ? COLORS.green : score >= 40 ? COLORS.yellow : COLORS.red, fontWeight: 600 }}>{score}%</span>
              </div>
              <div style={{ height: 7, background: COLORS.border, borderRadius: 4 }}>
                <div style={{ width: `${score}%`, height: "100%", background: score >= 70 ? COLORS.green : score >= 40 ? COLORS.yellow : COLORS.red, borderRadius: 4, transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle, border: `1px solid ${COLORS.red}33` }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.red, marginBottom: 16 }}>⚠ Risk Flags</div>
          {riskFlags.length > 0 ? riskFlags.map((flag, i) => (
            <div key={i} style={{ fontSize: 13, padding: "8px 12px", marginBottom: 8, background: `${COLORS.red}15`, border: `1px solid ${COLORS.red}30`, borderRadius: 8, color: "#fca5a5", lineHeight: 1.4 }}>
              {flag}
            </div>
          )) : (
            <div style={{ fontSize: 13, color: COLORS.textSub }}>✓ No risk flags detected</div>
          )}
        </div>
      </div>

      {/* Recommended Problems */}
      {training.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>🎯 Recommended Problems</div>
          {training.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < training.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div>
                <a
                  href={p.link || `https://leetcode.com/problems/${encodeURIComponent(p.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "")}/`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: COLORS.accentLight, fontSize: 14, textDecoration: "none", fontWeight: 500 }}
                >
                  {p.title}
                </a>
                <span style={{ marginLeft: 10, fontSize: 12, color: COLORS.textSub }}>({p.difficulty})</span>
              </div>
              <span style={{ fontSize: 12, color: COLORS.blue }}>→ LeetCode</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLearn = () => {
    if (quiz.active && !quiz.done) {
      const q = currentQuiz[quiz.index];
      const answered = quiz.selected !== null;

      return (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 13 }}>
            <span style={{ color: COLORS.textSub }}>Question {quiz.index + 1} / {currentQuiz.length}</span>
            <span style={{ color: COLORS.accentLight, fontWeight: 600 }}>Score: {quiz.score}</span>
          </div>
          <div style={{ height: 5, background: COLORS.border, borderRadius: 3, marginBottom: 24 }}>
            <div style={{ width: `${(quiz.index / currentQuiz.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
          <div style={{ fontSize: 16, color: COLORS.text, marginBottom: 24, lineHeight: 1.7, fontWeight: 500 }}>{q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {q.options.map((opt, i) => {
              let bg = COLORS.bg, border = `1px solid ${COLORS.border}`, color = COLORS.textSub;
              if (answered) {
                if (i === q.ans) { bg = `${COLORS.green}18`; border = `1px solid ${COLORS.green}`; color = COLORS.green; }
                else if (i === quiz.selected && i !== q.ans) { bg = `${COLORS.red}18`; border = `1px solid ${COLORS.red}`; color = COLORS.red; }
              }
              return (
                <button key={i} onClick={() => answerQuestion(i)}
                  style={{ background: bg, border, color, borderRadius: 10, padding: "13px 18px", textAlign: "left", fontSize: 14, cursor: answered ? "default" : "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
                  <span style={{ marginRight: 12, fontWeight: 700, opacity: 0.7 }}>{["A", "B", "C", "D"][i]}.</span>{opt}
                  {answered && i === q.ans && <span style={{ float: "right", fontWeight: 700 }}>✓</span>}
                  {answered && i === quiz.selected && i !== q.ans && <span style={{ float: "right", fontWeight: 700 }}>✗</span>}
                </button>
              );
            })}
          </div>
          {answered && (
            <button onClick={nextQuestion} style={{ ...btnPrimary, marginTop: 20 }}>
              {quiz.index < currentQuiz.length - 1 ? "Next →" : "Finish ✓"}
            </button>
          )}
        </div>
      );
    }

    if (quiz.done) {
      const pct = Math.round((quiz.score / currentQuiz.length) * 100);
      return (
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px 32px" }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📖"}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Quiz Complete!</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.accentLight, marginBottom: 4 }}>{quiz.score}/{currentQuiz.length}</div>
          <div style={{ color: COLORS.textSub, fontSize: 15, marginBottom: 20 }}>{pct}% accuracy</div>
          <div style={{ background: `${COLORS.green}18`, border: `1px solid ${COLORS.green}35`, borderRadius: 10, padding: "12px 24px", marginBottom: 20, color: COLORS.green, fontSize: 14 }}>
            +{quiz.score * 15} XP earned!
          </div>
          <div style={{ color: COLORS.textSub, fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            {pct === 100 ? `Perfect score! You've mastered ${currentTopic}.` :
              pct >= 80 ? "Great work! You're ready to move forward." :
                pct >= 60 ? "Good effort! Review the concepts and try again." :
                  "Keep practicing! Review the code examples and try again."}
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={startQuiz}
              style={{ ...btnPrimary, background: COLORS.surface, color: COLORS.accentLight, border: `1px solid ${COLORS.accent}40` }}>
              🔁 Retake Quiz
            </button>
            <button onClick={() => setQuiz({ active: false, index: 0, selected: null, score: 0, done: false })}
              style={btnPrimary}>
              ← Back to Learn
            </button>
          </div>
        </div>
      );
    }

    // Learning Content
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Topic Selection */}
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 14 }}>Select Topic</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TOPICS.map(topic => (
              <button key={topic.id} onClick={() => setCurrentTopic(topic.name)}
                style={{ background: currentTopic === topic.name ? COLORS.accent : COLORS.bg, color: currentTopic === topic.name ? "#fff" : COLORS.textSub, border: `1px solid ${currentTopic === topic.name ? COLORS.accent : COLORS.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {topic.icon} {topic.name}
              </button>
            ))}
          </div>
        </div>

        {/* Code Example */}
        {currentExample && (
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.accentLight }}>{currentExample.title}</div>
                <div style={{ fontSize: 13, color: COLORS.textSub, marginTop: 5 }}>{currentExample.description}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ background: `${COLORS.green}20`, color: COLORS.green, padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>⏱ {currentExample.timeComplexity}</span>
                <span style={{ background: `${COLORS.blue}20`, color: COLORS.blue, padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500 }}>💾 {currentExample.spaceComplexity}</span>
              </div>
            </div>

            {/* Code Block */}
            <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", background: "#0d0d18", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.red }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.yellow }} />
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.green }} />
                </div>
                <span style={{ fontSize: 12, color: COLORS.textSub, fontWeight: 500 }}>Java</span>
                <button onClick={copyCode}
                  style={{ background: copied ? `${COLORS.green}20` : COLORS.surface, color: copied ? COLORS.green : COLORS.textSub, border: `1px solid ${copied ? COLORS.green : COLORS.border}`, borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                  {copied ? "✓ Copied!" : "⎘ Copy"}
                </button>
              </div>
              <pre style={{ margin: 0, padding: "22px 26px", fontSize: 13, lineHeight: 1.9, overflowX: "auto", color: COLORS.text }}>
                {currentExample.code}
              </pre>
            </div>
          </div>
        )}

        {/* Approach */}
        {currentExample && (
          <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 12 }}>🧠 How It Works</div>
            <div style={{ color: COLORS.textSub, fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>{currentExample.approach}</div>
            <button onClick={() => setShowSteps(s => !s)}
              style={{ background: COLORS.surface, color: COLORS.accentLight, border: `1px solid ${COLORS.accent}40`, borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
              {showSteps ? "▲ Hide" : "▼ Show"} Step-by-Step
            </button>
            {showSteps && (
              <div style={{ marginTop: 18 }}>
                {currentExample.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 24, height: 24, background: `${COLORS.accentLight}22`, color: COLORS.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: COLORS.textSub, lineHeight: 1.6, paddingTop: 2 }}>{step}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={startQuiz} style={{ ...btnPrimary, flex: 1, padding: "13px 24px", fontSize: 14 }}>
            🎯 Take Quiz (+{currentQuiz.length * 15} XP)
          </button>
          <button onClick={() => addXp(10)}
            style={{ flex: 1, background: COLORS.card, color: COLORS.green, border: `1px solid ${COLORS.green}40`, borderRadius: 8, padding: "13px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            ✓ Mark as Studied (+10 XP)
          </button>
        </div>
      </div>
    );
  };

  const renderProgress = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14 }}>
        {[
          ["Total XP", xp, levelColor, "⭐"],
          ["Level", level, levelColor, "🏅"],
          ["Streak", `${streak}d`, COLORS.yellow, "🔥"],
          ["Study Time", `${Math.round(totalStudyTime / 60)}h`, COLORS.blue, "⏱"],
          ["Avg Score", avgScore > 0 ? `${avgScore}%` : "—", COLORS.green, "🎯"],
          ["Sessions", sessions.length, COLORS.accentLight, "📚"]
        ].map(([label, val, color, icon]) => (
          <div key={label} style={{ ...cardStyle, textAlign: "center", padding: "18px 12px" }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color, margin: "6px 0" }}>{val}</div>
            <div style={{ fontSize: 12, color: COLORS.textSub }}>{label}</div>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: COLORS.text, fontWeight: 500 }}>Journey to Expert</span>
          <span style={{ fontSize: 13, color: COLORS.textSub }}>{xp} / 1000 XP</span>
        </div>
        <div style={{ height: 12, background: COLORS.border, borderRadius: 6 }}>
          <div style={{ width: `${progressPct}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentLight})`, borderRadius: 6, transition: "width 0.6s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {["Beginner", "Intermediate", "Advanced", "Expert"].map((l, i) => (
            <span key={l} style={{ fontSize: 11, color: xp >= [0, 200, 500, 800][i] ? COLORS.accentLight : COLORS.muted }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Quiz History */}
      {quizHistory.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>📊 Quiz Performance</div>
          {quizHistory.slice(0, 10).map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < quizHistory.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div>
                <span style={{ color: COLORS.text, fontSize: 14 }}>{r.topic}</span>
                <span style={{ marginLeft: 10, fontSize: 12, color: COLORS.textSub }}>{r.date}</span>
              </div>
              <span style={{ color: r.score / r.total >= 0.8 ? COLORS.green : r.score / r.total >= 0.6 ? COLORS.yellow : COLORS.red, fontWeight: 600, fontSize: 14 }}>
                {r.score}/{r.total} ({Math.round((r.score / r.total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div style={cardStyle}>
        <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>📋 Recent Sessions</div>
        {sessions.length === 0 && (
          <div style={{ color: COLORS.textSub, fontSize: 14 }}>No sessions logged yet. Go to the Sessions tab to add one.</div>
        )}
        {sessions.slice(0, 10).map((log, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < sessions.slice(0, 10).length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
            <div>
              <div style={{ fontSize: 14, color: COLORS.text }}>{log.topic || log.notes}</div>
              <div style={{ fontSize: 12, color: COLORS.textSub, marginTop: 2 }}>{log.date}</div>
            </div>
            {log.duration > 0 && <div style={{ color: COLORS.blue, fontSize: 13, fontWeight: 500 }}>{log.duration} min</div>}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTutor = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "72vh" }}>
      <div style={{ fontSize: 14, color: COLORS.textSub, marginBottom: 14 }}>
        Ask me anything about DSA, share your code for review, or get personalized study recommendations.
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, overflowY: "auto", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "18px 16px", marginBottom: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
        {chatHistory.map((msg, i) => (
          <div key={i} style={{ marginBottom: 16, display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: msg.role === "tutor" ? COLORS.accent : COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
              {msg.role === "tutor" ? "M" : "U"}
            </div>
            <div style={{ background: msg.role === "tutor" ? "#1a1a2e" : "#192a45", border: `1px solid ${msg.role === "tutor" ? COLORS.accent + "40" : COLORS.blue + "40"}`, borderRadius: 12, padding: "12px 16px", maxWidth: "78%", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap", color: COLORS.text }}>
              {msg.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>M</div>
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: COLORS.textSub }}>
              Thinking…
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()} placeholder="Ask your tutor anything, or paste your code here..."
          style={{ ...inputStyle, flex: 1, borderRadius: 10 }} />
        <button onClick={sendChatMessage} disabled={chatLoading}
          style={{ ...btnPrimary, padding: "10px 24px", opacity: chatLoading ? 0.6 : 1, cursor: chatLoading ? "not-allowed" : "pointer" }}>
          Send →
        </button>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Log Form */}
      <div style={{ ...cardStyle, border: `1px solid ${COLORS.accent}50` }}>
        <div style={{ fontSize: 13, color: COLORS.accentLight, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>+ Log Today's Session</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textSub, display: "block", marginBottom: 5 }}>Topic <span style={{ color: COLORS.red }}>*</span></label>
            <input value={logForm.topic} onChange={e => setLogForm({ ...logForm, topic: e.target.value })} placeholder="e.g. Arrays, DP…"
              style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textSub, display: "block", marginBottom: 5 }}>Duration (min) <span style={{ color: COLORS.red }}>*</span></label>
            <input value={logForm.duration} onChange={e => setLogForm({ ...logForm, duration: e.target.value })} placeholder="e.g. 45" type="number" min="1"
              style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: COLORS.textSub, display: "block", marginBottom: 5 }}>Score (0–100)</label>
            <input value={logForm.score} onChange={e => setLogForm({ ...logForm, score: e.target.value })} placeholder="e.g. 80" type="number" min="0" max="100"
              style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: COLORS.textSub, display: "block", marginBottom: 5 }}>Notes</label>
          <textarea value={logForm.notes} onChange={e => setLogForm({ ...logForm, notes: e.target.value })} placeholder="What did you learn? Any challenges?" rows={2}
            style={{ ...inputStyle, resize: "none" }} />
        </div>
        {logError && (
          <div style={{ fontSize: 13, color: COLORS.red, marginBottom: 10, padding: "8px 12px", background: `${COLORS.red}15`, border: `1px solid ${COLORS.red}40`, borderRadius: 8 }}>
            ⚠ {logError}
          </div>
        )}
        <button onClick={logSession} style={btnPrimary}>
          Save Session (+20 XP)
        </button>
      </div>

      {/* Session History */}
      {sessions.length === 0 && (
        <div style={{ ...cardStyle, textAlign: "center", color: COLORS.textSub, fontSize: 14, padding: "32px 24px" }}>
          No sessions yet. Log your first study session above!
        </div>
      )}
      {sessions.map((s, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div style={{ fontWeight: 600, color: COLORS.text, fontSize: 15 }}>{s.topic}</div>
            <div style={{ fontSize: 13, color: COLORS.textSub, whiteSpace: "nowrap" }}>{s.date} · {s.duration} min</div>
          </div>
          {s.notes && <div style={{ fontSize: 13, color: COLORS.textSub, marginBottom: 8, lineHeight: 1.5 }}>{s.notes}</div>}
          {s.score > 0 && (
            <span style={{ fontSize: 13, fontWeight: 600, color: s.score >= 70 ? COLORS.green : COLORS.yellow, background: `${s.score >= 70 ? COLORS.green : COLORS.yellow}18`, padding: "3px 10px", borderRadius: 6 }}>Score: {s.score}%</span>
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
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, color: COLORS.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ fontSize: 36 }}>◈</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.accentLight }}>Mentora</div>
        <div style={{ fontSize: 14, color: COLORS.textSub, animation: "pulse 1.5s ease-in-out infinite" }}>Loading your dashboard…</div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "⊞" },
    { id: "learn", label: "Learn", icon: "💻" },
    { id: "progress", label: "Progress", icon: "📈" },
    { id: "tutor", label: "AI Tutor", icon: "💬" },
    { id: "sessions", label: "Sessions", icon: "📋" },
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(180deg, #120820 0%, ${COLORS.bg} 100%)`, borderBottom: `1px solid ${COLORS.border}`, padding: "18px 28px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 14 }}>
            {/* Branding */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 22, color: COLORS.accentLight }}>◈</span>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>Mentora</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textSub }}>AI-Powered DSA Learning Platform</div>
            </div>

            {/* Stats + Sync */}
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 16px", textAlign: "center", minWidth: 70 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: levelColor }}>{xp}</div>
                <div style={{ fontSize: 11, color: COLORS.textSub }}>XP · {level}</div>
              </div>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 16px", textAlign: "center", minWidth: 60 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.yellow }}>🔥 {streak}</div>
                <div style={{ fontSize: 11, color: COLORS.textSub }}>Day Streak</div>
              </div>
              <button onClick={syncLeetcode} disabled={syncing}
                style={{ ...btnPrimary, padding: "9px 18px", fontSize: 13, opacity: syncing ? 0.7 : 1, cursor: syncing ? "not-allowed" : "pointer", position: "relative" }}>
                {syncing ? "⟳ Syncing…" : "⟳ Sync LeetCode"}
              </button>
            </div>
          </div>

          {/* Sync feedback */}
          {syncMsg && (
            <div style={{ marginBottom: 14, padding: "9px 16px", borderRadius: 8, background: syncMsg.type === "success" ? `${COLORS.green}18` : `${COLORS.red}18`, border: `1px solid ${syncMsg.type === "success" ? COLORS.green : COLORS.red}50`, color: syncMsg.type === "success" ? COLORS.green : COLORS.red, fontSize: 13 }}>
              {syncMsg.type === "success" ? "✓" : "✗"} {syncMsg.text}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ background: "transparent", color: activeTab === tab.id ? COLORS.accentLight : COLORS.textSub, border: "none", borderBottom: activeTab === tab.id ? `2px solid ${COLORS.accentLight}` : "2px solid transparent", borderRadius: 0, padding: "10px 16px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: activeTab === tab.id ? 600 : 400, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 28px", maxWidth: 960, margin: "0 auto" }}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "learn" && renderLearn()}
        {activeTab === "progress" && renderProgress()}
        {activeTab === "tutor" && renderTutor()}
        {activeTab === "sessions" && renderSessions()}
      </div>
    </div>
  );
}