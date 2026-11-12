"use client";

import { useState } from "react";
import { Binary, Copy, Check, ArrowRightLeft, AlertCircle } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

export default function Base64Converter() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState<string>("Hello, Toolify! 🚀");
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Safe UTF-8 Base64 encoding/decoding
  const processBase64 = (val: string, currentMode: "encode" | "decode") => {
    setError(null);
    if (!val) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "encode") {
        // UTF-8 to Base64
        const utf8Bytes = new TextEncoder().encode(val);
        let binaryStr = "";
        for (let i = 0; i < utf8Bytes.length; i++) {
          binaryStr += String.fromCharCode(utf8Bytes[i]);
        }
        setOutput(btoa(binaryStr));
      } else {
        // Base64 to UTF-8
        const binaryStr = atob(val.trim());
        const utf8Bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          utf8Bytes[i] = binaryStr.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(utf8Bytes));
      }
    } catch (err: any) {
      setError(currentMode === "decode" ? "Invalid Base64 sequence." : err.message);
      setOutput("");
    }
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    processBase64(val, mode);
  };

  const handleModeSwitch = (newMode: "encode" | "decode") => {
    setMode(newMode);
    setInput(output || input);
    processBase64(output || input, newMode);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            onClick={() => handleModeSwitch("encode")}
            className={`px-4 py-1.5 rounded-lg ${
              mode === "encode"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Encode (Text → Base64)
          </button>
          <button
            onClick={() => handleModeSwitch("decode")}
            className={`px-4 py-1.5 rounded-lg ${
              mode === "decode"
                ? "bg-white dark:bg-slate-900 text-brand-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Decode (Base64 → Text)
          </button>
        </div>

        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {mode === "encode" ? "Source Text" : "Base64 String"}
          </label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 to decode..."}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-brand-500 resize-y"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <textarea
            readOnly
            rows={8}
            value={output}
            placeholder="Result will appear here..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none resize-y"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
