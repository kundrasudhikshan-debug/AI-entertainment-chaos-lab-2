import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, ShieldCheck, Heart, Skull, Search, AlertTriangle, TrendingUp, Flag } from "lucide-react";
import { Button } from "../components/Button";
import { geminiService } from "../services/geminiService";
import { cn } from "../lib/utils";

export const AnalyzeChat = () => {
  const [chatLogs, setChatLogs] = useState("");
  const [mode, setMode] = useState("Toxic Best Friend");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async () => {
    if (!chatLogs) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);
    
    // UI Feedback sequence for speed perception
    const sequence = ["SCANNING FOR MANIPULATION...", "EXTRACTING RED FLAGS...", "JUDGING INTENTIONS...", "CALCULATING DELULU RATIO..."];
    let i = 0;
    setStatus(sequence[0]);
    const interval = setInterval(() => {
      i = (i + 1) % sequence.length;
      setStatus(sequence[i]);
    }, 1200);

    try {
      const data = await geminiService.analyzeChat(chatLogs, mode);
      if (data) {
        setResult(data);
      } else {
        setError("The investigator went silent. Try again with more context.");
      }
    } catch (err) {
      console.error(err);
      setError("System failure: The drama was too much for the AI to handle.");
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setStatus("");
    }
  };

  const modes = [
    { name: "FBI Agent", icon: Search, color: "text-neon-blue" },
    { name: "Relationship Therapist", icon: Heart, color: "text-red-500" },
    { name: "Gossip Auntie", icon: MessageSquare, color: "text-neon-purple" },
    { name: "Courtroom Judge", icon: ShieldCheck, color: "text-yellow-500" },
    { name: "Toxic Best Friend", icon: Skull, color: "text-neon-green" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-12 max-w-5xl mx-auto"
    >
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="md:w-1/3 flex flex-col gap-8">
            <div>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
                    Analyze My <span className="text-neon-green">Chat</span>
                </h1>
                <p className="text-white/50 font-medium leading-relaxed">
                    Dump your screenshots and DMs. We'll tell you if it's true love or just a manipulation masterclass.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Select Investigator</h3>
                {modes.map((m) => (
                    <button
                        key={m.name}
                        onClick={() => setMode(m.name)}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                            mode === m.name 
                                ? "bg-white/5 border-white/20" 
                                : "border-white/5 hover:border-white/10"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 transition-transform group-hover:scale-110",
                            m.color
                        )}>
                            <m.icon className="w-5 h-5" />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-widest",
                            mode === m.name ? "text-white" : "text-white/40"
                        )}>
                            {m.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-grow flex flex-col gap-6">
            <div className="glass rounded-[2rem] border-white/5 p-8 cyber-grid">
                <textarea
                    placeholder="PASTE YOUR DM LOGS HERE... (E.G. 'Hye' 'Seen at 3:00 PM')"
                    className="w-full h-96 bg-transparent border-none focus:outline-none font-mono text-xs uppercase tracking-widest leading-loose resize-none"
                    value={chatLogs}
                    onChange={(e) => setChatLogs(e.target.value)}
                />
                
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                    <div className="flex gap-2">
                        <div className="w-12 h-1 bg-neon-green/20 rounded-full" />
                        <div className="w-8 h-1 bg-white/10 rounded-full" />
                        <div className="w-16 h-1 bg-white/10 rounded-full" />
                    </div>
                    <Button 
                        variant="purple" 
                        onClick={startAnalysis}
                        disabled={isAnalyzing || !chatLogs}
                        className="px-12 min-w-[240px]"
                    >
                        {isAnalyzing ? status : "EXECUTE ANALYSIS"}
                    </Button>
                </div>
                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}
            </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12"
          >
            <div className="glass rounded-[3rem] border-white/10 p-8 md:p-16 relative overflow-hidden bg-black/40 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,255,102,0.05)]">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <ShieldCheck className="w-64 h-64 text-neon-green -rotate-12" />
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="px-2 py-0.5 bg-neon-green text-black text-[10px] font-black uppercase tracking-tighter">OFFICIAL LOG</div>
                            <span className="text-[10px] font-mono text-white/20">FILE_REF: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                        </div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                            Case <span className="text-neon-green">Report</span>
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 mt-2">Bureau of Romantic Investigation</p>
                    </div>
                    <div className="md:text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Assigned Agent</div>
                        <div className="flex items-center md:justify-end gap-3">
                            <div className="text-xl font-black italic uppercase tracking-tight text-neon-green">{mode}</div>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <Search className="w-4 h-4 text-white/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 px-4 py-8 bg-white/[0.04] rounded-3xl border border-white/10">
                    <div className="text-center group border-b sm:border-b-0 sm:border-r border-white/10 pb-6 sm:pb-0 sm:pr-4 md:border-r-0">
                        <div className="text-[12px] font-black uppercase tracking-widest text-white/60 mb-2 transition-colors group-hover:text-neon-blue">Manipulation</div>
                        <div className="text-5xl font-black italic text-neon-blue">{result.manipulationLevel}</div>
                        <div className="text-sm font-medium text-white mt-3 italic leading-relaxed">
                            {result.manipulationComment}
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: result.manipulationLevel }}
                                className="h-full bg-neon-blue"
                            />
                        </div>
                    </div>
                    <div className="text-center group border-b sm:border-b-0 md:border-r border-white/10 pt-6 sm:pt-0 pb-6 sm:pb-0 md:pr-4">
                        <div className="text-[12px] font-black uppercase tracking-widest text-white/60 mb-2 transition-colors group-hover:text-neon-purple">Flirting</div>
                        <div className="text-5xl font-black italic text-neon-purple">{result.flirtingProbability}</div>
                        <div className="text-sm font-medium text-white mt-3 italic leading-relaxed">
                            {result.flirtingComment}
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: result.flirtingProbability }}
                                className="h-full bg-neon-purple"
                            />
                        </div>
                    </div>
                    <div className="text-center group border-b sm:border-b-0 sm:border-r border-white/10 pt-6 sm:pt-0 pb-6 sm:pb-0 sm:pr-4 md:border-r-0">
                        <div className="text-[12px] font-black uppercase tracking-widest text-white/60 mb-2 transition-colors group-hover:text-red-500">Delulu</div>
                        <div className="text-5xl font-black italic text-red-500">{result.deluluLevel}</div>
                        <div className="text-sm font-medium text-white mt-3 italic leading-relaxed">
                            {result.deluluComment}
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: result.deluluLevel }}
                                className="h-full bg-red-500"
                            />
                        </div>
                    </div>
                    <div className="text-center group pt-6 sm:pt-0">
                        <div className="text-[12px] font-black uppercase tracking-widest text-white/60 mb-2 transition-colors group-hover:text-neon-green">Dryness</div>
                        <div className="text-5xl font-black italic text-neon-green">{result.dryTextingPercentage}</div>
                        <div className="text-sm font-medium text-white mt-3 italic leading-relaxed">
                            {result.dryComment}
                        </div>
                        <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: result.dryTextingPercentage }}
                                className="h-full bg-neon-green"
                            />
                        </div>
                    </div>
                </div>

                {/* Flags Grid */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center">
                                <Flag className="w-4 h-4 text-neon-green" />
                            </div>
                            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-neon-green">Green Flags [VALID_SIGNALS]</h4>
                        </div>
                        <ul className="space-y-4">
                            {(result.greenFlags && result.greenFlags.length > 0 ? result.greenFlags : ["Investigation inconclusive: Positive signals not detected."]).map((f: string, i: number) => (
                                <motion.li 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-3 text-base font-medium text-white leading-relaxed border-l-2 border-neon-green/40 pl-4 py-1"
                                >
                                    <span className="text-neon-green/80 mt-0.5 font-bold">0{i+1}</span>
                                    {f}
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            </div>
                            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-red-500">Red Flags [THREAT_DETECTED]</h4>
                        </div>
                        <ul className="space-y-4">
                            {(result.redFlags && result.redFlags.length > 0 ? result.redFlags : ["Threat level surprisingly low or undetected."]).map((f: string, i: number) => (
                                <motion.li 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-3 text-base font-medium text-white leading-relaxed border-l-2 border-red-500/40 pl-4 py-1"
                                >
                                    <span className="text-red-500/80 mt-0.5 font-bold">0{i+1}</span>
                                    {f}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Final Verdict Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-neon-green/5 blur-xl rounded-full opacity-50" />
                    <div className="relative p-10 bg-white/[0.05] border border-white/10 rounded-[2rem] overflow-hidden group">
                        <div className="absolute top-0 right-0 px-6 py-2 bg-neon-green text-black text-[12px] font-black uppercase tracking-widest -rotate-0 rounded-bl-2xl shadow-lg">
                            FINAL JUDGMENT
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-full border-4 border-neon-green/20 flex items-center justify-center shrink-0 relative">
                                <div className="absolute inset-0 border-t-4 border-neon-green rounded-full animate-spin [animation-duration:3s]" />
                                <Skull className="w-10 h-10 text-neon-green" />
                            </div>
                            <div>
                                <p className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-tight mb-4 drop-shadow-sm">
                                    "{result.verdict || "THE DRAMA WAS SO INTENSE THE RECORDS WERE WIPED."}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="h-1 flex-grow bg-white/10 rounded-full" />
                                    <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-white/60 whitespace-nowrap">Status: Case Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Official Stamp Footer */}
                <div className="mt-16 flex justify-between items-end">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-mono text-[8px] text-white/20">
                            SEAL_ID
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center font-mono text-[8px] text-white/20 italic">
                            DRAMA
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-white/10 select-none">
                            // ENCRYPTED_REPORT_V2.0.4.X<br/>
                            // TIMESTAMP: {new Date().toISOString()}
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
