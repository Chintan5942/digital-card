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
      try {
        const data = await loadProfiles();
        if (active) {
          setProfiles(data);
          setStatus({ state: "success", message: "" });
        }
      } catch {
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
    <section className="rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 sm:p-6 lg:p-8 shadow-xl backdrop-blur">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
            QR Gallery
          </p>
          <h2 className="text-xl sm:text-3xl font-semibold text-slate-50">
            All generated QR codes
          </h2>
          <p className="mt-1 text-sm text-slate-300/80">
            Live view of every QR stored.
          </p>
        </div>

        <Link
          to="/"
          className="w-full sm:w-auto text-center rounded-full border border-indigo-500/60 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-100 hover:bg-indigo-500/20"
        >
          Create another
        </Link>
      </div>

      {/* STATES */}
      {profiles.length === 0 ? (
        <p className="text-sm text-slate-300/80">
          {status.state === "loading"
            ? "Loading profiles..."
            : "No QR codes yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const palette = getPalette(profile.theme);

            return (
              <article
                key={profile.slug}
                className="flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 sm:p-5 transition hover:border-indigo-400/60"
              >
                {/* HEADER */}
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    url={profile.avatarDataUrl}
                    initials={`${profile.firstName[0]}${profile.lastName?.[0] || ""}`}
                    size="9"
                    theme={profile.theme}
                  />

                  <p className="mt-2 text-sm font-semibold text-slate-100 break-words">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <p className="text-xs text-slate-400/80 break-words">
                    {profile.businessName}
                  </p>

                  <span
                    className={`mt-2 rounded-full px-3 py-1 text-[10px] font-semibold ${palette.accentBadge}`}
                  >
                    QR Code
                  </span>
                </div>

                {/* QR */}
                <div className="mt-4 flex justify-center">
                  <img
                    src={profile.qrDataUrl}
                    alt={`QR for ${profile.firstName}`}
                    className={`w-36 sm:w-44 rounded-xl bg-white p-3 ${palette.accentBorder}`}
                  />
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to={`/${profile.slug}`}
                    className="w-full sm:w-auto text-center rounded-full border border-slate-700/70 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:border-indigo-400/60"
                  >
                    View profile
                  </Link>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadQr(profile)}
                      className={`w-full sm:w-auto rounded-full px-3 py-1.5 text-xs font-semibold ${palette.accentBadge}`}
                    >
                      Download
                    </button>

                    <span className="max-w-full truncate text-[11px] text-slate-400/70">
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
