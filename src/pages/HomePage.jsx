import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import Avatar from "../components/Avatar";
import { getPalette } from "../utils/theme";
import { slugify } from "../utils/slugify";
import { loadProfiles, saveProfile } from "../storage";

/* ================= DATA ================= */

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

/* ================= COMPONENT ================= */

export default function HomePage() {
  const [form, setForm] = useState(initialForm);
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const [createdProfile, setCreatedProfile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await loadProfiles();
        setProfiles(data);
      } catch (error) {
        console.error(error);
      }
    })();
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

//       const origin =
//   window.location.origin === "null"
//     ? "http://localhost:5173"
//     : window.location.origin;

const profileUrl = `https://digital-card-delta-ten.vercel.app/${slug}`;
    //   const profileUrl = `${window.location.origin}/${slug}`;
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

      await saveProfile(profile);

      setCreatedProfile(profile);
      setShowPreview(true);
      setForm(initialForm);
      setStatus({ state: "success", message: "Profile created successfully." });
    } catch (error) {
      console.error(error);
      setStatus({ state: "error", message: "Could not create the profile. Please try again." });
    }
  };

  const palette = getPalette(createdProfile?.theme);

  return (
    <>
      {/* ================= FORM ================= */}
<div className="w-full">
  <section className="rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900/80 p-4 sm:p-6 lg:p-8 shadow-xl shadow-indigo-900/30 backdrop-blur">
    
    {/* HEADER */}
    <div className="mb-6 sm:mb-8">
      <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
        Create
      </p>
      <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-slate-50">
        Public profile + QR
      </h2>
      <p className="mt-2 max-w-xl text-sm text-slate-300/80">
        Fill the fields, submit, and we will generate a public page and QR code.
      </p>
    </div>

    {/* FORM */}
    <form className="grid gap-6" onSubmit={handleSubmit}>
      
      {/* BASIC FIELDS */}
      <div className="grid gap-4 sm:grid-cols-2">
        {fieldGrid.map((field) => (
          <label key={field.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm text-slate-200/90">
              <span>{field.label}</span>
              {field.required && (
                <span className="text-xs text-indigo-200/80">Required</span>
              )}
            </div>

            <input
              className="w-full rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
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

      {/* SOCIAL LINKS */}
      <div className="grid gap-4 sm:grid-cols-2">
        {socialFields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm text-slate-200/90">
              <span>{field.label}</span>
              <span className="text-xs text-slate-400/70">Optional</span>
            </div>

            <input
              className="w-full rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              type="text"
            />
          </label>
        ))}
      </div>

      {/* BIO + LOCATION / SERVICES */}
      <div className="grid gap-4 lg:grid-cols-2">
        
        {/* BIO */}
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
            className="w-full resize-none rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3 text-sm text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
          />
        </label>

        {/* LOCATION + SERVICES */}
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
              className="w-full rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
              type="text"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm text-slate-200/90">
              <span>Services / skills</span>
              <span className="text-xs text-slate-400/70">Optional</span>
            </div>

            <input
              name="services"
              value={form.services}
              onChange={handleChange}
              placeholder="Branding, Web design, Frontend dev"
              className="w-full rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40"
              type="text"
            />
          </label>
        </div>
      </div>

      {/* AVATAR + THEME */}
      <div className="grid gap-4 lg:grid-cols-2">
        
        {/* AVATAR */}
        <label className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">
                Avatar / logo
              </p>
              <p className="text-xs text-slate-400/80">
                JPG or PNG, shown on the public profile.
              </p>
            </div>

            <Avatar
              url={form.avatarDataUrl}
              initials={`${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}` || "DP"}
              size="10"
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

        {/* THEME */}
        <label className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-inner">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-100">
                Accent theme
              </p>
              <p className="text-xs text-slate-400/80">
                Applies to buttons, badges, and QR cards.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getPalette(form.theme).accentBadge}`}
            >
              Live
            </span>
          </div>

          <select
            name="theme"
            value={form.theme}
            onChange={handleChange}
            className={`w-full rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 shadow-inner outline-none ${getPalette(form.theme).accentRing}`}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={status.state === "loading"}
        className="mt-2 w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 disabled:bg-slate-600"
      >
        {status.state === "loading"
          ? "Creating..."
          : "Generate profile + QR"}
      </button>

      {/* STATUS MESSAGE */}
      {status.message && (
        <p
          className={`text-sm ${
            status.state === "error"
              ? "text-rose-200/90"
              : "text-emerald-200/90"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  </section>
</div>


      {/* ================= PREVIEW MODAL ================= */}
      {showPreview && createdProfile && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-6 pt-20">
    <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900 p-4 sm:p-6">
      
      {/* HEADER */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-200/70">
            Profile Preview
          </p>
          <h3 className="text-lg font-semibold text-slate-50">
            {createdProfile.firstName} {createdProfile.lastName}
          </h3>
          <p className="text-sm text-slate-300/80">
            {createdProfile.businessName}
          </p>
        </div>
        <button
          onClick={() => setShowPreview(false)}
          className="text-slate-400 hover:text-slate-200"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center gap-4">
        <Avatar
          url={createdProfile.avatarDataUrl}
          initials={`${createdProfile.firstName[0]}${createdProfile.lastName?.[0] || ""}`}
          size="14"
          theme={createdProfile.theme}
        />

        <img
          src={createdProfile.qrDataUrl}
          alt="QR code"
          className={`w-40 sm:w-48 rounded-xl border bg-white p-3 ${palette.accentBorder}`}
        />

        {/* PROFILE URL */}
        <a
          href={createdProfile.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="break-all text-center text-sm text-indigo-200 underline"
        >
          {createdProfile.profileUrl}
        </a>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          {/* DOWNLOAD QR */}
          <a
            href={createdProfile.qrDataUrl}
            download={`${createdProfile.slug}-qr.png`}
            className={`w-full sm:w-auto rounded-full px-4 py-2 text-center text-sm font-semibold ${palette.accentButton}`}
          >
            Download QR
          </a>

          {/* OPEN PROFILE */}
          <Link
            to={`/${createdProfile.slug}`}
            className={`w-full sm:w-auto rounded-full px-4 py-2 text-center text-sm font-semibold ${palette.accentButton}`}
          >
            Open profile
          </Link>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
}
