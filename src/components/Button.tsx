import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children?: ReactNode;
  variant?: "purple" | "blue" | "ghost";
  glow?: boolean;
}

export const Button = ({ 
  children, 
  variant = "purple", 
  glow = true, 
  className, 
  ...props 
}: ButtonProps) => {
  const variants = {
    purple: "bg-neon-purple neon-border-purple text-white hover:bg-neon-purple/80",
    blue: "bg-neon-blue neon-border-blue text-black font-bold hover:bg-neon-blue/80",
    ghost: "border border-white/10 hover:bg-white/5 text-white/70 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-8 py-4 rounded-xl font-display font-black uppercase italic tracking-widest text-sm transition-all duration-300",
        variants[variant],
        glow && "after:content-[''] after:absolute after:inset-0 after:rounded-xl after:shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:after:shadow-[0_0_30px_rgba(188,19,254,0.6)]",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
      </span>
    </motion.button>
  );
};
