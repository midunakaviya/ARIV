export default function Footer() {
  return (
    <footer className="bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 text-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Ariv</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              The ultimate platform for chatbot experimentation
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Roadmap</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Resources</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Blog</li>
              <li>Case Studies</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">© 2026 Ariv. All rights reserved.</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">Gmail</span>
            <span className="hover:text-white cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
