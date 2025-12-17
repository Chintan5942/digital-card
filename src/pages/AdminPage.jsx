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
    if (isAdmin) setIsAuthed(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === "info@codegrin.com" && password === "test") {
      setIsAuthed(true);
      setAuthError("");
      localStorage.setItem("admin_authed", "true");
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
        setStatus({ state: "success", message: `Loaded ${data.length} profiles.` });
      } catch {
        if (active)
          setStatus({ state: "error", message: "Could not load profiles." });
      }
    })();
    return () => (active = false);
  }, [isAuthed]);

  /* LOGIN */
  if (!isAuthed) {
    return (
      <section className="mx-auto max-w-md sm:max-w-xl rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 sm:p-6 lg:p-10 shadow-xl backdrop-blur">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
          Admin login
        </h2>
        <p className="mt-2 text-sm text-slate-300/80">
          Enter admin credentials
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-slate-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-slate-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {authError && <p className="text-sm text-rose-300">{authError}</p>}

          <button className="w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white">
            Login
          </button>
        </form>
      </section>
    );
  }

  /* ADMIN */
  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 sm:p-6 lg:p-8 shadow-xl backdrop-blur">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
            Admin dashboard
          </p>
          <h2 className="text-xl sm:text-3xl font-semibold text-slate-50">
            All profiles
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/qr"
            className="w-full sm:w-auto text-center rounded-full border border-indigo-500/60 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100"
          >
            QR gallery
          </Link>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100 text-center">
            Authenticated
          </span>
        </div>
      </div>

      {/* STATUS */}
      {status.message && (
        <p className="mb-4 text-sm text-slate-300">{status.message}</p>
      )}

      {/* CONTENT */}
      {profiles.length === 0 ? (
        <p className="text-sm text-slate-300">No profiles found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profiles.map((profile) => {
            const palette = getPalette(profile.theme);
            const createdLabel = profile.createdAt
              ? new Date(profile.createdAt).toLocaleString()
              : "N/A";

            return (
              <article
                key={profile.slug}
                className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4"
              >
                {/* HEADER */}
                <div className="flex items-start gap-3">
                  <Avatar
                    url={profile.avatarDataUrl}
                    initials={`${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`}
                    size="9"
                    theme={profile.theme}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {profile.businessName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {profile.email}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {profile.phone}
                    </p>
                  </div>

                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${palette.accentBadge}`}>
                    {profile.theme}
                  </span>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[11px] text-slate-400 truncate">
                    /{profile.slug}
                    <div className="text-[11px] text-slate-500">
                      {createdLabel}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/${profile.slug}`}
                      className="w-full sm:w-auto text-center rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-100"
                    >
                      Open
                    </Link>
                    <a
                      href={profile.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-100"
                    >
                      Public
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
