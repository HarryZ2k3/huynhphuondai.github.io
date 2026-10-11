export const profileDefaults = {
  fullName: "", personalNote: "", aboutHeading: "", aboutSummary: "",
  resumeFile: "", resumeLabel: "Download CV", showResume: true,
  education: [], languages: [], qualifications: [],
};
export const appearanceDefaults = {
  accent: "green", showWork: true, showWriting: true, showPersonal: true,
  animations: true, headingFont: "serif", readingSize: "standard",
};
export const profileGroups = {
  Introduction: ["name", "fullName", "title", "location", "portraitImage", "hero", "currentFocus", "personalNote", "aboutHeading", "aboutSummary", "biography", "interests"],
  "CV & career": ["resumeFile", "resumeLabel", "showResume", "experience", "education", "tools", "languages", "qualifications"],
  "Contact & links": ["email", "socials"],
};
export const siteFields = {
  navigation: ["home", "work", "writing", "photos", "about", "contact"],
  home: ["workHeading", "writingHeading", "writingDescription", "personalHeading", "contactHeading", "contactDescription", "workButton", "writingButton", "focusLabel"],
  work: ["heading", "description", "experienceHeading", "conceptHeading", "conceptDescription"],
  writing: ["heading", "description"],
  photos: ["heading", "description", "previewNote"],
  about: ["backgroundHeading", "toolkitHeading", "experienceHeading", "educationHeading", "languagesHeading", "interestsHeading"],
  contact: ["heading", "description"],
  footer: ["tagline", "showSocials", "showRss"],
  seo: ["titleSuffix", "description", "socialImage"],
};
export function normalizeSettings(id, value) {
  if (id === "content/profile.json") return { ...profileDefaults, ...value };
  if (id === "content/appearance.json") return { ...appearanceDefaults, ...value };
  return value;
}
export function validateSettings(id, value) {
  if (id === "content/site.json") {
    for (const [group, keys] of Object.entries(siteFields)) {
      if (!value[group] || typeof value[group] !== "object" || Array.isArray(value[group])) throw new Error("Complete the " + group + " settings.");
      for (const key of keys) {
        const field = value[group][key];
        if (["showSocials", "showRss"].includes(key)) {
          if (typeof field !== "boolean") throw new Error(key + " must be on or off.");
        } else {
          if (typeof field !== "string" || field.length > 2000) throw new Error(group + ": " + key + " must be text under 2,000 characters.");
          if (group === "navigation" && (!field.trim() || field.length > 24)) throw new Error("Navigation labels must contain 1 to 24 characters.");
          if ((key.toLowerCase().includes("heading") || key === "titleSuffix") && !field.trim()) throw new Error("Complete " + group + ": " + key + ".");
        }
      }
    }
  }
  if (id === "content/appearance.json") {
    for (const key of ["showWork", "showWriting", "showPersonal", "animations"]) {
      if (key in value && typeof value[key] !== "boolean") throw new Error(key + " must be on or off.");
    }
    if (value.headingFont !== undefined && !["serif", "sans"].includes(value.headingFont)) throw new Error("Choose a supported heading font.");
    if (value.readingSize !== undefined && !["standard", "large"].includes(value.readingSize)) throw new Error("Choose a supported reading size.");
  }
  if (id === "content/profile.json") {
    for (const key of ["aboutHeading", "aboutSummary", "resumeLabel", "resumeFile"]) {
      if (key in value && typeof value[key] !== "string") throw new Error(key + " must be text.");
    }
    if (value.showResume !== undefined && typeof value.showResume !== "boolean") throw new Error("CV visibility must be on or off.");
    if (value.resumeFile && !value.resumeFile.toLowerCase().endsWith(".pdf")) throw new Error("Choose a PDF for your CV.");
    for (const key of ["education", "languages", "qualifications"]) {
      if (key in value && !Array.isArray(value[key])) throw new Error(key + " must be a list.");
    }
  }
}
