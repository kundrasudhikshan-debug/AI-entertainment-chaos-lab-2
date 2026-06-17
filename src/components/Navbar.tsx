import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Radio, Flame, MessageSquare, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Arena', path: '/debate', icon: Radio },
    { name: 'Roast', path: '/roast', icon: Flame },
    { name: 'Analyze', path: '/analyze', icon: MessageSquare },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-6 glass border-b border-white/5 backdrop-blur-xl">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-neon-purple rounded-lg flex items-center justify-center neon-border-purple group-hover:rotate-12 transition-transform duration-300">
          <Terminal className="text-white w-6 h-6" />
        </div>
        <span className="font-display font-black text-xl italic tracking-tighter uppercase">
          AI Chaos <span className="text-neon-purple">Lab</span>
        </span>
      </Link>

      <div className="flex gap-1 md:gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:text-white",
              location.pathname === item.path ? "text-white" : "text-white/50"
            )}
          >
            {location.pathname === item.path && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 bg-white/10 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <item.icon className="w-3 h-3" />
              <span className="hidden md:inline">{item.name}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
