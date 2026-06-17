import { motion } from "motion/react";
import { Radio, Flame, MessageSquare, Zap, ChevronRight } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 py-20 md:py-32"
    >
      <div className="max-w-4xl mx-auto text-center mb-32">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-xs font-bold uppercase tracking-widest text-neon-blue mb-8"
        >
          <Zap className="w-3 h-3 fill-neon-blue" />
          System Status: Online & Unhinged
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-8"
        >
          The Internet Was A <span className="text-neon-purple line-through decoration-white/20">Mistake</span>. <br />
          <span className="neon-text-blue">We Made It Worse.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/50 font-medium max-w-2xl mx-auto mb-12"
        >
          AI Chaos Lab is where artificial intelligence loses its filter. 
          Stop using AI for productivity and start using it for pure chaos.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/debate">
            <Button variant="purple" className="min-w-[200px]">
              Start Chaos <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        <FeatureCard
          title="The Debate Arena"
          description="Watch two unhinged humans destroy each other over the most controversial topics. Complete with heat meters and total logical collapse."
          icon={Radio}
          path="/debate"
          color="purple"
          className="md:col-span-2 md:row-span-2"
        />
        
        <FeatureCard
          title="Roast My Resume"
          description="Upload your resume and let our AI CEO dismantle your entire existence."
          icon={Flame}
          path="/roast"
          color="blue"
          className="md:col-span-1 md:row-span-1"
        />

        <FeatureCard
          title="Analyze My Chat"
          description="DMs analyzed by a toxic best friend."
          icon={MessageSquare}
          path="/analyze"
          color="pink"
          className="md:col-span-1 md:row-span-1"
        />

        <div className="glass rounded-3xl border-white/5 p-8 flex flex-col justify-center gap-4 hover:neon-border-blue transition-all duration-500">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Server Load: CRITICAL</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "88%" }}
                    className="h-full bg-neon-blue"
                />
            </div>
        </div>

        <div className="glass rounded-3xl border-white/5 p-8 flex items-center justify-between group hover:border-neon-pink transition-all duration-500">
            <div>
                <div className="text-xl font-black italic uppercase italic tracking-tighter">Lab News</div>
                <div className="text-[10px] font-bold text-white/30 truncate">V2.0 Update: Pure chaos enabled.</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-neon-pink/10 flex items-center justify-center text-neon-pink group-hover:rotate-45 transition-transform">
                <ChevronRight className="w-5 h-5" />
            </div>
        </div>
      </div>

      <div className="mt-32 p-12 glass rounded-[3rem] border-white/5 cyber-grid relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black italic uppercase italic tracking-tighter mb-6">
              AI Powered by <span className="text-neon-purple">Total Chaos</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              We've tuned our models to be 400% more sarcastic than your local tech bro. 
              No filters. No corporate speak. Just cold, hard truth with a side of memes.
            </p>
            <div className="flex gap-8">
              <div>
                <div className="text-3xl font-black text-neon-purple">420%</div>
                <div className="text-[10px] uppercase tracking-widest text-white/30">Toxicity Increase</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square glass rounded-2xl border-neon-blue/20 flex flex-col items-center justify-center gap-4 animate-float">
                <Radio className="w-10 h-10 text-neon-blue" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Live Arena</span>
            </div>
            <div className="aspect-square glass rounded-2xl border-neon-purple/20 flex flex-col items-center justify-center gap-4 animate-float [animation-delay:1s]">
                <Flame className="w-10 h-10 text-neon-purple" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Savage Roast</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
