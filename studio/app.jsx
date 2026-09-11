import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "@tiptap/markdown";
import { LayoutDashboard, PenLine, Images, BriefcaseBusiness, UserRound, Palette, Plus, Upload, Eye, Send, Save, ArrowLeft, ArrowUp, ArrowDown, Trash2, Download, X, Bold, Italic, Heading2, List, ListOrdered, Quote, Code, Link, ImagePlus, Undo2, Redo2, Check, Search } from "lucide-react";
import "./style.css";

const token = document.querySelector('meta[name="studio-token"]').content;
async function api(route, data) {
  const response = await fetch("/api/" + route, data === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json", "X-Studio-Token": token }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "The request failed.");
  return result;
}
const date = () => new Date().toISOString().slice(0, 10);
const label = key => ({ body: "Article", hero: "Homepage introduction", src: "Photograph", resumeFile: "Public resume PDF", portraitImage: "Portrait", currentFocus: "Current focus", personalNote: "Personal introduction", showWork: "Selected work on home", showWriting: "Writing on home", showPersonal: "Personal introduction on home" }[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()));
const sections = [["Overview", LayoutDashboard], ["Writing", PenLine], ["Photos", Images], ["Work", BriefcaseBusiness], ["Profile", UserRound], ["Appearance", Palette]];
const kind = id => id.includes("/blog/") ? "Writing" : id.includes("/albums/") ? "Photos" : id.includes("/projects/") ? "Work" : id.includes("profile") ? "Profile" : "Appearance";
const title = item => item.value.title || item.value.name || "Appearance";
function IconButton({ icon: Icon, name, onClick, disabled, active }) {
  return <button type="button" className="icon" title={name} aria-label={name} onClick={onClick} disabled={disabled} aria-pressed={active}><Icon size={17} /></button>;
}
function Modal({ title, children, close }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} onCancel={close} aria-labelledby="dialog-title"><header><h2 id="dialog-title">{title}</h2><IconButton icon={X} name="Close dialog" onClick={close} /></header>{children}</dialog>;
}
function RichText({ content, onChange, chooseImage }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, protocols: ["https", "mailto"] } }), Image.configure({ inline: false, allowBase64: false }), Markdown],
    content, contentType: "markdown",
    editorProps: { attributes: { "aria-label": "Article body", role: "textbox", "aria-multiline": "true" } },
    onUpdate: ({ editor }) => onChange(editor.markdown.serialize(editor.getJSON())),
  });
  if (!editor) return null;
  const command = action => () => action(editor.chain().focus()).run();
  return <div className="writing-tool">
    <div className="format-toolbar" aria-label="Text formatting">
      <IconButton icon={Undo2} name="Undo" onClick={command(c => c.undo())} />
      <IconButton icon={Redo2} name="Redo" onClick={command(c => c.redo())} />
      <span className="separator" />
      <IconButton icon={Bold} name="Bold" onClick={command(c => c.toggleBold())} />
      <IconButton icon={Italic} name="Italic" onClick={command(c => c.toggleItalic())} />
      <IconButton icon={Heading2} name="Heading" onClick={command(c => c.toggleHeading({ level: 2 }))} />
      <IconButton icon={List} name="Bullet list" onClick={command(c => c.toggleBulletList())} />
      <IconButton icon={ListOrdered} name="Numbered list" onClick={command(c => c.toggleOrderedList())} />
      <IconButton icon={Quote} name="Block quote" onClick={command(c => c.toggleBlockquote())} />
      <IconButton icon={Code} name="Code block" onClick={command(c => c.toggleCodeBlock())} />
      <IconButton icon={Link} name="Insert link" onClick={() => { const href = window.prompt("Link URL (https://)", editor.getAttributes("link").href || "https://"); if (href === "") editor.chain().focus().unsetLink().run(); else if (href && /^https:\/\//i.test(href)) editor.chain().focus().setLink({ href }).run(); }} />
      <IconButton icon={ImagePlus} name="Insert image" onClick={() => chooseImage(media => { const alt = window.prompt("Describe this image for readers", media.name); if (alt !== null) editor.chain().focus().setImage({ src: media.src, alt }).run(); })} />
    </div>
    <EditorContent editor={editor} />
  </div>;
}
const templates = {
  experience: { company: "", role: "", dates: "", location: "", summary: "", achievements: [], technologies: [] },
  education: { institution: "", qualification: "", dates: "", detail: "" },
  socials: { label: "", href: "https://" },
  photos: { src: "", alt: "", caption: "", width: 1200, height: 800 },
};
function Fields({ value, onChange, chooseImage, keys = Object.keys(value), parent = "" }) {
  return keys.filter(key => !["body", "slug", "readingTime", "photos"].includes(key)).map(key => {
    const val = value[key];
    const set = next => onChange({ ...value, [key]: next });
    if (Array.isArray(val)) return <fieldset key={key}><legend>{label(key)}</legend>
      {val.map((item, index) => <div className="repeat-row" key={index}><div className="repeat-content">{typeof item === "object" ? <Fields value={item} onChange={next => set(val.map((v, i) => i === index ? next : v))} chooseImage={chooseImage} parent={key} /> : <label className="field"><span className="sr-only">{label(key)} {index + 1}</span><textarea rows={key === "biography" ? 3 : 1} value={item} onChange={e => set(val.map((v, i) => i === index ? e.target.value : v))} /></label>}</div><div className="row-tools">
        <IconButton icon={ArrowUp} name={"Move " + label(key) + " up"} disabled={index === 0} onClick={() => { const copy = [...val]; [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]]; set(copy); }} />
        <IconButton icon={ArrowDown} name={"Move " + label(key) + " down"} disabled={index === val.length - 1} onClick={() => { const copy = [...val]; [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]]; set(copy); }} />
        <IconButton icon={Trash2} name={"Remove " + label(key)} onClick={() => set(val.filter((_, i) => i !== index))} />
      </div></div>)}
      <button className="quiet" type="button" onClick={() => set([...val, templates[key] ? structuredClone(templates[key]) : ""])}><Plus size={16} /> Add {label(key).toLowerCase()}</button>
    </fieldset>;
    if (typeof val === "object" && val !== null) return <fieldset key={key}><legend>{label(key)}</legend><Fields value={val} onChange={set} chooseImage={chooseImage} parent={key} /></fieldset>;
    if (typeof val === "boolean") return <label key={key} className="check"><input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />{key === "draft" ? "Keep as private draft" : label(key)}</label>;
    if (key === "accent") return <fieldset key={key}><legend>Accent color</legend><div className="swatches">{[["green", "#216958"], ["rose", "#97465e"], ["blue", "#246a94"]].map(([name, color]) => <button key={name} className="swatch" title={name} aria-label={name + " accent"} aria-pressed={val === name} style={{ background: color }} onClick={() => set(name)}>{val === name && <Check size={18} />}</button>)}</div></fieldset>;
    if (key === "section") return <label className="field" key={key}><span>Section</span><select value={val} onChange={e => set(e.target.value)}>{["Technical", "Essays", "Journal"].map(section => <option key={section}>{section}</option>)}</select></label>;
    if (["coverImage", "portraitImage", "resumeFile"].includes(key)) return <div className="field" key={key}><span>{label(key)}</span><div className="asset-field">{val && key !== "resumeFile" && <img src={val} alt="" />}<span className="asset-name">{val ? val.split("/").pop() : "None selected"}</span><button type="button" className="quiet" onClick={() => chooseImage(m => set(m.src), key === "resumeFile")}><Images size={16} /> Choose</button>{val && <IconButton icon={X} name={"Remove " + label(key)} onClick={() => set("")} />}</div></div>;
    const multiline = ["description", "summary", "personalNote", "challenge", "approach", "outcome", "lessons", "story", "detail"].includes(key);
    return <label className="field" key={parent + key}><span>{label(key)}</span>{multiline ? <textarea rows={3} value={val ?? ""} onChange={e => set(e.target.value)} /> : <input type={key === "date" || key === "updated" ? "date" : key === "email" ? "email" : "text"} value={val ?? ""} onChange={e => set(e.target.value)} />}</label>;
  });
}
function newItem(section, name) {
  const slug = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
  const common = { title: name, slug, description: "" };
  const value = section === "Writing" ? { ...common, date: date(), section: "Journal", category: "Personal", tags: [], coverImage: "", draft: true, featured: false, body: "" }
    : section === "Work" ? { ...common, year: String(new Date().getFullYear()), kind: "Personal project", organization: "", period: "", role: "", technologies: [], repository: "", demo: "", coverImage: "", screenshots: [], featured: false, challenge: "", approach: "", outcome: "", lessons: "", body: "" }
    : { ...common, date: date(), location: "", coverImage: "", story: "", camera: "", sample: false, photos: [] };
  return { id: "content/" + (section === "Writing" ? "blog/" : section === "Work" ? "projects/" : "albums/") + slug + (section === "Photos" ? ".json" : ".md"), value, base: null, draft: true, published: false, operation: "save" };
}
function App() {
  const [state, setState] = useState(null);
  const [section, setSection] = useState("Overview");
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState("Saved locally");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [picker, setPicker] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selected, setSelected] = useState([]);
  const [review, setReview] = useState(null);
  const [pdfConfirmed, setPdfConfirmed] = useState(false);
  const [working, setWorking] = useState(false);
  const [job, setJob] = useState({ status: "idle" });
  const current = useRef(null), revision = useRef(0), dirty = useRef(false), timer = useRef(null), queue = useRef(Promise.resolve());
  async function reload() {
    const result = await api("state");
    revision.current = result.revision;
    setState(result);
    setJob(result.job);
    return result;
  }
  useEffect(() => {
    let cancelled = false;
    api("state").then(result => {
      if (cancelled) return;
      revision.current = result.revision;
      setState(result);
      setJob(result.job);
    }).catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; clearTimeout(timer.current); };
  }, []);
  useEffect(() => {
    function beforeUnload(e) { if (dirty.current) { e.preventDefault(); e.returnValue = ""; } }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);
  useEffect(() => {
    if (job.status !== "working") return;
    const timer = setInterval(() => api("job").then(next => { setJob(next); if (!next.busy) reload().catch(e => setError(e.message)); }).catch(e => setError(e.message)), 1500);
    return () => clearInterval(timer);
  }, [job.status]);
  function flush() {
    clearTimeout(timer.current);
    const task = async () => {
      if (!dirty.current || !current.current) return;
      const item = current.current;
      setStatus("Saving...");
      try {
        const result = await api("save", { ...item, revision: revision.current });
        revision.current = result.revision;
        if (current.current === item) { dirty.current = false; setStatus("Saved locally"); }
        setState(previous => ({ ...previous, revision: result.revision, items: [...previous.items.filter(i => i.id !== item.id), { ...item, draft: true }] }));
      } catch (e) { setStatus("Not saved"); throw e; }
    };
    queue.current = queue.current.catch(() => { /* A failed save must not prevent the next retry. */ }).then(task);
    return queue.current;
  }
  function update(value, operation = "save") {
    const next = { ...current.current, value, operation };
    current.current = next; setEntry(next); dirty.current = true; setStatus("Unsaved changes");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => flush().catch(e => setError(e.message)), 1000);
  }
  async function act(action) {
    setError(""); setWorking(true);
    try { await action(); } catch (e) { setError(e.message); } finally { setWorking(false); }
  }
  async function open(item) {
    await flush();
    current.current = item; dirty.current = false; setEntry(item); setStatus(item.conflict ? "Source conflict" : item.draft ? "Saved locally" : "Published source");
    setSection(kind(item.id)); setReview(null);
  }
  async function navigate(next) {
    await flush();
    setSection(next); setSearch(""); setEntry(null); current.current = null; setReview(null);
    if (["Profile", "Appearance"].includes(next)) await open(state.items.find(i => kind(i.id) === next));
  }
  function chooseImage(callback, pdf = false) { setPicker({ callback, pdf }); }
  async function upload(files, callback) {
    await act(async () => {
      await flush();
      for (const file of files) {
        if (file.size > 20 * 1024 * 1024) throw new Error("Choose files smaller than 20 MB.");
        const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(",")[1]); reader.onerror = reject; reader.readAsDataURL(file); });
        const result = await api("upload", { name: file.name, base64 });
        revision.current = result.revision;
        setState(prev => ({ ...prev, media: [...prev.media, result.media], revision: result.revision }));
        if (callback) callback(result.media);
      }
    });
  }
  async function preview() {
    await flush();
    if (current.current && !state.items.find(i => i.id === current.current.id)?.draft) {
      update(current.current.value);
      await flush();
    }
    const ids = current.current ? [current.current.id] : selected;
    await api("preview", { ids });
    setJob({ status: "working", message: "Building private preview..." });
  }
  async function reviewChanges() {
    await flush();
    const ids = entry ? [entry.id] : selected;
    const result = await api("review", { ids });
    setReview({ ...result, ids }); setPdfConfirmed(false);
  }
  const drafts = state?.items.filter(item => item.draft) || [];
  if (!state) return <main className="loading"><h1>Portfolio Studio</h1><p>{error || "Opening your workspace..."}</p></main>;
  const locked = working || job.status === "working";
  const items = state.items.filter(item => kind(item.id) === section && title(item).toLowerCase().includes(search.toLowerCase()));
  return <div className="studio">
    <aside className="sidebar"><a className="studio-brand" href="/">H<span>Portfolio Studio</span></a><p className="local-label"><span />Local workspace</p><nav aria-label="Studio navigation">{sections.map(([name, Icon]) => <button key={name} aria-current={section === name ? "page" : undefined} onClick={() => act(() => navigate(name))} disabled={locked}><Icon size={18} />{name}{name === "Writing" && <span className="count">{state.items.filter(i => kind(i.id) === name).length}</span>}</button>)}</nav><div className="sidebar-bottom"><a href="/api/backup" download><Download size={16} /> Export private backup</a><a href="https://harryz2k3.github.io/Personal-Porfolio/" target="_blank" rel="noreferrer"><Eye size={16} /> Public website</a></div></aside>
    <main className="workspace">
      <header className="workspace-header"><div><p className="eyebrow">YOUR PERSONAL WEBSITE</p><h1>{entry ? title(entry) : section}</h1></div><div className="actions">{entry && <><span className="save-status" role="status">{status}</span><IconButton icon={Save} name="Save draft" disabled={locked} onClick={() => act(flush)} /></>}<button disabled={locked || (!entry && !selected.length)} onClick={() => act(preview)}><Eye size={16} />Preview</button><button className="primary" disabled={locked || (!entry && !selected.length)} onClick={() => act(reviewChanges)}><Send size={16} />Review & publish</button></div></header>
      {error && <div className="notice error" role="alert"><span>{error}</span><IconButton icon={X} name="Dismiss error" onClick={() => setError("")} /></div>}
      {job.status !== "idle" && <div className={"notice " + (job.status === "failed" ? "error" : "")} role="status"><span>{job.message}</span>{job.url && <a href={job.url} target="_blank" rel="noreferrer">{job.status === "preview" ? "Open preview" : "Check deployment"}</a>}</div>}
      {entry ? <div className="entry-area"><div className="entry-top"><button className="quiet" disabled={locked} onClick={() => act(async () => { await flush(); current.current = null; setEntry(null); })}><ArrowLeft size={16} />All {section.toLowerCase()}</button><span className="path">{entry.id}</span></div>
        {entry.operation === "unpublish" && <p className="notice">Scheduled for removal from the site. Nothing changes online until you publish.</p>}
        <div className={section === "Writing" ? "editor-layout" : "form-layout"}>
          {section === "Writing" && <section className="article-editor"><label className="field title-field"><span>Title</span><input value={entry.value.title} onChange={e => update({ ...entry.value, title: e.target.value })} /></label><RichText key={entry.id} content={entry.value.body} onChange={body => update({ ...current.current.value, body })} chooseImage={chooseImage} /></section>}
          <div className="entry-fields"><Fields value={entry.value} keys={Object.keys(entry.value).filter(k => !(section === "Writing" && k === "title"))} onChange={update} chooseImage={chooseImage} />
            {section === "Profile" && !("resumeFile" in entry.value) && <button className="quiet" onClick={() => chooseImage(m => update({ ...entry.value, resumeFile: m.src }), true)}><Upload size={16} />Choose a public resume PDF</button>}
          </div>
          {section === "Photos" && <section className="album-editor"><div className="subheading"><h2>Photographs</h2><button onClick={() => chooseImage(m => update({ ...current.current.value, sample: false, coverImage: current.current.value.coverImage || m.src, photos: [...current.current.value.photos, { src: m.src, alt: "", caption: "", width: m.width, height: m.height }] }))}><Plus size={16} />Add photograph</button></div>{entry.value.photos.map((photo, index) => <div className="album-photo" key={index}><img src={photo.src} alt={photo.alt} /><div><label className="field"><span>Alt text</span><input value={photo.alt} onChange={e => update({ ...entry.value, photos: entry.value.photos.map((p, i) => i === index ? { ...p, alt: e.target.value } : p) })} /></label><label className="field"><span>Caption</span><textarea rows={2} value={photo.caption} onChange={e => update({ ...entry.value, photos: entry.value.photos.map((p, i) => i === index ? { ...p, caption: e.target.value } : p) })} /></label><div className="actions"><button className="quiet" onClick={() => update({ ...entry.value, coverImage: photo.src })}>{entry.value.coverImage === photo.src ? <Check size={16} /> : <Images size={16} />}Album cover</button><IconButton icon={ArrowUp} name="Move photo up" disabled={index === 0} onClick={() => { const photos = [...entry.value.photos]; [photos[index - 1], photos[index]] = [photos[index], photos[index - 1]]; update({ ...entry.value, photos }); }} /><IconButton icon={ArrowDown} name="Move photo down" disabled={index === entry.value.photos.length - 1} onClick={() => { const photos = [...entry.value.photos]; [photos[index + 1], photos[index]] = [photos[index], photos[index + 1]]; update({ ...entry.value, photos }); }} /><IconButton icon={Trash2} name="Remove photo from album" onClick={() => update({ ...entry.value, photos: entry.value.photos.filter((_, i) => i !== index), coverImage: entry.value.coverImage === photo.src ? "" : entry.value.coverImage })} /></div></div></div>)}</section>}
          {section === "Work" && <section className="article-editor"><h2>Additional project notes</h2><RichText key={entry.id} content={entry.value.body} onChange={body => update({ ...current.current.value, body })} chooseImage={chooseImage} /></section>}
        </div>
        <footer className="entry-footer"><button disabled={locked} onClick={() => act(async () => { if (!window.confirm("Discard local changes to this entry? The public site will not change.")) return; clearTimeout(timer.current); await queue.current.catch(() => {}); await api("discard", { id: entry.id, revision: revision.current }); dirty.current = false; current.current = null; setEntry(null); await reload(); })}><Trash2 size={16} />Discard local draft</button>{entry.published && ["Writing", "Photos", "Work"].includes(section) && <button disabled={locked} onClick={() => { if (window.confirm("Prepare to remove this page from the website? Review and publish is still required. Git history will retain the old content.")) update(entry.value, "unpublish"); }}>Prepare unpublish</button>}</footer>
      </div> : <>
        {section === "Overview" ? <><div className="overview-heading"><h2>Ready when you are.</h2><p>{drafts.length} local {drafts.length === 1 ? "change" : "changes"} awaiting review.</p></div><div className="quick-actions">{[["Writing", "New writing", PenLine], ["Photos", "New album", Images], ["Work", "New project", BriefcaseBusiness]].map(([name, text, Icon]) => <button key={name} onClick={() => { setSection(name); setCreating(true); }}><Icon size={20} />{text}<Plus size={16} /></button>)}</div><h2 className="list-title">Unpublished changes</h2><div className="content-list">{drafts.length ? drafts.map(item => <div className="content-row" key={item.id}><input type="checkbox" aria-label={"Select " + title(item)} checked={selected.includes(item.id)} onChange={e => setSelected(e.target.checked ? [...selected, item.id] : selected.filter(id => id !== item.id))} /><button className="row-link" onClick={() => act(() => open(item))}><strong>{title(item)}</strong><span>{kind(item.id)} / {item.operation === "unpublish" ? "Removal prepared" : item.conflict ? "Source conflict" : item.published ? "Unpublished changes" : "Private draft"}</span></button><PenLine size={16} /></div>) : <p className="empty">No local drafts yet.</p>}</div></> :
          <><div className="list-toolbar"><label className="search"><Search size={16} /><input aria-label={"Search " + section} placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} /></label>{["Writing", "Photos", "Work"].includes(section) && <button className="primary" onClick={() => setCreating(true)}><Plus size={16} />{section === "Photos" ? "New album" : section === "Work" ? "New project" : "New writing"}</button>}</div><div className="content-list">{items.map(item => <div className="content-row" key={item.id}>{item.draft && <input type="checkbox" aria-label={"Select " + title(item)} checked={selected.includes(item.id)} onChange={e => setSelected(e.target.checked ? [...selected, item.id] : selected.filter(id => id !== item.id))} />}<button className="row-link" onClick={() => act(() => open(item))}><strong>{title(item)}</strong><span>{item.value.date || item.value.year || ""}{item.value.section ? " / " + item.value.section : ""}</span></button><span className={"badge " + (item.draft ? "draft" : "")}>{item.draft ? "Local draft" : "Published source"}</span><PenLine size={16} /></div>)}</div>{section === "Photos" && <section className="media-section"><div className="subheading"><h2>Private uploads</h2><label className="upload-button"><Upload size={16} />Upload photos<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={locked} onChange={e => upload([...e.target.files])} /></label></div><div className="media-grid">{state.media.filter(m => !m.filename.endsWith(".pdf")).map(m => <figure key={m.filename}><img src={"/media/" + m.filename} alt="" /><figcaption>{m.name}</figcaption></figure>)}</div></section>}</>}
      </>}
    </main>
    {creating && <Modal title={section === "Photos" ? "New album" : section === "Work" ? "New project" : "New writing"} close={() => setCreating(false)}><form onSubmit={e => { e.preventDefault(); act(async () => { const item = newItem(section, newTitle.trim()); if (state.items.some(i => i.id === item.id)) throw new Error("That title already has a URL. Choose a different title."); await open(item); update(item.value); await flush(); setCreating(false); setNewTitle(""); }); }}><label className="field"><span>Title</span><input required value={newTitle} onChange={e => setNewTitle(e.target.value)} /></label><button className="primary" disabled={working}><Plus size={16} />Create draft</button></form></Modal>}
    {picker && <Modal title={picker.pdf ? "Choose a public resume" : "Choose a photograph"} close={() => setPicker(null)}><label className="upload-button"><Upload size={16} />Upload {picker.pdf ? "PDF" : "photos"}<input type="file" accept={picker.pdf ? ".pdf" : "image/jpeg,image/png,image/webp,image/avif"} multiple={!picker.pdf} disabled={locked} onChange={e => upload([...e.target.files])} /></label><div className="media-grid picker-grid">{state.media.filter(m => m.filename.endsWith(".pdf") === picker.pdf).map(m => <button key={m.filename} onClick={() => { picker.callback(m); setPicker(null); }}>{!picker.pdf && <img src={"/media/" + m.filename} alt="" />}<span>{m.name}</span></button>)}</div>{state.media.filter(m => m.filename.endsWith(".pdf") === picker.pdf).length === 0 && <p className="empty">No uploads yet.</p>}</Modal>}
    {review && <Modal title="Review publication" close={() => setReview(null)}><p className="review-summary">Only the files below will be included in this publication. Removed pages and PDFs can remain accessible in Git history.</p><ul className="review-files">{review.files.map(file => <li key={file.path}><span>{file.action}</span><code>{file.path}</code></li>)}</ul>{review.blocked && <div className="notice error">{review.blocked}</div>}{review.pdf && <label className="check"><input type="checkbox" checked={pdfConfirmed} onChange={e => setPdfConfirmed(e.target.checked)} />I reviewed this PDF and approve making its contents public.</label>}<button className="primary" disabled={!!review.blocked || locked || (review.pdf && !pdfConfirmed)} onClick={() => act(async () => { await api("publish", { ids: review.ids, token: review.token, confirmPdf: pdfConfirmed }); setReview(null); setJob({ status: "working", message: "Checking publication..." }); })}><Send size={16} />Publish reviewed changes</button></Modal>}
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
