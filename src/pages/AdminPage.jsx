import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import { getPalette } from "../utils/theme";
import { loadProfiles } from "../storage";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
  const isAdmin = localStorage.getItem("admin_authed") === "true";
  if (isAdmin) {
    setIsAuthed(true);
  }
}, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === "info@codegrin.com" && password === "test") {
  setIsAuthed(true);
  setAuthError("");
  localStorage.setItem("admin_authed", "true"); // ✅ ADD
} else {
      setAuthError("Invalid credentials.");
    }
  };

  useEffect(() => {
    if (!isAuthed) return;
    let active = true;
    (async () => {
      setStatus({ state: "loading", message: "Loading profiles..." });
      try {
        const data = await loadProfiles();
        if (!active) return;
        setProfiles(data);
        setStatus({
          state: "success",
          message: `Loaded ${data.length} profiles.`,
        });
      } catch (error) {
        console.error(error);
        if (active) {
          setStatus({
            state: "error",
            message: "Could not load profiles.",
          });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthed]);

  /* ================= LOGIN ================= */

  if (!isAuthed) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-800/80 bg-slate-900/80 p-10 shadow-xl shadow-indigo-900/30 backdrop-blur">
        <h2 className="text-2xl font-semibold text-slate-50">
          Admin login
        </h2>
        <p className="mt-2 text-sm text-slate-300/80">
          Enter the admin credentials to view all generated profiles.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
          <label className="grid gap-1 text-sm text-slate-200/90">
            <span>Email</span>
            <input
              type="email"
              className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="grid gap-1 text-sm text-slate-200/90">
            <span>Password</span>
            <input
              type="password"
              className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {authError && (
            <p className="text-sm text-rose-200/90">
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:bg-indigo-400"
          >
            Login
          </button>

          <p className="text-xs text-slate-400/80">
            Allowed user: info@codegrin.com / test
          </p>
        </form>
      </section>
    );
  }

  /* ================= ADMIN VIEW ================= */

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 shadow-xl shadow-indigo-900/30 backdrop-blur">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
            Admin dashboard
          </p>
          <h2 className="text-3xl font-semibold text-slate-50">
            All generated profiles
          </h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Secured view for codegrin team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/qr"
            className="rounded-full border border-indigo-500/60 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/20"
          >
            View QR gallery
          </Link>

          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">
            Authenticated
          </span>
        </div>
      </div>

      {/* STATUS */}
      {status.message && (
        <p
          className={`mb-6 text-sm ${
            status.state === "error"
              ? "text-rose-200/90"
              : status.state === "loading"
              ? "text-slate-300/80"
              : "text-emerald-200/90"
          }`}
        >
          {status.message}
        </p>
      )}

      {/* CONTENT */}
      {profiles.length === 0 ? (
        <p className="text-sm text-slate-300/80">
          {status.state === "loading"
            ? "Loading profiles from Supabase..."
            : "No profiles available yet."}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {profiles.map((profile) => {
            const palette = getPalette(profile.theme);
            const createdLabel = profile.createdAt
              ? new Date(profile.createdAt).toLocaleString()
              : "N/A";

            return (
              <article
                key={profile.slug}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-inner transition hover:border-indigo-400/60"
              >
                {/* CARD HEADER */}
                <div className="flex items-start gap-4">
                  <Avatar
                    url={profile.avatarDataUrl}
                    initials={`${profile.firstName?.[0] || ""}${
                      profile.lastName ? profile.lastName[0] : ""
                    }`}
                    size="10"
                    theme={profile.theme}
                  />

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-100">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-slate-400/80">
                      {profile.businessName}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400/80">
                      Email: {profile.email}
                    </p>
                    <p className="text-[11px] text-slate-400/80">
                      Phone: {profile.phone}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${palette.accentBadge}`}
                  >
                    {profile.theme || "indigo"}
                  </span>
                </div>

                {/* CARD FOOTER */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-300/80">
                  <div className="flex flex-col">
                    <span className="truncate text-[11px] text-slate-400/80">
                      /{profile.slug}
                    </span>
                    <span className="text-[11px] text-slate-500/80">
                      Created: {createdLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/${profile.slug}`}
                      className="rounded-full border border-slate-700/70 px-3 py-1 font-semibold text-slate-100 transition hover:border-indigo-400/60 hover:text-indigo-100"
                    >
                      Open
                    </Link>
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-700/70 px-3 py-1 font-semibold text-slate-100 transition hover:border-indigo-400/60 hover:text-indigo-100"
                    >
                      Public link
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
