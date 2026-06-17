import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Upload, FileText, AlertCircle, Bomb, Trash2, Zap, ShieldAlert } from "lucide-react";
import { Button } from "../components/Button";
import { geminiService } from "../services/geminiService";
import { cn } from "../lib/utils";
import confetti from "canvas-confetti";

export const RoastResume = () => {
  const [resumeText, setResumeText] = useState("");
  const [intensity, setIntensity] = useState("Savage");
  const [mode, setMode] = useState("Gordon Ramsay");
  const [isRoasting, setIsRoasting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startRoast = async () => {
    if (!resumeText) return;
    setIsRoasting(true);
    setResult(null);
    
    try {
      const roastData = await geminiService.roastResume(resumeText, intensity, mode);
      setResult(roastData);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bc13fe', '#01ffff', '#ff00ff']
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsRoasting(false);
    }
  };

  const intensities = [
    { name: "Mild", icon: AlertCircle, color: "text-neon-blue" },
    { name: "Savage", icon: Flame, color: "text-neon-purple" },
    { name: "Nuclear", icon: Bomb, color: "text-red-500" },
  ];

  const modes = ["Angry CEO", "Gordon Ramsay", "Indian Parent", "Startup Founder", "HR Recruiter"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-12 max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">
          Roast My <span className="text-neon-blue font-mono">Resume</span>
        </h1>
        <p className="text-white/50 font-medium">Because your career is already a joke. Let's make it official.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="glass rounded-3xl border-white/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText className="w-32 h-32" />
            </div>
            <textarea
                placeholder="PASTE YOUR RESUME TEXT HERE AND PREPARE FOR DESTRUCTION..."
                className="w-full h-80 bg-transparent border-none focus:outline-none font-mono text-sm uppercase tracking-wider leading-relaxed resize-none relative z-10"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
            />
            
            <div className="flex items-center gap-4 mt-4 pt-6 border-t border-white/5 relative z-10">
                <div className="flex-grow flex items-center gap-2 text-[10px] font-bold tracking-widest text-white/30 uppercase">
                    <Trash2 className="w-3 h-3" /> Auto-Delete after roast enabled
                </div>
                <div className="hidden md:flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse [animation-delay:0.4s]" />
                </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
                variant="blue" 
                onClick={startRoast} 
                disabled={isRoasting || !resumeText}
                className="flex-grow shadow-[0_0_20px_rgba(1,255,255,0.2)] hover:shadow-[0_0_30px_rgba(1,255,255,0.4)] transition-all"
            >
                {isRoasting ? "OBLITERATING..." : "OBLITERATE"}
            </Button>
            <Button variant="ghost" onClick={() => setResumeText("")}>
              CLEAR
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass rounded-3xl border-white/5 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-neon-purple" /> Roast Intensity
            </h3>
            <div className="flex flex-col gap-3">
              {intensities.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setIntensity(item.name)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all uppercase font-bold tracking-widest text-[10px]",
                    intensity === item.name 
                      ? "bg-white/10 border-white/20 text-white" 
                      : "bg-transparent border-white/5 text-white/30 hover:border-white/10"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className={cn("w-4 h-4", item.color)} />
                    {item.name}
                  </span>
                  {intensity === item.name && <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl border-white/5 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="w-4 h-4 text-neon-blue" /> AI Mode
            </h3>
            <div className="flex flex-col gap-2">
              {modes.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "text-left p-3 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all",
                    mode === m 
                      ? "bg-neon-blue/10 text-neon-blue" 
                      : "text-white/30 hover:bg-white/5 hover:text-white/60"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="glass rounded-[2rem] border-neon-purple/20 p-8 shadow-[0_0_40px_rgba(186,19,254,0.1)]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">The Roast</h3>
                <div className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-[10px] font-bold uppercase rounded-full">
                    {mode}
                </div>
              </div>
              <p className="text-white font-medium leading-relaxed font-mono text-sm p-6 bg-white/5 rounded-2xl border border-white/5 whitespace-pre-wrap">
                {result.roast}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-3xl p-6 border-white/5 text-center">
                    <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-2 text-center">Employability</div>
                    <div className="text-4xl font-black text-neon-blue">{result.employabilityScore}%</div>
                </div>
                <div className="glass rounded-3xl p-6 border-white/5 text-center">
                    <div className="text-[8px] uppercase tracking-widest text-white/30 font-bold mb-2 text-center">Cringe Level</div>
                    <div className="text-4xl font-black text-neon-pink">{result.linkedinCringeLevel}</div>
                </div>
              </div>

              <div className="glass rounded-3xl p-8 border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-neon-purple" /> Improvement Tips
                </h4>
                <ul className="flex flex-col gap-4">
                  {(result.improvementTips || []).map((tip: string, i: number) => (
                    <li key={i} className="flex gap-4 group">
                      <div className="w-6 h-6 rounded-lg bg-neon-purple/10 flex items-center justify-center text-[10px] font-black text-neon-purple border border-neon-purple/20 flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
