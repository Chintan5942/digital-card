import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import { getPalette } from "../utils/theme";
import { getProfile } from "../storage";

export default function ProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState({
    state: "loading",
    message: "Loading profile...",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getProfile(slug);
        if (!active) return;
        if (!data) {
          setProfile(null);
          setStatus({ state: "error", message: "Profile not found." });
          return;
        }
        setProfile(data);
        setStatus({ state: "success", message: "" });
      } catch {
        if (active) {
          setProfile(null);
          setStatus({ state: "error", message: "Could not load profile." });
        }
      }
    })();
    return () => (active = false);
  }, [slug]);

  const palette = getPalette(profile?.theme);

  const downloadQr = () => {
    const link = document.createElement("a");
    link.href = profile.qrDataUrl;
    link.download = `${profile.slug}-qr.jpg`;
    link.click();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(profile.profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (status.state === "loading") {
    return (
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
          Loading profile…
        </h2>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-50">
          Profile not found
        </h2>
        <Link
          className="mt-4 inline-block rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white"
          to="/"
        >
          Create profile
        </Link>
      </section>
    );
  }

  const services = profile.services
    ? profile.services.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const socials = [
    { label: "Website", value: profile.businessWebsite },
    { label: "LinkedIn", value: profile.linkedin },
    { label: "GitHub", value: profile.github },
    { label: "YouTube", value: profile.youtube },
    { label: "Twitter/X", value: profile.twitter },
    { label: "Instagram", value: profile.instagram },
  ].filter((i) => i.value);

  return (
  <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.6fr_1fr]">
      
      {/* ================= LEFT ================= */}
      <div className="flex flex-col gap-5">
        
        {/* HEADER */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 sm:p-6">
          <Avatar
            url={profile.avatarDataUrl}
            initials={`${profile.firstName[0]}${profile.lastName?.[0] || ""}`}
            size="12 sm:10"
            theme={profile.theme}
          />

          <div className="text-center px-2">
            <div className="flex flex-wrap justify-center gap-2">
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
                Public profile
              </p>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${palette.accentBadge}`}>
                {profile.theme}
              </span>
            </div>

            <h2 className="mt-2 text-xl sm:text-3xl font-semibold text-slate-50">
              {profile.firstName} {profile.lastName}
            </h2>

            <p className="text-sm text-slate-300/80 break-words">
              {profile.businessName}
            </p>

            {profile.location && (
              <p className="text-xs text-slate-400/80 break-words">
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* BIO */}
        {profile.bio && (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200/90 leading-relaxed break-words">
            {profile.bio}
          </div>
        )}

        {/* CONTACT + LINKS */}
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">
              Contact
            </p>
            <p className="mt-2 text-sm break-words">
              Phone: {profile.phone}
            </p>
            <p className="text-sm break-words">
              Email: {profile.email}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">
              Links
            </p>
            <div className="mt-2 space-y-1 text-sm">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.value}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all hover:text-indigo-100"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SERVICES */}
        {services.length > 0 && (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">
              Services / skills
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${palette.accentBadge}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= RIGHT (QR) ================= */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
          Scan
        </p>

        <img
          src={profile.qrDataUrl}
          alt="QR code"
          className={`w-36 sm:w-56 rounded-2xl bg-white p-3 ${palette.accentBorder}`}
        />

        <div className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs break-all text-center">
          {profile.profileUrl}
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={copyLink}
            className={`w-full sm:w-auto rounded-full px-4 py-2 text-xs font-semibold ${
              copied ? "bg-emerald-500/20 text-emerald-100" : palette.accentBadge
            }`}
          >
            {copied ? "Copied!" : "Copy link"}
          </button>

          <button
            onClick={downloadQr}
            className={`w-full sm:w-auto rounded-full px-4 py-2 text-xs font-semibold ${palette.accentBadge}`}
          >
            Download QR
          </button>
        </div>
      </div>
    </div>
  </section>
);

}
