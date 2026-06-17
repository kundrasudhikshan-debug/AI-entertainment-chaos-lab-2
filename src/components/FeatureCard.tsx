import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: "purple" | "blue" | "pink";
  className?: string;
}

export const FeatureCard = ({ title, description, icon: Icon, path, color, className }: FeatureCardProps) => {
  const borderColors = {
    purple: "group-hover:neon-border-purple",
    blue: "group-hover:neon-border-blue",
    pink: "group-hover:border-neon-pink group-hover:shadow-[0_0_10px_#ff00ff]"
  };

  const iconColors = {
    purple: "text-neon-purple",
    blue: "text-neon-blue",
    pink: "text-neon-pink"
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn("group relative", className)}
    >
      <Link to={path}>
        <div className={cn(
          "h-full p-8 glass rounded-3xl border border-white/5 transition-all duration-500",
          borderColors[color]
        )}>
          <div className={cn(
            "w-16 h-16 mb-6 rounded-2xl flex items-center justify-center bg-white/5",
            iconColors[color]
          )}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black mb-3 italic uppercase tracking-tighter">
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed font-medium">
            {description}
          </p>
          
          <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Enter Chaos</span>
            <div className="w-12 h-px bg-white/20" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
