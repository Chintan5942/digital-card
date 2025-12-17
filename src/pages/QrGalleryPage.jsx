import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import { getPalette } from "../utils/theme";
import { loadProfiles } from "../storage";

export default function QrGalleryPage() {
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState({
    state: "loading",
    message: "Loading profiles...",
  });

  useEffect(() => {
    let active = true;
    (async () => {
      setStatus({ state: "loading", message: "Loading profiles..." });
      try {
        const data = await loadProfiles();
        if (active) {
          setProfiles(data);
          setStatus({ state: "success", message: "" });
        }
      } catch (error) {
        console.error(error);
        if (active)
          setStatus({ state: "error", message: "Could not load profiles." });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const downloadQr = (profile) => {
    const link = document.createElement("a");
    link.href = profile.qrDataUrl;
    link.download = `${profile.slug}-qr.jpg`;
    link.click();
  };

  return (
    <section className=" rounded-3xl  border border-slate-800/80 bg-slate-900/80 p-8 shadow-xl shadow-indigo-900/30 backdrop-blur">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
            QR Gallery
          </p>
          <h2 className="text-3xl font-semibold text-slate-50">
            All generated QR codes
          </h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Live view of every QR stored in Supabase.
          </p>
        </div>

        <Link
          to="/"
          className="rounded-full border border-indigo-500/60 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/20"
        >
          Create another
        </Link>
      </div>

      {/* EMPTY / LOADING STATE */}
      {profiles.length === 0 ? (
        <p className="text-sm text-slate-300/80">
          {status.state === "loading"
            ? "Loading profiles from Supabase..."
            : "No QR codes yet. Create a profile first."}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const palette = getPalette(profile.theme);

            return (
              <article
                key={profile.slug}
                className="group rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-inner shadow-slate-950/40 transition hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-indigo-900/40"
              >
                {/* CARD HEADER */}
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    url={profile.avatarDataUrl}
                    initials={`${profile.firstName[0]}${
                      profile.lastName ? profile.lastName[0] : ""
                    }`}
                    size="10"
                    theme={profile.theme}
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-100">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-xs text-slate-400/80">
                    {profile.businessName}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${palette.accentBadge}`}
                  >
                    QR Code
                  </span>
                </div>

                {/* QR IMAGE */}
                <div className="mt-4 flex justify-center">
                  <img
                    src={profile.qrDataUrl}
                    alt={`QR for ${profile.firstName}`}
                    className={`w-44 rounded-2xl border bg-white p-4 shadow-lg ${palette.accentBorder}`}
                  />
                </div>

                {/* CARD FOOTER */}
                <div className="mt-5 flex items-center justify-between text-xs text-slate-300/80">
                  <Link
                    to={`/${profile.slug}`}
                    className="rounded-full border border-slate-700/70 px-3 py-1 font-semibold text-slate-100 transition hover:border-indigo-400/60 hover:text-indigo-100"
                  >
                    View profile
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadQr(profile)}
                      className={`rounded-full px-3 py-1 font-semibold transition ${palette.accentBadge}`}
                    >
                      Download
                    </button>

                    <span className="max-w-[80px] truncate text-[11px] text-slate-400/70">
                      /{profile.slug}
                    </span>
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
