import { Link, useLocation, Outlet } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const navItem = (to, label) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition ${
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
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* MAIN WRAPPER */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:gap-10">
          
          {/* ================= HEADER / NAVBAR ================= */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* LOGO + TITLE */}
            <Link
              to="/"
              className="flex max-w-full items-start gap-3 sm:items-center"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/40 bg-indigo-500/10 text-sm font-semibold text-indigo-200">
                DP
              </div>

              <div className="max-w-full">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/70">
                  Digital Profile
                </p>
                <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                  Portfolio QR Studio
                </h1>
                <p className="text-xs sm:text-sm text-slate-300/80">
                  Create profiles, generate QR, share live pages.
                </p>
              </div>
            </Link>

            {/* NAV */}
            <nav className="flex flex-wrap gap-2">
              {navItem("/", "Create profile")}
              {navItem("/admin", "Admin")}
            </nav>
          </header>

          {/* ================= PAGE CONTENT ================= */}
          <main className="w-full">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
