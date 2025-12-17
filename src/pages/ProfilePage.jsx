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
      setStatus({ state: "loading", message: "Loading profile..." });
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
      } catch (error) {
        console.error(error);
        if (active) {
          setProfile(null);
          setStatus({ state: "error", message: "Could not load profile." });
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  const palette = getPalette(profile?.theme);

  const downloadQr = () => {
    if (!profile) return;
    const link = document.createElement("a");
    link.href = profile.qrDataUrl;
    link.download = `${profile.slug}-qr.jpg`;
    link.click();
  };

  const copyLink = async () => {
    if (!profile) return;
    await navigator.clipboard.writeText(profile.profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ================= STATES ================= */

  if (status.state === "loading") {
    return (
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-10 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-semibold text-slate-50">
          Loading profile…
        </h2>
        <p className="mt-2 text-sm text-slate-300/80">
          Fetching the latest data.
        </p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-10 shadow-xl backdrop-blur">
        <h2 className="text-2xl font-semibold text-slate-50">
          Profile not found
        </h2>
        <p className="mt-2 text-sm text-slate-300/80">
          {status.message || "No profile exists for this link."}
        </p>
        <div className="mt-6">
          <Link
            className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
            to="/"
          >
            Create profile
          </Link>
        </div>
      </section>
    );
  }

  /* ================= DATA ================= */

  const services = profile.services
    ? profile.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const socials = [
    { label: "Website", value: profile.businessWebsite },
    { label: "LinkedIn", value: profile.linkedin },
    { label: "GitHub", value: profile.github },
    { label: "YouTube", value: profile.youtube },
    { label: "Twitter/X", value: profile.twitter },
    { label: "Instagram", value: profile.instagram },
  ].filter((item) => item.value);

  /* ================= UI ================= */

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 shadow-xl shadow-indigo-900/30 backdrop-blur">
      <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        {/* ================= LEFT ================= */}
        <div className="flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-inner">
            <Avatar
              url={profile.avatarDataUrl}
              initials={`${profile.firstName[0]}${profile.lastName?.[0] || ""}`}
              size="14"
              theme={profile.theme}
            />

            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
                  Public profile
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${palette.accentBadge}`}
                >
                  Theme: {profile.theme}
                </span>
              </div>

              <h2 className="text-3xl font-semibold text-slate-50">
                {profile.firstName} {profile.lastName}
              </h2>

              <p className="mt-1 text-sm text-slate-300/80">
                {profile.businessName}
              </p>

              {profile.location && (
                <p className="mt-1 text-xs text-slate-400/80">
                  Location: {profile.location}
                </p>
              )}
            </div>
          </div>

          {/* BIO */}
          {profile.bio && (
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5 text-sm text-slate-200/90 leading-relaxed shadow-inner">
              {profile.bio}
            </div>
          )}

          {/* CONTACT + LINKS */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">
                Contact
              </p>
              <div className="mt-3 space-y-1 text-sm text-slate-200/90">
                <p>Phone: {profile.phone}</p>
                <p>Email: {profile.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">
                Links
              </p>
              <div className="mt-3 grid gap-2 text-sm text-slate-200/90">
                {socials.length ? (
                  socials.map((item) => (
                    <a
                      key={item.label}
                      href={item.value}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-indigo-100"
                    >
                      {item.label}
                    </a>
                  ))
                ) : (
                  <p className="text-slate-400/80">
                    No social links provided.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SERVICES */}
          {services.length > 0 && (
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">
                Services / skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {services.map((service) => (
                  <span
                    key={service}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${palette.accentBadge}`}
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT (QR) ================= */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 text-center shadow-inner">
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
            Scan
          </p>

          <img
            src={profile.qrDataUrl}
            alt="QR code for profile"
            className={`w-60 rounded-2xl border bg-white p-4 shadow-lg ${palette.accentBorder}`}
          />

          <p className="text-sm text-slate-300/80 max-w-xs">
            Scanning this QR redirects to the public profile page.
          </p>

          {/* PUBLIC LINK DISPLAY */}
          <div className="w-full rounded-xl border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 truncate">
            {profile.profileUrl}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyLink}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                copied
                  ? "bg-emerald-500/20 text-emerald-100"
                  : palette.accentBadge
              }`}
            >
              {copied ? "Copied!" : "Copy link"}
            </button>

            <button
              type="button"
              onClick={downloadQr}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${palette.accentBadge}`}
            >
              Download QR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
