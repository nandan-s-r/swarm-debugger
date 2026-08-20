'use client';

import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    rootCause?: string;
    proposedFix?: string;
    reviewerVerdict?: string;
    error?: string;
  } | null>(null);

  const handleDebug = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, error: errorMsg }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Failed to connect to the debugging server.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2 border-b pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Swarm Debugger</h1>
          <p className="text-gray-500 text-lg">Multi-agent AI debugging platform</p>
        </header>

        <form onSubmit={handleDebug} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Source Code Snippet</label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full h-32 p-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Paste the failing code here..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="errorMsg" className="block text-sm font-medium text-gray-700">Error Message / Stack Trace</label>
            <textarea
              id="errorMsg"
              value={errorMsg}
              onChange={(e) => setErrorMsg(e.target.value)}
              required
              className="w-full h-24 p-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-red-900 bg-red-50"
              placeholder="Paste the error message here..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Agents Analyzing...
              </span>
            ) : (
              'Run Agents'
            )}
          </button>
        </form>

        {result && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Debugging Results</h2>
            
            {result.error ? (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                {result.error}
              </div>
            ) : (
              <div className="grid gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-400">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔍 Root Cause (Code Analysis Agent)</h3>
                  <p className="text-gray-800">{result.rootCause}</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-400">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🛠️ Proposed Fix (Fix Agent)</h3>
                  <p className="text-gray-800 font-mono text-sm bg-gray-50 p-3 rounded-lg border">{result.proposedFix}</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-400">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">✅ Reviewer Verdict (Reviewer Agent)</h3>
                  <p className="text-gray-800">{result.reviewerVerdict}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
