// SERP snippet preview: measures title and description width in pixels with the fonts Google uses,
// then truncates the preview the way a results page would. Limits are working guides, not Google rules.
const LIMITS = {
  desktop: { title: 580, desc: 920 },
  mobile: { title: 920, desc: 680 } // mobile titles wrap to two lines of about 460 px
};

const $ = (id) => document.getElementById(id);
const ctx = document.createElement("canvas").getContext("2d");

function width(text, font) {
  ctx.font = font;
  return Math.round(ctx.measureText(text).width);
}

function truncate(text, font, max) {
  if (width(text, font) <= max) return text;
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (width(text.slice(0, mid) + " ...", font) <= max) lo = mid;
    else hi = mid - 1;
  }
  return text.slice(0, lo).trimEnd() + " ...";
}

function meter(el, px, max, chars) {
  const ratio = px / max;
  el.className = "meter" + (ratio > 1 ? " bad" : ratio > 0.92 ? " warn" : "");
  el.querySelector("i").style.width = Math.min(ratio, 1) * 100 + "%";
  el.querySelector("b").textContent = `${px} / ${max} px · ${chars} chars`;
}

function parts(raw) {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.split("/").filter(Boolean);
    const name = host.split(".")[0].replace(/-/g, " ");
    return { name: name.replace(/\b\w/g, (c) => c.toUpperCase()), crumb: [u.origin, ...path].join(" › ") };
  } catch {
    return { name: "Your site", crumb: "Enter a full URL starting with https://" };
  }
}

function render() {
  const device = document.querySelector('input[name="device"]:checked').value;
  const lim = LIMITS[device];
  const title = $("title").value.trim();
  const desc = $("desc").value.trim().replace(/\s+/g, " ");
  const tFont = "20px Arial";
  const dFont = "14px Arial";
  const tPx = width(title, tFont);
  const dPx = width(desc, dFont);

  meter($("titleMeter"), tPx, lim.title, title.length);
  meter($("descMeter"), dPx, lim.desc, desc.length);

  const p = parts($("url").value.trim());
  $("siteName").textContent = p.name;
  $("crumb").textContent = p.crumb;
  $("serp").classList.toggle("mobile", device === "mobile");
  $("pTitle").textContent = truncate(title || "Add a title tag", tFont, lim.title);
  $("pDesc").textContent = truncate(desc || "Add a meta description. Without one, Google picks text from the page.", dFont, lim.desc);

  const tips = [];
  if (!title) tips.push(["bad", "No title. Every indexable page needs a unique title tag."]);
  else if (tPx > lim.title) tips.push(["bad", `The title runs about ${tPx - lim.title} px over, so the end will be cut. Move the main keyword and offer to the front.`]);
  else if (tPx < lim.title * 0.45) tips.push(["warn", "The title is short. There is room for the main keyword plus a reason to click."]);
  else tips.push(["good", "The title should show in full on this device."]);

  if (!desc) tips.push(["warn", "No description. Google will write its own snippet from the page text."]);
  else if (dPx > lim.desc) tips.push(["warn", "The description will be trimmed. Keep the key promise in the first sentence."]);
  else tips.push(["good", "The description fits. Google may still rewrite it to match the search."]);

  if (/\b(home|untitled|welcome)\b/i.test(title)) tips.push(["bad", "Generic words like Home or Welcome waste the most valuable space on the page."]);

  $("tips").innerHTML = tips.map(([c, t]) => `<li class="${c}">${t}</li>`).join("");
}

document.getElementById("form").addEventListener("input", render);
document.fonts.ready.then(render);
render();
