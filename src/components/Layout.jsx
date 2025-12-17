import { Link, useLocation, Outlet } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const navItem = (to, label) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          active
            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
            : "text-slate-200/90 hover:bg-slate-800/70"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 sm:py-14">
        {/* HEADER / NAVBAR */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/40 bg-indigo-500/10 text-base font-semibold text-indigo-200">
              DP
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/70">
                Digital Profile
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                Portfolio QR Studio
              </h1>
              <p className="text-sm text-slate-300/80">
                Create profiles, generate QR, share live pages.
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {navItem("/", "Create profile")}
            {navItem("/admin", "Admin")}
          </nav>
        </header>

        
        <Outlet />
      </div>
    </div>
  );
}
