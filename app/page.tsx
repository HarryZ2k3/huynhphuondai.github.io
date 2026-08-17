import Link from "next/link";
import { getAlbums, getPosts, getProfile, getProjects } from "@/lib/content";
import { assetPath } from "@/lib/site";

export default function HomePage() {
  const profile = getProfile();
  const projects = getProjects().filter((project) => project.featured).slice(0, 3);
  const posts = getPosts().filter((post) => post.featured).slice(0, 3);
  const albums = getAlbums().slice(0, 2);

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy reveal">
          <p className="eyebrow">{profile.title}</p>
          <h1>{profile.name}</h1>
          <p className="hero-statement">{profile.hero.headline}</p>
          <p className="hero-lede">{profile.hero.summary}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/work">
              Explore Work
            </Link>
            <Link className="button button-secondary" href="/writing">
              Read Writing
            </Link>
          </div>
        </div>
        <aside className="signal-panel reveal" aria-label="Profile snapshot">
          <p className="panel-label">Current Signal</p>
          <dl>
            <div>
              <dt>Role</dt>
              <dd>{profile.title}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{profile.currentFocus}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="intro-band">
        <div className="section-shell intro-grid reveal">
          <div>
            <p className="section-kicker">Home</p>
            <h2>A quieter personal site built from files, not a dashboard.</h2>
          </div>
          <p>
            This site is maintained through Git: projects, essays, album metadata, and future photos live in the
            repository. Updating the site should feel like writing, organizing, and committing, not logging into another
            system.
          </p>
        </div>
      </section>

      <section className="section-shell section-block">
        <div className="section-heading reveal">
          <p className="section-kicker">Featured Work</p>
          <h2>Selected Project Case Studies</h2>
        </div>
        <div className="feature-grid">
          {projects.map((project) => (
            <Link className="feature-card reveal" href={`/work/${project.slug}`} key={project.slug}>
              <img src={assetPath(project.coverImage)} alt="" loading="lazy" />
              <span>
                {project.year} · {project.role}
              </span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell section-block split-section">
        <div className="section-heading reveal">
          <p className="section-kicker">Writing</p>
          <h2>Notes That Turn Work Into Memory</h2>
        </div>
        <div className="writing-list">
          {posts.map((post) => (
            <Link className="writing-row reveal" href={`/writing/${post.slug}`} key={post.slug}>
              <span>
                {post.category} · {post.readingTime} min read
              </span>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="photo-band">
        <div className="section-shell section-block">
          <div className="section-heading reveal">
            <p className="section-kicker">Photos</p>
            <h2>Albums With Room For Real Photographs</h2>
          </div>
          <div className="album-grid">
            {albums.map((album) => (
              <Link className="album-card reveal" href={`/photos/${album.slug}`} key={album.slug}>
                <img src={assetPath(album.coverImage)} alt="" loading="lazy" />
                <div>
                  <span>
                    {album.location} · {album.date}
                  </span>
                  <h3>{album.title}</h3>
                  <p>{album.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-block split-section">
        <div className="section-heading reveal">
          <p className="section-kicker">Experience</p>
          <h2>How I Think About Technical Work</h2>
        </div>
        <ol className="principles-list">
          {profile.principles.map((principle) => (
            <li className="reveal" key={principle}>
              {principle}
            </li>
          ))}
        </ol>
      </section>

      <section className="contact-section">
        <div className="section-shell contact-grid reveal">
          <div>
            <p className="section-kicker">Contact</p>
            <h2>Open to practical IT conversations, thoughtful writing, and useful projects.</h2>
          </div>
          <div className="contact-actions">
            <a className="button button-primary" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <Link className="button button-secondary" href="/about">
              More About Harry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
