export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-4">
              <div className="w-[2px] h-[5px] bg-accent/50 rounded-sm" />
              <div className="w-[2px] h-[8px] bg-accent/50 rounded-sm" />
              <div className="w-[2px] h-[11px] bg-accent/50 rounded-sm" />
              <div className="w-[2px] h-[14px] bg-accent/50 rounded-sm" />
            </div>
            <span className="font-heading font-700 text-sm text-text-secondary">
              Sub Signal
            </span>
          </div>

          {/* Tagline */}
          <p className="font-mono text-[11px] text-text-secondary text-center">
            Spotlighting artists before they break through
          </p>

          {/* Copyright */}
          <p className="font-mono text-[10px] text-text-secondary/50">
            &copy; {new Date().getFullYear()} Sub Signal
          </p>
        </div>
      </div>
    </footer>
  );
}
