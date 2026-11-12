"use client";

import { useState, useEffect } from "react";
import { Hash, Copy, Check, RotateCcw } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

// Standard pure JS MD5 implementation for client-side hashing
function md5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }

  function rstr2hex(input: string) {
    const hexTab = "0123456789abcdef";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output;
  }

  function str2rstrUtf8(input: string) {
    return unescape(encodeURIComponent(input));
  }

  function rstrMd5(s: string) {
    const nblk = ((s.length + 8) >> 6) + 1;
    const blks = new Array(nblk * 16).fill(0);
    for (let i = 0; i < s.length; i++) {
      blks[i >> 2] |= (s.charCodeAt(i) & 0xff) << ((i % 4) * 8);
    }
    blks[s.length >> 2] |= 0x80 << ((s.length % 4) * 8);
    blks[nblk * 16 - 2] = s.length * 8;
    const x = [1732584193, -271733879, -1732584194, 271733878];
    for (let i = 0; i < blks.length; i += 16) {
      const oldx = x.slice(0);
      md5cycle(x, blks.slice(i, i + 16));
    }
    return x.map((n) => String.fromCharCode(n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff)).join("");
  }

  return rstr2hex(rstrMd5(str2rstrUtf8(string)));
}

export default function HashGenerator() {
  const [text, setText] = useState<string>("Toolify2026");
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function calculateHashes() {
      if (!text) {
        setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
        return;
      }

      // MD5
      const md5Result = md5(text);

      // Web Crypto API for SHA-1, SHA-256, SHA-512
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      const bufferToHex = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      try {
        const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
          crypto.subtle.digest("SHA-1", data),
          crypto.subtle.digest("SHA-256", data),
          crypto.subtle.digest("SHA-512", data),
        ]);

        setHashes({
          md5: md5Result,
          sha1: bufferToHex(sha1Buf),
          sha256: bufferToHex(sha256Buf),
          sha512: bufferToHex(sha512Buf),
        });
      } catch (err) {
        console.error("Crypto error", err);
      }
    }

    calculateHashes();
  }, [text]);

  const handleCopy = async (key: string, val: string) => {
    const success = await copyToClipboard(val);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Input String to Hash
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to generate cryptographic hashes..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-base focus:outline-none focus:border-brand-500"
        />
      </div>

      <div className="space-y-4">
        {[
          { key: "sha256", name: "SHA-256 (Recommended)", val: hashes.sha256 },
          { key: "sha512", name: "SHA-512", val: hashes.sha512 },
          { key: "md5", name: "MD5 (128-bit)", val: hashes.md5 },
          { key: "sha1", name: "SHA-1 (160-bit)", val: hashes.sha1 },
        ].map((item) => (
          <div
            key={item.key}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
              <button
                onClick={() => handleCopy(item.key, item.val)}
                disabled={!item.val}
                className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 disabled:opacity-40"
              >
                {copiedKey === item.key ? (
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
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {item.val || "..."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
