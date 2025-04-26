import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-markup";
import { SendHorizonal, Copy, Trash2, Upload, History, Edit, Plus } from "lucide-react";

export default function CodeIterator() {
  const [inputCode, setInputCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [displayedOutput, setDisplayedOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const outputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("iterationHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [displayedOutput]);

  useEffect(() => {
    if (outputCode) animateTyping(outputCode);
  }, [outputCode]);

  const animateTyping = (text) => {
    let index = 0;
    setDisplayedOutput("");
    const interval = setInterval(() => {
      setDisplayedOutput((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 1); // faster typing animation
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setInputCode(event.target.result);
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!inputCode.trim() || !prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/iterate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: inputCode, prompt }),
      });
      const data = await response.json();
      if (response.ok) {
        setOutputCode(data.iterated_code || "");
        setExplanation(data.explanation || "");

        const newEntry = {
          inputCode,
          prompt,
          iteratedCode: data.iterated_code,
          explanation: data.explanation,
          timestamp: new Date().toLocaleString(),
        };

        const newHistory = [newEntry, ...history];
        setHistory(newHistory);
        localStorage.setItem("iterationHistory", JSON.stringify(newHistory));
        setEditingItem(null);

        setTimeout(() => {
          outputRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };



  const handleCopy = () => {
    if (outputCode) {
      navigator.clipboard.writeText(outputCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleIntegrate = () => {
    setInputCode(outputCode);
    setPrompt("");
    setOutputCode("");
    setExplanation("");
  };

  const clearHistory = () => {
    localStorage.removeItem("iterationHistory");
    setHistory([]);
  };

  const restoreFromHistory = (item) => {
    setInputCode(item.inputCode);
    setPrompt(item.prompt);
    setOutputCode(item.iteratedCode);
    setExplanation(item.explanation);
    setEditingItem(null);
  };

  const editHistoryItem = (item) => {
    setInputCode(item.inputCode);
    setPrompt(item.prompt);
    setEditingItem(item);
    setShowHistory(false);
  };

  const saveAsNew = () => {
    if (!inputCode.trim() || !prompt.trim()) return;
    const newEntry = {
      inputCode,
      prompt,
      iteratedCode: outputCode,
      explanation,
      timestamp: new Date().toLocaleString(),
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem("iterationHistory", JSON.stringify(newHistory));
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold tracking-tight">Code Iterator Pro</h1>
        <div className="flex gap-4 items-center">
          <label className="cursor-pointer relative">
            <div className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white flex items-center gap-2 shadow-md transition">
              <Upload size={18} /> Upload
            </div>
            <input
              type="file"
              accept=".js,.ts,.py,.html,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white flex items-center shadow-md transition"
          >
            <History size={18} />
          </button>
          <button
            onClick={clearHistory}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm text-white flex items-center shadow-md transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-sm">
            <textarea
              rows={10}
              placeholder="Paste your code here..."
              className="w-full bg-transparent resize-none outline-none font-mono text-sm text-white placeholder-white/30"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>

          {outputCode && (
            <div
              ref={outputRef}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white transition-colors shadow-md"
                >
                  {copied ? "✅" : <Copy size={16} />}
                </button>

                <div className="text-[10px] text-gray-400">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>

              {explanation && (
                <div className="mb-4 text-xs text-purple-400">
                  💬 <strong>Change:</strong> {explanation}
                </div>
              )}

              <div className="w-full overflow-x-auto">
                <pre className="whitespace-pre min-w-full">
                  <code className="language-javascript">{displayedOutput}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-[300px] border-l border-gray-800 p-6 flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter prompt..."
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !inputCode.trim() || !prompt.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-medium hover:scale-105 transition-transform shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <SendHorizonal size={18} className="mr-2" /> Iterate
              </>
            )}
          </button>

          {editingItem && (
            <button
              onClick={saveAsNew}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium hover:scale-105 transition-transform shadow-md flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Save as New
            </button>
          )}

          {outputCode && (
            <button
              onClick={handleIntegrate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-green-600 text-white font-medium hover:scale-105 transition-transform shadow-md hover:shadow-lg active:scale-95"
            >
              Integrate Code
            </button>
          )}

          {error && (
            <div className="text-red-400 text-xs">
              {typeof error === "object" ? JSON.stringify(error) : error}
            </div>
          )}
        </div>
      </main>

      {/* History Drawer */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 flex">
          <div className="bg-[#18181b] w-[350px] p-6 overflow-y-auto space-y-4 border-r border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                Close
              </button>
            </div>
            {history.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-sm space-y-2"
              >
                <div className="text-xs text-gray-400">{item.timestamp}</div>
                <div className="text-xs">{item.prompt}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => restoreFromHistory(item)}
                    className="text-purple-400 text-xs hover:underline"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => editHistoryItem(item)}
                    className="text-blue-400 text-xs hover:underline flex items-center gap-1"
                  >
                    <Edit size={12} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1" onClick={() => setShowHistory(false)} />
        </div>
      )}
    </div>
  );
}
