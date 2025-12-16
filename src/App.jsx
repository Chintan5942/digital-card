import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import QRCode from "qrcode";
import { getProfile, loadProfiles, saveProfile } from "./storage";

const themePalettes = {
  indigo: {
    accentText: "text-indigo-100",
    accentBadge: "bg-indigo-500/15 text-indigo-100 border border-indigo-500/50",
    accentButton: "bg-indigo-500 hover:bg-indigo-400 text-white",
    accentBorder: "border-indigo-400/60",
    accentRing: "focus:border-indigo-400/60 focus:ring-indigo-500/40",
  },
  emerald: {
    accentText: "text-emerald-100",
    accentBadge: "bg-emerald-500/15 text-emerald-100 border border-emerald-500/50",
    accentButton: "bg-emerald-500 hover:bg-emerald-400 text-white",
    accentBorder: "border-emerald-400/60",
    accentRing: "focus:border-emerald-400/60 focus:ring-emerald-500/40",
  },
  rose: {
    accentText: "text-rose-100",
    accentBadge: "bg-rose-500/15 text-rose-100 border border-rose-500/50",
    accentButton: "bg-rose-500 hover:bg-rose-400 text-white",
    accentBorder: "border-rose-400/60",
    accentRing: "focus:border-rose-400/60 focus:ring-rose-500/40",
  },
  amber: {
    accentText: "text-amber-100",
    accentBadge: "bg-amber-500/15 text-amber-100 border border-amber-500/50",
    accentButton: "bg-amber-500 hover:bg-amber-400 text-slate-950",
    accentBorder: "border-amber-400/60",
    accentRing: "focus:border-amber-400/60 focus:ring-amber-500/40",
  },
};

const initialForm = {
  firstName: "",
  lastName: "",
  businessName: "",
  businessWebsite: "",
  linkedin: "",
  github: "",
  youtube: "",
  twitter: "",
  instagram: "",
  phone: "",
  email: "",
  bio: "",
  location: "",
  services: "",
  theme: "indigo",
  avatarDataUrl: "",
};

const fieldGrid = [
  { name: "firstName", label: "First name", required: true },
  { name: "lastName", label: "Last name", required: true },
  { name: "businessName", label: "Business name", required: true },
  { name: "businessWebsite", label: "Business website", placeholder: "https://example.com" },
  { name: "phone", label: "Phone number", required: true, placeholder: "+1 555 123 4567" },
  { name: "email", label: "Email", required: true, placeholder: "name@email.com" },
];

const socialFields = [
  { name: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/in/username" },
  { name: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel" },
  { name: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/handle" },
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
];

const themeOptions = [
  { value: "indigo", label: "Indigo" },
  { value: "emerald", label: "Emerald" },
  { value: "rose", label: "Rose" },
  { value: "amber", label: "Amber" },
];

function slugify(value) {
  const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base || "profile";
}

function getPalette(theme) {
  return themePalettes[theme] || themePalettes.indigo;
}

function Avatar({ url, initials, theme = "indigo", size = "12", className = "" }) {
  const palette = getPalette(theme);
  const sizeClass = size === "14" ? "h-14 w-14" : size === "10" ? "h-10 w-10" : "h-12 w-12";
  const textSize = size === "14" ? "text-xl" : "text-lg";
  const fallbackInitials = initials || "DP";

  if (url) {
    return (
      <img
        src={url}
        alt="Avatar"
        className={`${sizeClass} rounded-2xl border border-slate-700/70 object-cover shadow-inner shadow-slate-950/40 ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex ${sizeClass} items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-900/60 ${textSize} font-semibold ${palette.accentText} ${className}`}
    >
      {fallbackInitials}
    </div>
  );
}

function Layout({ children }) {
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
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/40 bg-indigo-500/10 text-base font-semibold text-indigo-200">
              DP
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/70">Digital Profile</p>
              <h1 className="text-2xl font-semibold leading-tight">Portfolio QR Studio</h1>
              <p className="text-sm text-slate-300/80">Create profiles, generate QR, share live pages.</p>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            {navItem("/", "Create profile")}
            {navItem("/qr", "QR gallery")}
          </nav>
        </header>
        {children}
        <footer className="flex flex-col gap-2 pb-4 text-sm text-slate-400/80 sm:flex-row sm:items-center sm:justify-between">
          <p>Demo stores profiles in localStorage; each profile has a public URL and QR saved as JPG.</p>
          <p className="text-slate-400/60">Scan goes to http://localhost:5173/&lt;firstname&gt;</p>
        </footer>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [createdLink, setCreatedLink] = useState("");

  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, avatarDataUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.firstName || !form.lastName || !form.businessName || !form.phone || !form.email) {
      setStatus({ state: "error", message: "Please fill all required fields." });
      return;
    }

    try {
      setStatus({ state: "loading", message: "Generating QR code..." });
      const baseSlug = slugify(form.firstName);
      let slug = baseSlug;
      let counter = 2;
      while (profiles.some((p) => p.slug === slug)) {
        slug = `${baseSlug}-${counter++}`;
      }

      const profileUrl = `${window.location.origin}/${slug}`;
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
        type: "image/jpeg",
        margin: 1,
        color: { dark: "#0f172a", light: "#ffffff" },
      });

      const profile = {
        ...form,
        slug,
        profileUrl,
        qrDataUrl,
        createdAt: Date.now(),
      };

      const updated = saveProfile(profile);
      setProfiles(updated);
      setCreatedLink(profileUrl);
      setStatus({ state: "success", message: "Profile created and QR saved (JPG data URL)." });
      navigate(`/qr`);
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setStatus({ state: "error", message: "Could not create the profile. Please try again." });
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-indigo-900/30 backdrop-blur">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">Create</p>
            <h2 className="text-2xl font-semibold text-slate-50">Public profile + QR</h2>
            <p className="text-sm text-slate-300/80">Fill the fields, submit, and we will generate a public page and QR code.</p>
          </div>
          <Link
            to="/qr"
            className="rounded-full border border-indigo-500/60 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/20"
          >
            View QR gallery
          </Link>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            {fieldGrid.map((field) => (
              <label key={field.name} className="group flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-slate-200/90">
                  <span>{field.label}</span>
                  {field.required ? <span className="text-xs text-indigo-200/80">Required</span> : null}
                </div>
                <input
                  className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner shadow-slate-950/40 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  type={field.name === "email" ? "email" : "text"}
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {socialFields.map((field) => (
              <label key={field.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-slate-200/90">
                  <span>{field.label}</span>
                  <span className="text-xs text-slate-400/70">Optional</span>
                </div>
                <input
                  className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner shadow-slate-950/40 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  type="text"
                />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm text-slate-200/90">
                <span>Bio / summary</span>
                <span className="text-xs text-slate-400/70">Optional</span>
              </div>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Short blurb about what you do and who you help."
                className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner shadow-slate-950/40 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
              />
            </label>
            <div className="grid gap-4">
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-slate-200/90">
                  <span>Location</span>
                  <span className="text-xs text-slate-400/70">Optional</span>
                </div>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner shadow-slate-950/40 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
                  type="text"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm text-slate-200/90">
                  <span>Services / skills (comma separated)</span>
                  <span className="text-xs text-slate-400/70">Optional</span>
                </div>
                <input
                  name="services"
                  value={form.services}
                  onChange={handleChange}
                  placeholder="Branding, Web design, Frontend dev"
                  className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-slate-100 shadow-inner shadow-slate-950/40 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
                  type="text"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40">
              <div className="flex  items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Avatar / logo</p>
                  <p className="text-xs text-slate-400/80">JPG or PNG, shown on the public profile.</p>
                </div>
                <Avatar
                  url={form.avatarDataUrl}
                  initials={`${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}` || "DP"}
                  size="12"
                  theme={form.theme}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="text-xs text-slate-300"
              />
            </label>

            <label className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner shadow-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Accent theme</p>
                  <p className="text-xs text-slate-400/80">Applies to buttons, badges, and QR cards.</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPalette(form.theme).accentBadge}`}>Live</span>
              </div>
              <select
                name="theme"
                value={form.theme}
                onChange={handleChange}
                className={`rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 shadow-inner shadow-slate-950/40 outline-none transition ${getPalette(form.theme).accentRing}`}
              >
                {themeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-[1px] hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
            disabled={status.state === "loading"}
          >
            {status.state === "loading" ? "Creating..." : "Generate profile + QR"}
          </button>
          {status.message ? (
            <p
              className={`text-sm ${
                status.state === "error" ? "text-rose-200/90" : status.state === "success" ? "text-emerald-200/90" : "text-slate-300"
              }`}
            >
              {status.message}
            </p>
          ) : null}
          {createdLink ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-800/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-200/90">
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-100">New</span>
              <span className="truncate">{createdLink}</span>
            </div>
          ) : null}
        </form>
      </section>

      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-indigo-900/30 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">Library</p>
            <h3 className="text-lg font-semibold text-slate-50">Your generated profiles</h3>
          </div>
          <Link to="/qr" className="text-xs font-semibold text-indigo-200 hover:text-indigo-100">
            See all
          </Link>
        </div>
        {profiles.length === 0 ? (
          <p className="text-sm text-slate-300/80">No profiles yet. Create one to see it here and in the QR gallery.</p>
        ) : (
          <div className="grid gap-3">
            {profiles
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((profile) => {
                const palette = getPalette(profile.theme);
                return (
                  <div
                    key={profile.slug}
                    className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 px-4 py-3"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Avatar
                        url={profile.avatarDataUrl}
                        initials={`${profile.firstName[0]}${profile.lastName ? profile.lastName[0] : ""}`}
                        size="10"
                        theme={profile.theme}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-100">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-xs text-slate-400/90">{profile.businessName}</p>
                        <p className={`text-[11px] ${palette.accentText}`}>Theme: {profile.theme}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/${profile.slug}`}
                        className="rounded-full border border-slate-700/70 px-3 py-1 text-xs font-semibold text-slate-100 hover:border-indigo-400/60 hover:text-indigo-100"
                      >
                        View
                      </Link>
                      <Link
                        to="/qr"
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${palette.accentBadge}`}
                      >
                        QR
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}

function ProfilePage() {
  const { slug } = useParams();
  const profile = useMemo(() => getProfile(slug), [slug]);
  const palette = getPalette(profile?.theme);

  const downloadQr = () => {
    if (!profile) return;
    const link = document.createElement("a");
    link.href = profile.qrDataUrl;
    link.download = `${profile.slug}-qr.jpg`;
    link.click();
  };

  if (!profile) {
    return (
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 text-slate-100 shadow-xl shadow-indigo-900/30 backdrop-blur">
        <h2 className="text-2xl font-semibold">Profile not found</h2>
        <p className="mt-2 text-sm text-slate-300/80">No profile exists for this link. Create one to view it.</p>
        <div className="mt-4 flex gap-3">
          <Link className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white" to="/">
            Create profile
          </Link>
          <Link className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100" to="/qr">
            QR gallery
          </Link>
        </div>
      </section>
    );
  }

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

  return (
    <section className="grid gap-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 p-8 shadow-xl shadow-indigo-900/30 backdrop-blur">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-inner shadow-slate-950/40">
          <div className="flex flex-col sm:items-center">
            <Avatar
              url={profile.avatarDataUrl}
              initials={`${profile.firstName[0]}${profile.lastName ? profile.lastName[0] : ""}`}
              size="14"
              theme={profile.theme}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mt-4">
                <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">Public profile</p>
                <span className={`ml-auto rounded-full px-3 py-1 text-[11px] font-semibold ${palette.accentBadge}`}>
                  Theme: {profile.theme}
                </span>
              </div>
              <h2 className="mt-1 text-3xl font-semibold leading-tight text-slate-50">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-slate-300/80">{profile.businessName}</p>
              {profile.location ? <p className="text-xs text-slate-400/80 mt-1">Location: {profile.location}</p> : null}
            </div>
          </div>

          {profile.bio ? (
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4 text-sm text-slate-200/90 leading-relaxed">
              {profile.bio}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">Contact</p>
              <div className="mt-2 text-sm text-slate-200/90">
                <p>Phone: {profile.phone}</p>
                <p>Email: {profile.email}</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">Links</p>
              <div className="mt-2 grid gap-2 text-sm text-slate-200/90">
                {socials.length ? (
                  socials.map((item) => (
                    <a key={item.label} className="hover:text-indigo-100" href={item.value} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  ))
                ) : (
                  <p className="text-slate-400/80">No social links provided.</p>
                )}
              </div>
            </div>
          </div>

          {services.length ? (
            <div className="rounded-xl border border-slate-800/70 bg-slate-900/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400/80">Services / skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {services.map((service) => (
                  <span key={service} className={`rounded-full px-3 py-1 text-xs font-semibold ${palette.accentBadge}`}>
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href={profile.profileUrl}
              className="rounded-full border border-slate-700/70 px-4 py-2 font-semibold text-slate-100 hover:border-indigo-400/60 hover:text-indigo-100"
            >
              Public link
            </a>
            <Link
              to="/qr"
              className={`rounded-full px-4 py-2 font-semibold shadow-lg transition hover:-translate-y-[1px] ${palette.accentButton}`}
            >
              View QR gallery
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 text-center shadow-inner shadow-slate-950/40">
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">Scan</p>
          <img
            src={profile.qrDataUrl}
            alt="QR code for profile"
            className={`w-56 rounded-xl border bg-white p-3 shadow-lg ${palette.accentBorder}`}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-300/80">QR saved as JPG data URL. Scanning redirects to this public profile.</p>
            <button
              type="button"
              onClick={downloadQr}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${palette.accentBadge}`}
            >
              Download QR (JPG)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function QrGalleryPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    setProfiles(loadProfiles());
  }, []);

  const downloadQr = (profile) => {
    const link = document.createElement("a");
    link.href = profile.qrDataUrl;
    link.download = `${profile.slug}-qr.jpg`;
    link.click();
  };

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl shadow-indigo-900/30 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">QR Gallery</p>
          <h2 className="text-2xl font-semibold text-slate-50">All generated QR codes</h2>
          <p className="text-sm text-slate-300/80">Demo view: every QR that has been created in localStorage.</p>
        </div>
        <Link
          to="/"
          className="rounded-full border border-indigo-500/60 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:bg-indigo-500/20"
        >
          Create another
        </Link>
      </div>

      {profiles.length === 0 ? (
        <p className="text-sm text-slate-300/80">No QR codes yet. Create a profile first.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((profile) => {
              const palette = getPalette(profile.theme);
              return (
                <article
                  key={profile.slug}
                  className="group rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-indigo-900/40"
                >
                  <div className="">
                    <div className="">
                      <Avatar
                        url={profile.avatarDataUrl}
                        initials={`${profile.firstName[0]}${profile.lastName ? profile.lastName[0] : ""}`}
                        size="10"
                        theme={profile.theme}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-100 mt-2">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-xs text-slate-400/80">{profile.businessName}</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center mt-2">
 <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${palette.accentBadge}`}>
                      QR
                    </span>
                    </div>
                   
                  </div>
                  <div className="mt-3 flex justify-center">
                    <img
                      src={profile.qrDataUrl}
                      alt={`QR for ${profile.firstName}`}
                      className={`w-40 rounded-xl border bg-white p-3 shadow-inner shadow-slate-950/30 ${palette.accentBorder}`}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-300/80">
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
                      <span className="truncate text-[11px] text-slate-400/70">/{profile.slug}</span>
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

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/qr"
        element={
          <Layout>
            <QrGalleryPage />
          </Layout>
        }
      />
      <Route
        path="/:slug"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />
    </Routes>
  );
}
