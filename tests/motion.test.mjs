import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { build } from "esbuild";

const bundled = await build({
  entryPoints: ["components/MotionController.tsx"],
  bundle: true, write: false, platform: "node", format: "cjs",
  plugins: [{
    name: "hook-fixtures",
    setup(builder) {
      builder.onResolve({ filter: /^(react|next\/navigation)$/ }, args => ({ path: args.path, namespace: "fixture" }));
      builder.onLoad({ filter: /.*/, namespace: "fixture" }, args => ({
        contents: args.path === "react"
          ? "export const useEffect = effect => { globalThis.effect = effect; };"
          : 'export const usePathname = () => "/";',
      }));
    },
  }],
});
class Element {
  constructor(top = 1200, parent = null, prose = false) {
    this.top = top; this.parentElement = parent; this.prose = prose; this.children = []; this.handlers = {};
    this.classes = new Set(["reveal"]); this.styles = new Map();
    this.classList = { add: c => this.classes.add(c), remove: c => this.classes.delete(c) };
    this.style = { setProperty: (k, v) => this.styles.set(k, v), removeProperty: k => this.styles.delete(k) };
  }
  getBoundingClientRect() { return { top: this.top, left: 0 }; }
  matches(selector) { return selector === ".reveal" && this.classes.has("reveal"); }
  querySelectorAll() { return this.children; }
  closest(selector) { return selector === ".prose" ? this.prose ? this : null : this; }
  contains(element) { return element === this || this.children.includes(element); }
  addEventListener(event, handler) { this.handlers[event] = handler; }
  removeEventListener(event) { delete this.handlers[event]; }
}
function fixture({ reduced = false, supported = true } = {}) {
  const root = new Element(0); root.classes.clear();
  const visible = new Element(100, root), first = new Element(1000, root), second = new Element(1000, root), article = new Element(1300, root, true);
  root.children = [visible, first, second, article];
  const preference = { matches: reduced, addEventListener: (_, callback) => { preference.change = callback; }, removeEventListener: () => { delete preference.change; } };
  const observers = [], mutations = [];
  class Intersection {
    constructor(callback, options) { this.callback = callback; this.options = options; this.watched = new Set(); observers.push(this); }
    observe(element) { this.watched.add(element); }
    unobserve(element) { this.watched.delete(element); }
    disconnect() { this.watched.clear(); }
  }
  class Mutation {
    constructor(callback) { this.callback = callback; mutations.push(this); }
    observe() {}
    disconnect() {}
  }
  const compiledModule = { exports: {} };
  const context = vm.createContext({ module: compiledModule, exports: compiledModule.exports, Element, HTMLElement: Element,
    IntersectionObserver: Intersection, MutationObserver: Mutation,
    document: { getElementById: () => root, activeElement: null },
    window: { innerHeight: 900, matchMedia: () => preference, ...(supported ? { IntersectionObserver: Intersection } : {}) },
  });
  vm.runInContext(bundled.outputFiles[0].text, context);
  compiledModule.exports.MotionController();
  const cleanup = context.effect();
  return { root, visible, first, second, article, preference, observers, mutations, cleanup };
}
test("only offscreen content is armed; article prose stays readable", () => {
  const f = fixture();
  assert.equal(f.visible.classes.has("reveal-pending"), false);
  assert.equal(f.first.classes.has("reveal-pending"), true);
  assert.equal(f.article.classes.has("reveal-pending"), false);
  assert.equal(f.observers[0].watched.size, 2);
  f.cleanup();
});
test("elements entering together reveal once with a bounded stagger", () => {
  const f = fixture(), observer = f.observers[0];
  observer.callback([f.first, f.second].map(target => ({ target, isIntersecting: true, boundingClientRect: { top: 600, left: 0 } })));
  assert.equal(f.first.classes.has("reveal-pending"), false);
  assert.equal(f.first.styles.get("--reveal-delay"), "0ms");
  assert.equal(f.second.styles.get("--reveal-delay"), "80ms");
  assert.equal(observer.watched.size, 0);
  f.cleanup();
});
test("reduced motion disables reveals and clears pending content immediately", () => {
  const f = fixture();
  f.preference.matches = true;
  f.preference.change();
  assert.equal(f.first.classes.has("reveal-pending"), false);
  assert.equal(f.observers[0].watched.size, 0);
  f.preference.matches = false;
  f.preference.change();
  assert.equal(f.first.classes.has("reveal-pending"), true);
  f.cleanup();
  const reduced = fixture({ reduced: true });
  assert.equal(reduced.observers.length, 0);
  reduced.cleanup();
});
test("filtered or streamed additions are registered and removed nodes cleaned up", () => {
  const f = fixture(), added = new Element(1400, f.root);
  f.root.children = [f.visible, added];
  f.mutations[0].callback([{ addedNodes: [added] }]);
  assert.equal(added.classes.has("reveal-pending"), true);
  assert.equal(f.observers[0].watched.has(added), true);
  assert.equal(f.observers[0].watched.has(f.first), false);
  assert.equal(f.first.classes.has("reveal-pending"), false);
  f.cleanup();
});
test("keyboard focus reveals its target immediately and cleanup resets all styles", () => {
  const f = fixture();
  f.root.handlers.focusin({ target: f.first });
  assert.equal(f.first.classes.has("reveal-pending"), false);
  assert.equal(f.first.styles.get("--reveal-delay"), "0ms");
  f.cleanup();
  assert.equal(f.second.classes.has("reveal-pending"), false);
  assert.equal(f.first.styles.size, 0);
  assert.equal(f.preference.change, undefined);
  assert.equal(f.root.handlers.focusin, undefined);
});
test("unsupported browsers leave all content visible", () => {
  const f = fixture({ supported: false });
  assert.equal(f.observers.length, 0);
  assert.equal(f.first.classes.has("reveal-pending"), false);
});
test("exported home, about and photo pages retain scroll-reveal coverage", () => {
  for (const [file, minimum] of [["out/index.html", 8], ["out/about/index.html", 10], ["out/photos/index.html", 3]]) {
    const html = fs.readFileSync(file, "utf8");
    assert.ok((html.match(/class="[^"]*\breveal\b[^"]*"/g) ?? []).length >= minimum, file);
    assert.ok(!html.includes("reveal-pending"), "Static HTML must start visible without JavaScript.");
  }
  const article = fs.readFileSync("out/writing/calm-technology/index.html", "utf8");
  assert.ok(!/class="(?:prose|reading-shell article-shell)[^"]*reveal/.test(article));
});
