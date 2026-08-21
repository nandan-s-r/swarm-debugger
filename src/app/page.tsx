'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  
  const [result, setResult] = useState<{
    rootCause?: string;
    proposedFix?: string;
    reviewerVerdict?: string;
    error?: string;
  } | null>(null);

  // Simulate the agents taking turns for visual effect when loading
  useEffect(() => {
    if (!isLoading) {
      setActiveAgent(null);
      return;
    }

    const agents = ['Code Analysis Agent', 'Fix Agent', 'Reviewer Agent'];
    let currentIndex = 0;
    setActiveAgent(agents[0]);

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % agents.length;
      setActiveAgent(agents[currentIndex]);
    }, 2000); // switch every 2 seconds for visual effect

    return () => clearInterval(interval);
  }, [isLoading]);

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
    <main className="min-h-screen p-8 bg-slate-50 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3 border-b border-slate-200 pb-6 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Swarm Debugger</h1>
            <p className="text-slate-500 text-lg font-medium mt-1">Autonomous Multi-Agent Debugging Platform</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <section>
            <form onSubmit={handleDebug} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  Source Code Snippet
                </label>
                <textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full h-40 p-4 font-mono text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                  placeholder="Paste the failing code here..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="errorMsg" className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Error Message / Stack Trace
                </label>
                <textarea
                  id="errorMsg"
                  value={errorMsg}
                  onChange={(e) => setErrorMsg(e.target.value)}
                  required
                  className="w-full h-24 p-4 font-mono text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-red-900 bg-red-50"
                  placeholder="Paste the error message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Executing Swarm...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Dispatch Agents
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Results Section */}
          <section className="space-y-6">
            {!isLoading && !result && (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50">
                  <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <p className="text-lg font-medium">System Idle</p>
                  <p className="text-sm mt-1">Provide code and an error to awaken the swarm.</p>
               </div>
            )}

            {isLoading && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center justify-center space-y-6 h-full">
                 <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">Swarm Active</h3>
                    <p className="text-blue-600 font-medium animate-pulse">{activeAgent} is working...</p>
                 </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {result.error ? (
                  <div className="p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 font-medium">
                    {result.error}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {/* Agent 1 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-orange-300 transition-colors">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="p-1.5 bg-orange-100 text-orange-700 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Code Analysis Agent</h3>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{result.rootCause}</p>
                    </div>
                    
                    {/* Agent 2 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-blue-300 transition-colors">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></span>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Fix Agent</h3>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-blue-300 font-mono text-sm whitespace-pre-wrap">{result.proposedFix}</pre>
                      </div>
                    </div>

                    {/* Agent 3 */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group hover:border-green-300 transition-colors">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="p-1.5 bg-green-100 text-green-700 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Reviewer Agent</h3>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{result.reviewerVerdict}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
