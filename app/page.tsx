import type { Metadata } from "next";
import { MotionController } from "./MotionController";

export const metadata: Metadata = {
  title: "Harry Huynh | Personal Website",
  description:
    "Personal website and portfolio for Harry Huynh, an Information Technology Engineer sharing work, writing, and personal moments.",
};

const focusAreas = [
  {
    icon: "network",
    title: "Infrastructure",
    copy: "Networks, endpoints, cloud services, backups, access, and the everyday systems people depend on.",
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

const personalNotes = [
  {
    label: "Home Base",
    value: "Vietnam-based, close to the rhythm of busy teams and practical business technology.",
  },
  {
    label: "What I Like",
    value: "Clean handoffs, readable notes, stable tools, and systems that stay quiet when the day gets loud.",
  },
  {
    label: "Current Direction",
    value: "Growing deeper in cloud operations, network reliability, security-first support, and personal writing.",
  },
];

const galleryItems = [
  {
    icon: "server",
    title: "Workspaces",
    caption: "Desk setups, lab notes, repairs, and the places where technical focus happens.",
    tone: "teal",
  },
  {
    icon: "map",
    title: "Life Around Saigon",
    caption: "Street details, coffee corners, weekend walks, and the city texture around the work.",
    tone: "clay",
  },
  {
    icon: "camera",
    title: "Learning Moments",
    caption: "Photos from courses, build logs, experiments, and small wins worth keeping.",
    tone: "steel",
  },
  {
    icon: "spark",
    title: "Personal Archive",
    caption: "A flexible place for travel, friends, family, events, or anything that feels like you.",
    tone: "gold",
  },
];

const blogPosts = [
  {
    category: "IT Notes",
    title: "My Practical Troubleshooting Checklist",
    excerpt:
      "A working draft about how I narrow down problems without losing the user impact, the timeline, or the handoff notes.",
    status: "Draft",
  },
  {
    category: "Systems",
    title: "What Makes a Backup Plan Useful",
    excerpt:
      "Notes on restore checks, ownership, naming, and the small routines that make recovery less stressful.",
    status: "Draft",
  },
  {
    category: "Personal",
    title: "Why I Like Technology That Feels Calm",
    excerpt:
      "A more personal essay seed about tools, attention, reliability, and the kind of engineering culture I enjoy.",
    status: "Seed",
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
          <path d="M5 12h13" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="m13 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 3.75 19 6v5.1c0 4.35-2.82 7.7-7 9.15-4.18-1.45-7-4.8-7-9.15V6l7-2.25Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.7"
          />
          <path d="m9 12.2 2 2 4.25-4.45" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <path d="M4 5.25h16v13.5H4V5.25Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="m7.25 9 2.5 2.5-2.5 2.5M11.5 14h4.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
          <path d="M12 7.25v4.5M8 16.75h8M6 13.25h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          <path d="M9.25 4.25h5.5v3h-5.5v-3ZM3.75 16.75h4.5v3h-4.5v-3ZM15.75 16.75h4.5v3h-4.5v-3Z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "router":
      return (
        <svg {...common}>
          <path d="M4.25 10.5h15.5v7.25H4.25V10.5Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 14.25h.02M11 14.25h.02M14 14.25h.02M17 14.25h.02M8 7.5 5.75 4.75M16 7.5l2.25-2.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...common}>
          <path d="M8.25 18.25h8.4a4.1 4.1 0 0 0 .35-8.18 5.6 5.6 0 0 0-10.74 1.18A3.52 3.52 0 0 0 8.25 18.25Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    case "laptop":
      return (
        <svg {...common}>
          <path d="M6 6.25h12v8.5H6v-8.5Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3.75 17.75h16.5M9.5 14.75h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
        </svg>
      );
    case "server":
      return (
        <svg {...common}>
          <path d="M5 4.75h14v5.5H5v-5.5ZM5 13.75h14v5.5H5v-5.5Z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M8 7.5h.02M8 16.5h.02M11 7.5h5M11 16.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M5 7.75h3l1.35-2h5.3l1.35 2h3v10.5H5V7.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M12 15.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="m4.75 6.5 4.75-1.75 5 1.75 4.75-1.75v12.75l-4.75 1.75-5-1.75-4.75 1.75V6.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
          <path d="M9.5 4.75V17.5M14.5 6.5v12.75" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 3.75 13.9 9.9 20 12l-6.1 2.1L12 20.25 10.1 14.1 4 12l6.1-2.1L12 3.75Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 4.75v14.5M4.75 12h14.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <>
      <MotionController />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Harry Huynh personal website home">
          <span className="brand-mark">HH</span>
          <span className="brand-copy">
            <strong>Harry Huynh</strong>
            <span>IT Engineer and personal notes</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#gallery">Gallery</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy reveal">
            <p className="eyebrow">Personal website and IT engineering portfolio</p>
            <h1 id="hero-title">Systems, stories, and the small details that make work feel reliable.</h1>
            <p className="hero-lede">
              I am Harry Huynh, an Information Technology Engineer building a home on the web for my professional work,
              writing, photo archive, and the personal details that make the technical side more human.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="mailto:phuongdai.saigon@gmail.com">
                <Icon name="mail" />
                Contact Harry
              </a>
              <a className="button button-secondary" href="#blog">
                Read Notes
                <Icon name="arrow" />
              </a>
            </div>
          </div>

          <aside className="signal-panel reveal" aria-label="Personal profile snapshot">
            <p className="panel-label">Current Signal</p>
            <dl>
              <div>
                <dt>Role</dt>
                <dd>Information Technology Engineer</dd>
              </div>
              <div>
                <dt>Personal Site</dt>
                <dd>Portfolio, blog, and photo journal</dd>
              </div>
              <div>
                <dt>Hosting</dt>
                <dd>Local-first, no sign-in gate</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="intro-band" id="about">
          <div className="section-shell intro-grid reveal">
            <div>
              <p className="section-kicker">About</p>
              <h2>Technology work that stays close to real people.</h2>
            </div>
            <p>
              My work centers on the practical side of IT: keeping devices ready, access organized, networks
              understandable, cloud services recoverable, and support notes clear enough for the next handoff. This site
              adds more of my own voice: what I am learning, what I notice, and what I choose to keep.
            </p>
          </div>
        </section>

        <section className="section-shell section-block personal-section" aria-labelledby="personal-title">
          <div className="section-heading reveal">
            <p className="section-kicker">Personal</p>
            <h2 id="personal-title">A More Human Profile</h2>
          </div>
          <div className="personal-grid">
            {personalNotes.map((item) => (
              <article className="note-card reveal" key={item.label}>
                <span>{item.label}</span>
                <p>{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block" aria-labelledby="focus-title">
          <div className="section-heading reveal">
            <p className="section-kicker">Core Work</p>
            <h2 id="focus-title">Where I Add Value</h2>
          </div>
          <div className="focus-grid">
            {focusAreas.map((item) => (
              <article className="focus-card reveal" key={item.title}>
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
          <div className="section-heading reveal">
            <p className="section-kicker">Representative Work</p>
            <h2 id="work-title">Project Areas I Can Discuss</h2>
          </div>
          <div className="work-list">
            {workThemes.map((item) => (
              <article className="work-item reveal" key={item.title}>
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

        <section className="section-shell section-block split-section" aria-labelledby="skills-title">
          <div className="section-heading reveal">
            <p className="section-kicker">Capabilities</p>
            <h2 id="skills-title">Practical IT Skill Set</h2>
          </div>
          <div className="skill-cloud reveal" aria-label="Skills">
            {skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="section-shell section-block">
            <div className="section-heading reveal">
              <p className="section-kicker">Gallery</p>
              <h2 id="gallery-title">Photo Gallery</h2>
            </div>
            <div className="gallery-grid">
              {galleryItems.map((item) => (
                <article className={`gallery-card gallery-${item.tone} reveal`} key={item.title}>
                  <div className="photo-slot">
                    <Icon name={item.icon} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell section-block blog-section" id="blog" aria-labelledby="blog-title">
          <div className="section-heading reveal">
            <p className="section-kicker">Blog</p>
            <h2 id="blog-title">Notes I Want to Build Into Essays</h2>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article className="blog-card reveal" key={post.title}>
                <div className="blog-meta">
                  <span>{post.category}</span>
                  <span>{post.status}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell section-block principles-section" aria-labelledby="principles-title">
          <div className="section-heading reveal">
            <p className="section-kicker">Operating Style</p>
            <h2 id="principles-title">How I Work</h2>
          </div>
          <ol className="principles-list">
            {principles.map((principle) => (
              <li className="reveal" key={principle}>
                {principle}
              </li>
            ))}
          </ol>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="section-shell contact-grid reveal">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 id="contact-title">Let&apos;s talk about reliable IT, useful writing, or a new project.</h2>
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
