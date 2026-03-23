import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Bug, Download, Play, Shield, Trash2, Upload, Zap, ArrowLeft, Bot } from "lucide-react";
import Navbar from "./Navbar";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

const API_BASE_URL = "http://localhost:5000";

const SAMPLE_CODES = [
  {
    name: "Python Buggy",
    language: "python",
    code: `def process(nums):
    total = 0
    for i in range(len(nums)):
        for j in range(len(nums)):
            total += nums[i] * nums[j]
    user_input = input("code > ")
    eval(user_input)
    return total

print(process([1,2,3]))`,
  },

  {
    name: "C Buggy",
    language: "c",
    code: `#include <stdio.h>
#include <stdlib.h>

int process(int nums[], int size) {
    int total = 0;
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            total += nums[i] * nums[j];
        }
    }

    char user_input[100];
    printf("Enter command: ");
    gets(user_input); // Unsafe function

    system(user_input); // Dangerous execution

    return total;
}

int main() {
    int nums[] = {1, 2, 3};
    int size = sizeof(nums) / sizeof(nums[0]);

    printf("Result: %d\\n", process(nums, size));
    return 0;
}`,
  },

  {
    name: "C++ Buggy",
    language: "cpp",
    code: `#include <iostream>
#include <vector>
#include <cstdlib>
using namespace std;

int process(vector<int> nums) {
    int total = 0;
    for (int i = 0; i < nums.size(); i++) {
        for (int j = 0; j < nums.size(); j++) {
            total += nums[i] * nums[j];
        }
    }

    string userInput;
    cout << "Enter command: ";
    getline(cin, userInput);

    system(userInput.c_str()); // Dangerous execution

    return total;
}

int main() {
    vector<int> nums = {1, 2, 3};
    cout << "Result: " << process(nums) << endl;
    return 0;
}`,
  },

  {
    name: "Java Buggy",
    language: "java",
    code: `import java.util.Scanner;

public class Main {
    public static int process(int[] nums) {
        int total = 0;
        for (int i = 0; i < nums.length; i++) {
            for (int j = 0; j < nums.length; j++) {
                total += nums[i] * nums[j];
            }
        }

        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter command: ");
        String userInput = scanner.nextLine();

        try {
            Runtime.getRuntime().exec(userInput); // Dangerous execution
        } catch (Exception e) {
            e.printStackTrace();
        }

        return total;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        System.out.println("Result: " + process(nums));
    }
}`,
  },
];

function detectLanguageFromName(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "java":
      return "java";
    case "cpp":
      return "cpp";
    case "c":
      return "c";
    default:
      return "python";
  }
}

function clampToPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function extractPylintScore(report) {
  const match = report.match(/rated at\s+(-?\d+(?:\.\d+)?)\/10/i);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractBanditSeverityCounts(report) {
  const readCount = (label) => {
    const match = report.match(new RegExp(`${label}\\s*:\\s*(\\d+)`, "i"));
    return match ? Number(match[1]) : 0;
  };
  const low = readCount("Low");
  const medium = readCount("Medium");
  const high = readCount("High");
  const issueBlocks = (report.match(/^>>\s*Issue:/gim) || []).length;
  const total = issueBlocks || low + medium + high;
  return { low, medium, high, total };
}

export default function AnalyzerPage({ onNavigate, currentPath }) {
  const [code, setCode] = useState(SAMPLE_CODES[0].code);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  const suggestionList = useMemo(() => result?.ai_review?.suggestions || [], [result]);

  const quickStats = useMemo(() => {
    const pylint = result?.pylint || "";
    const bandit = result?.bandit || "";
    const currentLanguage = (result?.language || language || "java").toLowerCase();
    const pylintScore = extractPylintScore(pylint);
    const banditCounts = extractBanditSeverityCounts(bandit);
    const hasNoOutputMessage = /No output generated\./i.test(pylint);

    const codeHealth = hasNoOutputMessage
      ? 100
      : pylintScore === null
        ? null
        : currentLanguage === "java" || currentLanguage === "c"
          ? clampToPercent(pylintScore * 10)
          : clampToPercent(100 - pylintScore * 10);

    const securityBenchmark = clampToPercent(
      100 - (banditCounts.low * 8 + banditCounts.medium * 18 + banditCounts.high * 30)
    );

    return {
      pylintScore,
      codeHealth,
      pylintWarnings: (pylint.match(/warning|error|refactor|convention/gi) || []).length,
      securityFlags: banditCounts.total,
      securityLow: banditCounts.low,
      securityMedium: banditCounts.medium,
      securityHigh: banditCounts.high,
      securityBenchmark,
      suggestions: suggestionList.length,
    };
  }, [result, suggestionList.length, language]);

  const radarData = useMemo(() => {
    if (!result) {
      return [
        { metric: "Maintainability", value: 0 },
        { metric: "Security", value: 0 },
        { metric: "Performance", value: 0 },
        { metric: "Readability", value: 0 },
        { metric: "Reliability", value: 0 },
        { metric: "AI Confidence", value: 0 },
      ];
    }

    const complexity = Number(result?.ai_review?.complexity_score || 0);
    const pylintScore = quickStats.pylintScore ?? 0;
    const pylintWarnings = quickStats.pylintWarnings;
    const securityFlags = quickStats.securityFlags;
    const suggestions = suggestionList.length;

    const maintainability = clampToPercent(100 - pylintScore * 10 - pylintWarnings * 3);
    const security = clampToPercent(quickStats.securityBenchmark);
    const performance = clampToPercent(86 - complexity * 4 - suggestions * 3);
    const readability = clampToPercent(88 - pylintWarnings * 4 - suggestions * 2);
    const reliability = clampToPercent(90 - (pylintWarnings + securityFlags) * 4 - complexity * 2);
    const aiConfidence = clampToPercent(100 - complexity * 8);

    return [
      { metric: "Maintainability", value: maintainability },
      { metric: "Security", value: security },
      { metric: "Performance", value: performance },
      { metric: "Readability", value: readability },
      { metric: "Reliability", value: reliability },
      { metric: "AI Confidence", value: aiConfidence },
    ];
  }, [result, quickStats.pylintScore, quickStats.pylintWarnings, quickStats.securityFlags, quickStats.securityBenchmark, suggestionList.length]);

  const onReview = async (event) => {
    if (event) event.preventDefault();
    setError("");
    setResult(null);

    if (!code.trim()) {
      setError("Please paste code before analysis.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Review failed. Please try again.");
      }
      setResult(data);
      setActiveTab("Overview");
    } catch (reviewError) {
      setError(reviewError.message || "Unexpected error while reviewing code.");
    } finally {
      setLoading(false);
    }
  };

  const onUploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    setCode(content);
    setLanguage(detectLanguageFromName(file.name));
    setResult(null);
  };

  const onExport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bugsense-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Premium Background Elements */}
      <div className="orb bg-primary-600 w-[500px] h-[500px] top-[-100px] left-[-150px]" />
      <div className="orb bg-accent-600 w-[600px] h-[600px] bottom-[-200px] right-[-200px] opacity-20" />
      <div className="orb bg-blue-500 w-[400px] h-[400px] top-[40%] left-[50%] -translate-x-1/2 opacity-10" />

      <Navbar
        onNavigate={onNavigate}
        currentPath={currentPath}
        rightElement={
          <button
            onClick={onReview}
            disabled={loading}
            className="btn-primary py-2 px-6 shadow-glow hover:shadow-accent-glow"
          >
            <Play className="h-4 w-4" />
            {loading ? "Analyzing Matrix" : "Execute Scan"}
          </button>
        }
      />

      {/* Main Content Workspace */}
      <main className="w-full max-w-7xl px-6 pt-32 pb-12 flex-1 animate-slide-up flex flex-col">

        {/* Header Title */}
        <section className="mb-8 pl-2">
          <p className="inline-flex rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-300 mb-4 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
            Neural Code Review Console
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-white drop-shadow-lg">
            Intelligent <span className="gradient-text">Analysis Matrix</span>
          </h1>
        </section>

        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Editor Column */}
          <section className="glass-panel p-6 flex-1 flex flex-col h-full rounded-2xl">
            {/* Editor Toolbar */}
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div className="flex gap-4 items-end flex-wrap">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiler Target</label>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="rounded-xl border border-white/10 bg-surfaceHover px-4 py-2.5 text-sm font-semibold text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all shadow-inner"
                  >
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">File Inject</label>
                  <label className="inline-flex cursor-pointer shadow-glass-sm items-center gap-2 rounded-xl border border-white/10 bg-surfaceHover px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-surfaceHover/80 hover:text-white transition-all">
                    <Upload className="h-4 w-4 text-primary-400" />
                    Upload Source
                    <input type="file" className="hidden" onChange={onUploadFile} />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Heuristic Samples</label>
                  <div className="flex gap-2">
                    {SAMPLE_CODES.map((sample) => (
                      <button
                        key={sample.name}
                        className="rounded-xl border border-white/10 shadow-glass-sm bg-surfaceHover px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-surfaceHover/80 hover:text-white transition-all"
                        onClick={() => {
                          setCode(sample.code);
                          setLanguage(sample.language);
                          setResult(null);
                        }}
                      >
                        {sample.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 min-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#0d131f] shadow-inner relative flex flex-col">
              {/* Window Controls Decor */}
              <div className="h-8 w-full border-b border-white/5 bg-[#0a0f18] flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-[10px] text-slate-500 font-medium ml-2 uppercase tracking-widest">Main.{language === 'python' ? 'py' : language}</span>
              </div>
              <Editor
                height="500px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 20, bottom: 20 },
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  renderLineHighlight: 'all',
                  overviewRulerBorder: false,
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  }
                }}
              />
            </div>

            {/* Editor Footer actions */}
            <div className="mt-5 flex justify-end gap-3 items-center">
              {error && <p className="mr-auto text-sm font-semibold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">{error}</p>}
              <button
                onClick={() => { setCode(""); setResult(null); }}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-2.5 text-sm font-semibold text-rose-300 hover:bg-rose-500/20 transition-all shadow-glass-sm"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
              <button
                onClick={onReview}
                disabled={loading}
                className="btn-primary"
              >
                <Play className="h-4 w-4" />
                {loading ? "Analyzing Codebase..." : "Run Analysis"}
              </button>
            </div>
          </section>

          {/* Results Column */}
          <section className="lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 flex flex-col h-full">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5 group hover:border-primary-500/30 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Health Score</p>
                <h3 className="text-4xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:text-primary-400 transition-colors">
                  {quickStats.codeHealth ?? "--"}<span className="text-xl text-slate-500 ml-1">/100</span>
                </h3>
              </div>
              <div className="glass-card p-5 group hover:border-accent-500/30 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Sec Benchmark</p>
                <h3 className="text-4xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:text-amber-400 transition-colors">
                  {quickStats.securityBenchmark !== null && !isNaN(quickStats.securityBenchmark) ? quickStats.securityBenchmark : "--"}<span className="text-xl text-slate-500 ml-1">/100</span>
                </h3>
              </div>
            </div>

            {/* Results Panel */}
            <div className="glass-panel p-6 flex flex-col flex-1 rounded-2xl relative overflow-hidden">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="mb-6 flex items-center justify-between z-10 relative">
                <h2 className="text-xl font-extrabold text-white drop-shadow-md">Diagnostics</h2>
                <button
                  onClick={onExport}
                  disabled={!result}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surfaceHover px-4 py-2.5 text-xs font-bold hover:bg-surfaceHover/80 disabled:cursor-not-allowed disabled:opacity-40 transition-all shadow-glass-sm"
                >
                  <Download className="h-4 w-4 text-primary-400" />
                  JSON
                </button>
              </div>

              {!result && !loading && (
                <div className="rounded-xl border border-dashed border-white/10 bg-surfaceHover/30 p-12 text-center flex flex-col items-center justify-center flex-1 z-10 relative shadow-inner">
                  <div className="p-4 rounded-2xl bg-white/5 mb-4 shadow-glass-sm">
                    <Shield className="h-8 w-8 text-slate-500" />
                  </div>
                  <p className="text-slate-400 font-medium">Awaiting source code injection.</p>
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-primary-500/20 bg-primary-900/10 p-12 text-center flex flex-col items-center justify-center flex-1 z-10 relative shadow-inner">
                  <div className="p-4 rounded-2xl bg-primary-500/20 mb-4 animate-glow-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <Zap className="h-8 w-8 text-primary-400" />
                  </div>
                  <p className="text-primary-300 font-bold tracking-wide">Scanning Architecture...</p>
                </div>
              )}

              {result && (
                <div className="flex flex-col flex-1 z-10 relative animate-fade-in">

                  {/* Radar Section */}
                  <div className="rounded-xl border border-white/5 bg-surfaceHover/50 p-4 mb-6 relative overflow-hidden shadow-inner">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-400">
                      Capability Radar
                    </h3>
                    <div className="h-[220px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                          <PolarGrid stroke="rgba(255,255,255,0.05)" />
                          <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />
                          <Radar
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#colorUv)"
                            fillOpacity={1}
                          />
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 overflow-auto pb-3 mb-3 border-b border-white/5">
                    {[
                      ["Overview", Zap],
                      ["AI Diagnostics", Bot],
                      ["Pylint", Bug],
                      ["Bandit", Shield],
                    ].map(([name, Icon]) => (
                      <button
                        key={name}
                        onClick={() => setActiveTab(name)}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${activeTab === name
                          ? "bg-primary-500/20 text-primary-300 border border-primary-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                          : "bg-surfaceHover border border-transparent text-slate-400 hover:text-white"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {name}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 bg-surfaceHover/40 rounded-xl border border-white/5 p-4 overflow-y-auto max-h-[300px] shadow-inner">
                    {activeTab === "Overview" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                          <span className="text-sm font-semibold text-slate-300">Pylint Rating</span>
                          <span className="font-extrabold text-blue-400">{quickStats.pylintScore ?? "--"}/10</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                          <span className="text-sm font-semibold text-slate-300">Security Score</span>
                          <span className="font-extrabold text-emerald-400">{quickStats.securityBenchmark}/100</span>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <span className="text-xs uppercase tracking-widest font-bold text-slate-400 block mb-2">Security Breakdown</span>
                          <div className="flex gap-4">
                            <span className="text-sm font-bold text-rose-400">High: {quickStats.securityHigh}</span>
                            <span className="text-sm font-bold text-amber-400">Med: {quickStats.securityMedium}</span>
                            <span className="text-sm font-bold text-emerald-400">Low: {quickStats.securityLow}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "AI Diagnostics" && (
                      <div className="space-y-6">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                          <h4 className="text-xs uppercase tracking-widest font-bold text-primary-400 mb-3 flex items-center gap-2">
                             <Bot className="h-4 w-4" /> Recommended Actions
                          </h4>
                          <ul className="space-y-2">
                            {suggestionList.map((suggestion, idx) => (
                              <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                                <span className="text-primary-500 font-bold mt-0.5">•</span>
                                <span className="leading-relaxed whitespace-pre-line">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {result?.ai_review?.optimized_code && result.ai_review.optimized_code !== code && (
                          <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none"></div>
                             <h4 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-3 relative z-10">
                               Optimized Payload Array
                             </h4>
                             <div className="bg-[#0a0f18] p-4 rounded-lg border border-white/5 overflow-x-auto relative z-10 shadow-inner">
                               <pre className="text-xs text-slate-300 font-mono whitespace-pre">{result.ai_review.optimized_code}</pre>
                             </div>
                             <div className="mt-4 flex justify-end relative z-10">
                               <button 
                                 onClick={() => {
                                   setCode(result.ai_review.optimized_code);
                                   setActiveTab("Overview");
                                 }}
                                 className="px-5 py-2.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 rounded shadow-glass-sm hover:bg-emerald-500/20 hover:shadow-glow transition-all"
                               >
                                  Apply Patch Directly
                               </button>
                             </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "Pylint" && (
                      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
                        {result.pylint || "No Pylint output available."}
                      </pre>
                    )}

                    {activeTab === "Bandit" && (
                      <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap break-words">
                        {result.bandit || "No Bandit scanning output available."}
                      </pre>
                    )}
                  </div>

                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
