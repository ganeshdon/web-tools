// Core Web Vitals gauges. Thresholds are Google's (web.dev/articles/vitals): a metric is "good" at or below the
// first value, "poor" above the second, and "needs improvement" in between.
const METRICS = {
  lcp: { good: 2.5, poor: 4, max: 8, fmt: (v) => v.toFixed(1) + " s",
    fix: { good: "Fast. The main content shows before most visitors think about leaving.",
           mid: "Usually a heavy hero image or slow server. Serve the hero as AVIF or WebP at the size it displays, and preload it.",
           bad: "Too slow. Check server response time first, then render-blocking scripts and an oversized hero image." } },
  inp: { good: 200, poor: 500, max: 900, fmt: (v) => Math.round(v) + " ms",
    fix: { good: "Taps and clicks feel instant.",
           mid: "Long JavaScript tasks are delaying the response. Break them up and load third-party widgets later.",
           bad: "The page feels stuck after a tap. Audit chat widgets, trackers and big frameworks running on the main thread." } },
  cls: { good: 0.1, poor: 0.25, max: 0.5, fmt: (v) => v.toFixed(2),
    fix: { good: "The layout stays put while it loads.",
           mid: "Something shifts. Give images and embeds width and height, and reserve space for banners.",
           bad: "Content jumps under the visitor's finger. Fix late-loading fonts, ads and cookie bars that push the page down." } }
};

const COLORS = { good: "#0c9d58", mid: "#f2a600", bad: "#e5443a" };

function arc(from, to, color) {
  // Angles run from 180deg (left) to 0deg (right) around the centre (100, 100).
  const a0 = Math.PI * (1 - from), a1 = Math.PI * (1 - to);
  const r = 80;
  const p = (a) => [100 + r * Math.cos(a), 100 - r * Math.sin(a)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `<path d="M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}" stroke="${color}" stroke-width="18" fill="none"/>`;
}

function band(m, v) {
  return v <= m.good ? "good" : v > m.poor ? "bad" : "mid";
}

function draw(card) {
  const key = card.dataset.metric;
  const m = METRICS[key];
  const input = card.querySelector("input");
  const v = parseFloat(input.value);
  const g = m.good / m.max, p = m.poor / m.max;
  const angle = Math.min(v / m.max, 1) * 180 - 90;
  const svg = card.querySelector("svg");
  if (!svg.dataset.ready) {
    svg.innerHTML = arc(0, g, COLORS.good) + arc(g, p, COLORS.mid) + arc(p, 1, COLORS.bad) +
      `<g class="needle"><line x1="100" y1="100" x2="100" y2="34" stroke="#121316" stroke-width="4" stroke-linecap="round"/></g>` +
      `<circle cx="100" cy="100" r="8" fill="#121316"/>`;
    svg.dataset.ready = "1";
  }
  svg.querySelector(".needle").style.transform = `rotate(${angle}deg)`;
  const b = band(m, v);
  const out = card.querySelector(".value");
  out.textContent = m.fmt(v);
  out.className = "value " + b;
  card.querySelector(".fix").textContent = m.fix[b];
  input.setAttribute("aria-valuetext", `${m.fmt(v)}, ${b === "mid" ? "needs improvement" : b}`);
  return b;
}

function update() {
  const bands = [...document.querySelectorAll(".card")].map(draw);
  const pass = bands.every((b) => b === "good");
  const failing = Object.keys(METRICS).filter((_, i) => bands[i] !== "good").map((k) => k.toUpperCase());
  document.getElementById("verdict").innerHTML = pass
    ? `<span class="pill pass">Pass</span><span>All three metrics are good.</span><span>This page passes the Core Web Vitals assessment.</span>`
    : `<span class="pill fail">Fail</span><span>Not passing: ${failing.join(", ")}.</span><span>One weak metric is enough to fail the assessment.</span>`;
}

document.querySelectorAll(".card input").forEach((i) => i.addEventListener("input", update));
update();
