import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harry Huynh | Information Technology Engineer",
  description:
    "Portfolio for Harry Huynh, an Information Technology Engineer focused on reliable systems, secure operations, and practical support.",
};

const focusAreas = [
  {
    icon: "network",
    title: "Infrastructure",
    copy: "Networks, endpoints, cloud services, backups, access, and the day-to-day systems people depend on.",
  },
  {
    icon: "shield",
    title: "Security Hygiene",
    copy: "Least-privilege access, patch awareness, device readiness, documentation, and calm incident follow-through.",
  },
  {
    icon: "terminal",
    title: "Support Automation",
    copy: "Repeatable checklists, practical scripts, onboarding flows, and clear notes that reduce avoidable tickets.",
  },
];

const workThemes = [
  {
    icon: "router",
    title: "Reliable Office Networks",
    scope: "Equipment reviews, Wi-Fi coverage checks, cabling notes, VLAN readiness, and supportable change plans.",
  },
  {
    icon: "cloud",
    title: "Backup & Recovery Readiness",
    scope: "Cloud backup routines, restore checks, file access reviews, and documentation for common recovery paths.",
  },
  {
    icon: "laptop",
    title: "Endpoint Lifecycle",
    scope: "Device setup, user onboarding, patch routines, account access, and practical troubleshooting records.",
  },
];

const skills = [
  "Windows administration",
  "Microsoft 365",
  "Endpoint support",
  "Network troubleshooting",
  "Cloud fundamentals",
  "Backup verification",
  "Access control",
  "Documentation",
  "Service desk workflows",
  "Scripting basics",
  "Security awareness",
  "Vendor coordination",
];

const principles = [
  "Start with the user impact, then work backward to the root cause.",
  "Document decisions so the next person can support the system with confidence.",
  "Prefer simple, repeatable fixes over clever one-off workarounds.",
  "Treat security as a daily operating habit, not a separate event.",
];

function Icon({ name }: { name: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  switch (name) {
    case "mail":
      return (
        <svg {...common}>
          <path d="M4.5 6.75h15v10.5h-15V6.75Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="m5 7.25 7 5.5 7-5.5" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="m13 6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3.75 19 6v5.1c0 4.35-2.82 7.7-7 9.15-4.18-1.45-7-4.8-7-9.15V6l7-2.25Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="m9 12.2 2 2 4.25-4.45"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <path d="M4 5.25h16v13.5H4V5.25Z" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="m7.25 9 2.5 2.5-2.5 2.5M11.5 14h4.25"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <path d="M12 7.25v4.5M8 16.75h8M6 13.25h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path
            d="M9.25 4.25h5.5v3h-5.5v-3ZM3.75 16.75h4.5v3h-4.5v-3ZM15.75 16.75h4.5v3h-4.5v-3Z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
        </svg>
      );
    case "router":
      return (
        <svg {...common}>
          <path d="M4.25 10.5h15.5v7.25H4.25V10.5Z" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M8 14.25h.02M11 14.25h.02M14 14.25h.02M17 14.25h.02M8 7.5 5.75 4.75M16 7.5l2.25-2.75"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path
            d="M8.25 18.25h8.4a4.1 4.1 0 0 0 .35-8.18 5.6 5.6 0 0 0-10.74 1.18A3.52 3.52 0 0 0 8.25 18.25Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <path d="M6 6.25h12v8.5H6v-8.5Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.75 17.75h16.5M9.5 14.75h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 4.75v14.5M4.75 12h14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Harry Huynh portfolio home">
          <span className="brand-mark">HH</span>
          <span className="brand-copy">
            <strong>Harry Huynh</strong>
            <span>Information Technology Engineer</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Available for IT infrastructure, support, and cloud operations</p>
            <h1 id="hero-title">Reliable systems, clear support, and practical technology operations.</h1>
            <p className="hero-lede">
              I am Harry Huynh, an Information Technology Engineer focused on helping teams keep endpoints, networks,
              cloud tools, and everyday support workflows stable, secure, and easy to maintain.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="mailto:phuongdai.saigon@gmail.com">
                <Icon name="mail" />
                Contact Harry
              </a>
              <a className="button button-secondary" href="#work">
                View Focus Areas
                <Icon name="arrow" />
              </a>
            </div>
          </div>

          <aside className="snapshot" aria-label="Professional profile snapshot">
            <p className="panel-label">Profile Snapshot</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>Information Technology Engineer</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Systems, support, networks, cloud readiness</dd>
              </div>
              <div>
                <dt>Approach</dt>
                <dd>Calm troubleshooting, clear documentation, secure habits</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="intro-band">
          <div className="section-shell intro-grid">
            <div>
              <p className="section-kicker">About</p>
              <h2>Technology work that stays close to real operational needs.</h2>
            </div>
            <p>
              My work centers on the practical side of IT: keeping devices ready, access organized, networks
              understandable, cloud services recoverable, and support notes clear enough for the next handoff. The goal
              is simple: fewer surprises, faster recovery, and tools people can trust during a busy workday.
            </p>
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="focus-title">
          <div className="section-heading">
            <p className="section-kicker">Core Work</p>
            <h2 id="focus-title">Where I Add Value</h2>
          </div>
          <div className="focus-grid">
            {focusAreas.map((item) => (
              <article className="focus-card" key={item.title}>
                <span className="icon-tile">
                  <Icon name={item.icon} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="section-kicker">Representative Work</p>
            <h2 id="work-title">Project Areas I Can Discuss</h2>
          </div>
          <div className="work-list">
            {workThemes.map((item) => (
              <article className="work-item" key={item.title}>
                <span className="work-icon">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.scope}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block split-section" id="skills" aria-labelledby="skills-title">
          <div className="section-heading">
            <p className="section-kicker">Capabilities</p>
            <h2 id="skills-title">Practical IT Skill Set</h2>
          </div>
          <div className="skill-cloud" aria-label="Skills">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="section-shell section-block principles-section" aria-labelledby="principles-title">
          <div className="section-heading">
            <p className="section-kicker">Operating Style</p>
            <h2 id="principles-title">How I Work</h2>
          </div>
          <ol className="principles-list">
            {principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ol>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-shell contact-grid">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 id="contact-title">Let&apos;s talk about reliable IT operations.</h2>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:phuongdai.saigon@gmail.com">
                <Icon name="mail" />
                phuongdai.saigon@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
