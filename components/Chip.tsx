export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted transition-colors duration-200 hover:border-neon-cyan/50 hover:text-neon-cyan">
      {children}
    </span>
  );
}
