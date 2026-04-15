import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FolderCode, Plus, FileCode2, Trash2, Save, TerminalSquare, Play, Keyboard } from 'lucide-react';
import MainLayout from '../components/MainLayout';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function NeuralIDE() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState('// Initialize Neural Link...');
  const [language, setLanguage] = useState('javascript');
  const [newFileName, setNewFileName] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [logs, setLogs] = useState([
    { type: 'info',    msg: 'Neural Environment Initialized. Context locked.', ts: new Date() },
    { type: 'info',    msg: 'Ready to execute. Stand by.',                      ts: new Date() }
  ]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/code');
      setFiles(res.data);
      if (res.data.length > 0 && !activeFile) {
        selectFile(res.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load code vault');
    }
  };

  const selectFile = (file) => {
    setActiveFile(file);
    setCode(file.code);
    setLanguage(file.language || 'javascript');
  };

  const handleCreateFile = async (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    
    // Auto-detect language
    let ext = newFileName.split('.').pop()?.toLowerCase();
    let lang = 'javascript';
    if (ext === 'py') lang = 'python';
    else if (ext === 'cpp' || ext === 'c') lang = 'cpp';
    else if (ext === 'java') lang = 'java';
    else if (ext === 'html') lang = 'html';
    else if (ext === 'css') lang = 'css';
    else if (ext === 'json') lang = 'json';

    try {
      const res = await api.post('/code', {
        title: newFileName,
        code: `// ${newFileName} initialized\n`,
        language: lang
      });
      setFiles([res.data, ...files]);
      selectFile(res.data);
      setNewFileName('');
      toast.success('Neural Node created');
    } catch (err) {
      toast.error('Failed to create file');
    }
  };

  const handleSaveCode = async () => {
    if (!activeFile) {
      setLogs(prev => [...prev, { type: 'error', msg: 'No active file selected to save.' }]);
      return;
    }
    setIsSaving(true);
    try {
      const fileName = activeFile?.title || newFileName || "script.js";
      await api.post("/code/save", {
        fileName,
        content: code,
        language
      });
      toast.success("Code Saved Successfully in Vault!");
      setLogs(prev => [...prev, { type: 'success', msg: `Saved ${fileName} to Vault successfully.` }]);
      fetchFiles(); // Update list
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Error saving code. Check System Console.");
      setLogs(prev => [...prev, { type: 'error', msg: `Save failed: ${error.message || 'Database Sync Failed'}` }]);
    }
    setIsSaving(false);
  };

  // ── Language → Piston mapping ────────────────────────────────────────────────
  const LANG_MAP = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python:     { language: 'python',     version: '3.10.0'  },
    cpp:        { language: 'c++',        version: '10.2.0'  },
    java:       { language: 'java',       version: '15.0.2'  },
    typescript: { language: 'typescript', version: '5.0.3'  },
  };

  // ── Direct browser → CodeX API (free, no auth) ───────────────────────────
  const runViaCodeX = async (lang, src, stdin) => {
    // CodeX language names
    const codexLang = {
      javascript: 'js',
      python:     'python3',
      cpp:        'cpp',
      java:       'java',
      c:          'c',
    }[lang];

    if (!codexLang) throw new Error(`CodeX does not support ${lang}`);

    const resp = await fetch('https://api.codex.jaagrav.in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        script:   src,
        language: codexLang,
        input:    stdin || ''
      })
    });
    if (!resp.ok) throw new Error(`CodeX responded ${resp.status}`);
    const data = await resp.json();
    return {
      stdout: data.output || '',
      stderr: data.error  || '',
      code:   data.statusCode === 200 ? 0 : 1,
      source: 'cloud'
    };
  };

  // ── Wandbox browser call (CONFIRMED reachable) ──────────────────────────
  const runViaWandbox = async (lang, src, stdin) => {
    const compilerMap = {
      python:     'cpython-3.12.0',
      cpp:        'gcc-head',
      java:       'openjdk-head',
      javascript: 'nodejs-head',
      typescript: 'typescript-5.0.4',
      c:          'gcc-head-c',
    };
    const compiler = compilerMap[lang];
    if (!compiler) throw new Error(`Wandbox does not support ${lang}`);

    const resp = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: src, compiler, stdin: stdin || '', options: '' })
    });
    if (!resp.ok) throw new Error(`Wandbox responded ${resp.status}`);
    const data = await resp.json();
    return {
      stdout: data.program_output || data.compiler_output || '',
      stderr: data.program_error  || data.compiler_error  || '',
      code:   parseInt(data.status ?? '0', 10),
      source: 'cloud'
    };
  };

  // ── Local JS eval sandbox (last resort, JS only) ───────────────────────────
  const runLocalJS = (src) => {
    const logs = [];
    const fakeConsole = { log: (...a) => logs.push(a.map(String).join(' ')) };
    try {
      // eslint-disable-next-line no-new-func
      new Function('console', src)(fakeConsole);
      return { stdout: logs.join('\n') || '(no output)', stderr: '', code: 0, source: 'local_eval' };
    } catch (e) {
      return { stdout: '', stderr: e.message, code: 1, source: 'local_eval' };
    }
  };

  // ── Add a log entry with a stable timestamp ─────────────────────────────
  const addLog = (type, msg) =>
    setLogs(prev => [...prev, { type, msg, ts: new Date() }]);

  // ── Render execution result ───────────────────────────────────────────────
  const displayResult = (run, source) => {
    const tag = source === 'local_eval' ? '💻 Local Eval'
              : source === 'local_simulation' ? '🛡️ Virtual'
              : '📡 Cloud';
    if (run.stderr) addLog('error',   `❌ Error:\n${run.stderr}`);
    if (run.stdout) addLog('success', run.stdout);
    else if (!run.stderr) addLog('success', `✓ Done (exit ${run.code ?? 0})`);
    addLog('status', `[${tag}] Executed successfully.`);
    toast.success(`Execution complete [${tag}]`);
  };

  const handleRun = async () => {
    if (!activeFile || isRunning) return;
    setIsRunning(true);
    const mapped = LANG_MAP[language] || { language, version: '*' };
    addLog('info', `▶ Running "${activeFile.title}" · ${mapped.language.toUpperCase()} ${mapped.version}`);

    // ── Tier 1: Backend proxy ─────────────────────────────────────────────────
    try {
      const res = await api.post('/code/run', {
        language, version: '*',
        files: [{ content: code }],
        stdin: customInput || ''
      });
      const data = res.data;
      // Backend may send a status message (engine switched etc.)
      if (data.statusMessage) addLog('status', `⚙️ ${data.statusMessage}`);
      const run = data.run || { stdout: data.stdout, stderr: data.stderr, code: data.code };
      setIsRunning(false);
      return displayResult(run, run.source || 'cloud');
    } catch (backendErr) {
      const status = backendErr.response?.status;
      const isOffline = status === 503 || status === 504 || !status;
      if (!isOffline) {
        const msg = backendErr.response?.data?.details || backendErr.response?.data?.error || backendErr.message;
        addLog('error', `❌ Server error: ${msg}`);
        toast.error('Execution failed');
        setIsRunning(false);
        return;
      }
      addLog('status', '⚙️ Primary Engine Down. Switched to Backup.');
    }  // ← end of catch (backendErr)

    // ── Tier 2a: Wandbox (Confirmed Working) ─────────────────────────────────
    if (['python', 'cpp', 'java', 'javascript', 'typescript', 'c'].includes(language)) {
      addLog('status', '⚙️ Trying Wandbox engine...');
      try {
        const run = await runViaWandbox(language, code, customInput);
        setIsRunning(false);
        return displayResult(run, 'cloud');
      } catch (wandboxErr) {
        addLog('status', `⚠️ Wandbox unavailable — ${wandboxErr.message}. Trying next engine...`);
      }
    }

    // ── Tier 2b: CodeX API ────────────────────────────────────────────────────
    addLog('status', '⚙️ Trying CodeX engine...');
    try {
      const run = await runViaCodeX(language, code, customInput);
      setIsRunning(false);
      return displayResult(run, 'cloud');
    } catch (codexErr) {
      addLog('status', `⚠️ CodeX unavailable — ${codexErr.message}`);
    }

    // ── Tier 3: Browser JS sandbox ────────────────────────────────────────────
    if (language === 'javascript') {
      addLog('status', '💻 Running in browser sandbox (offline mode)...');
      const run = runLocalJS(code);
      setIsRunning(false);
      return displayResult(run, 'local_eval');
    }

    // ── All tiers failed ──────────────────────────────────────────────────────
    addLog('error',
      `❌ All execution engines are currently offline.\n\nOptions:\n• JavaScript → works offline in browser\n• Python/Java/C++ → require internet connection\n• Check your network and try again`);
    toast.error('All engines offline');
    setIsRunning(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/code/${id}`);
      toast.success('Node purged');
      if (activeFile?._id === id) {
        setActiveFile(null);
        setCode('// Select or create a file to deploy logic...');
      }
      fetchFiles();
    } catch (err) {
      toast.error('Purge failed');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1700px] mx-auto pb-20 px-6 mt-8 flex gap-6 h-[82vh]">
        {/* Sidebar / Explorer */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-6 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--glass-border)]">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-glow)]/10 flex items-center justify-center border border-[var(--accent-glow)]/20 shadow-sm">
                 <FolderCode className="text-[var(--accent-glow)]" size={18} />
              </div>
              <div>
                <h2 className="text-[10px] font-black tracking-[0.2em] text-[var(--muted-text)] uppercase leading-none mb-1">Vault</h2>
                <h3 className="text-sm font-black text-[var(--primary-text)] tracking-tight">Code Node Explorer</h3>
              </div>
            </div>
            
            <form onSubmit={handleCreateFile} className="mb-6 px-1">
              <div className="relative group">
                <input 
                  type="text" 
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. engine.js"
                  className="w-full bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-2xl pl-5 pr-12 py-3.5 text-xs text-[var(--primary-text)] placeholder:text-[var(--muted-text)] focus:outline-none focus:border-[var(--accent-glow)]/40 focus:bg-[var(--bg-silk)] transition-all shadow-inner font-bold tracking-tight"
                  required
                />
                <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[var(--brand-gradient)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-glow)]/20 hover:scale-110 transition-transform">
                  <Plus size={16} />
                </button>
              </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-2">
              {files.length === 0 ? (
                 <div className="text-center p-10 border border-dashed border-[var(--glass-border)] rounded-[2rem] flex flex-col items-center">
                    <FileCode2 size={28} className="text-[var(--muted-text)] mb-3 opacity-40" />
                    <p className="text-[9px] text-[var(--muted-text)] font-black uppercase tracking-widest text-center leading-relaxed">Neural Node Vault is currently empty</p>
                 </div>
              ) : files.map(f => (
                <div 
                  key={f._id} 
                  onClick={() => selectFile(f)}
                  className={`group flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    activeFile?._id === f._id 
                      ? 'bg-[var(--bg-silk)] border-[var(--accent-glow)]/30 text-[var(--accent-glow)] border shadow-sm' 
                      : 'hover:bg-[var(--bg-silk)]/50 text-[var(--secondary-text)] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 truncate relative z-10">
                    <FileCode2 size={15} className={`${activeFile?._id === f._id ? 'text-[var(--accent-glow)]' : 'text-[var(--muted-text)] opacity-40'}`} />
                    <span className="text-[12px] font-bold tracking-tight truncate">{f.title}</span>
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, f._id)} 
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all p-1.5 hover:bg-rose-50 rounded-xl relative z-20"
                  >
                    <Trash2 size={13} />
                  </button>
                  {activeFile?._id === f._id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-glow)] rounded-r-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex-1 flex flex-col bg-[var(--bg-card)] border border-[var(--glass-border)] overflow-hidden rounded-[2.5rem] shadow-sm relative">
             {/* Editor Header */}
             <div className="h-16 border-b border-[var(--glass-border)] flex items-center justify-between px-8 bg-[var(--bg-silk)]/30 backdrop-blur-md relative z-20">
               <div className="flex items-center gap-6">
                 <div className="flex gap-2.5">
                   <div className="w-3.5 h-3.5 rounded-full bg-rose-400/20 border border-rose-400/40" />
                   <div className="w-3.5 h-3.5 rounded-full bg-amber-400/20 border border-amber-400/40" />
                   <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/20 border border-emerald-400/40" />
                 </div>
                 <div className="h-6 w-px bg-[var(--glass-border)]" />
                 <span className="text-[10px] font-black tracking-[0.3em] text-[var(--primary-text)] uppercase opacity-80">
                   {activeFile?.title || 'Neural Core'}
                 </span>
               </div>
               
               <div className="flex items-center gap-4">
                 <select 
                   value={language}
                   onChange={(e) => setLanguage(e.target.value)}
                   className="bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-xl px-4 py-2 text-[10px] text-[var(--primary-text)] font-black uppercase tracking-widest focus:outline-none focus:border-[var(--accent-glow)]/40 hover:bg-[var(--bg-silk)]/50 transition-all shadow-sm outline-none cursor-pointer"
                 >
                   <option value="javascript">JavaScript</option>
                   <option value="python">Python</option>
                   <option value="cpp">C++</option>
                   <option value="java">Java</option>
                   <option value="html">HTML</option>
                   <option value="css">CSS</option>
                   <option value="json">JSON</option>
                 </select>

                 <div className="h-6 w-px bg-[var(--glass-border)]" />

                 <button 
                   onClick={handleRun}
                   disabled={!activeFile || isRunning}
                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-black tracking-widest uppercase text-[10px] transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                     isRunning
                       ? 'bg-amber-400 shadow-amber-400/20 cursor-not-allowed'
                       : 'bg-[var(--accent-secondary)] shadow-[var(--accent-secondary)]/20 hover:opacity-90 hover:scale-[1.02]'
                   }`}
                 >
                   {isRunning ? (
                     <>
                       <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                       Processing...
                     </>
                   ) : (
                     <><Play size={14} /> Run Node</>
                   )}
                 </button>

                 <button 
                   onClick={handleSaveCode}
                   disabled={isSaving || !activeFile}
                   className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--primary-text)] font-black tracking-widest uppercase text-[10px] hover:bg-[var(--bg-silk)]/50 hover:border-[var(--accent-glow)]/30 transition-all disabled:opacity-30 shadow-sm"
                 >
                   <Save size={14} className={isSaving ? 'animate-pulse' : ''} />
                   Sync to Vault
                 </button>
               </div>
             </div>

             {/* Monaco Editor Container */}
             <div className="flex-1 w-full bg-white relative">
                <Editor
                  height="100%"
                  theme="light"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    fontFamily: "'Outfit', 'JetBrains Mono', monospace",
                    padding: { top: 32, bottom: 32 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    formatOnPaste: true,
                    lineHeight: 1.6,
                    glyphMargin: false,
                    folding: true,
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                      useShadows: false,
                      verticalHasArrows: false,
                      horizontalHasArrows: false,
                      verticalScrollbarSize: 10,
                      horizontalScrollbarSize: 10
                    }
                  }}
                />
             </div>
          </div>

          {/* I/O Area */}
          <div className="flex gap-6 h-52">
            {/* System Output */}
            <div className="flex-1 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-6 flex flex-col font-mono shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
                     isRunning ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                   }`}>
                     <TerminalSquare size={16} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] opacity-80">Execution Log</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                      isRunning ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{isRunning ? 'Processing...' : 'Active Link'}</span>
                    <span className="flex h-2 w-2 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    </span>
                 </div>
              </div>
              <div className="flex-1 bg-[var(--bg-silk)]/50 rounded-[1.5rem] border border-[var(--glass-border)] p-5 overflow-y-auto w-full text-[11px] space-y-2 relative z-10 shadow-inner custom-scrollbar">
                 {logs.length === 0 ? (
                   <p className="text-[var(--muted-text)] italic opacity-50">Awaiting execution command...</p>
                 ) : logs.map((log, i) => (
                   <div key={i} className="flex items-start gap-3">
                     <span className="text-[var(--muted-text)] opacity-40 font-bold flex-shrink-0">
                       [{log.ts ? new Date(log.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'}) : '--:--:--'}]
                     </span>
                     <pre className={`whitespace-pre-wrap font-mono flex-1 ${
                       log.type === 'error'   ? 'text-rose-500 font-bold'
                     : log.type === 'success' ? 'text-emerald-600 font-bold'
                     : log.type === 'status'  ? 'text-amber-500 font-semibold'
                     : 'text-[var(--secondary-text)]'
                     }`}>
                       {log.msg}
                     </pre>
                   </div>
                 ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="w-80 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-[2.5rem] p-6 flex flex-col font-mono shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4 relative z-10">
                 <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500 border border-cyan-100">
                   <Keyboard size={16} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary-text)] opacity-80">Standard In</span>
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Scanner inputs..."
                className="flex-1 bg-[var(--bg-silk)]/50 border border-[var(--glass-border)] rounded-[1.5rem] p-5 text-[11px] text-cyan-600 font-mono resize-none focus:outline-none focus:border-cyan-400/40 shadow-inner w-full placeholder:text-cyan-300 transition-all font-bold"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
