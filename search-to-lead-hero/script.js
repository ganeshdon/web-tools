// One timeline drives the whole hero: each step adds a class to .stage and CSS does the motion.
const CITIES = ["New York", "London", "Dubai", "Toronto", "Sydney", "Chennai"];
const stage = document.querySelector(".stage");
const query = document.getElementById("query");
const addr = document.getElementById("addr");
const toastCity = document.getElementById("toastCity");
const fields = [...document.querySelectorAll(".f")];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

let loop = 0;
let timers = [];
const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));

async function type(el, text, speed = 55) {
  el.textContent = "";
  for (const ch of text) {
    el.textContent += ch;
    await wait(speed);
  }
}

function reset() {
  stage.className = "stage";
  query.textContent = "";
  addr.textContent = "google.com";
  fields.forEach((f) => (f.textContent = ""));
}

function finalFrame(city) {
  stage.className = "stage s-results s-site s-toast";
  query.textContent = `website development company in ${city}`;
  addr.textContent = "billionwebstudio.com";
  fields.forEach((f) => (f.textContent = f.dataset.v));
  toastCity.textContent = `From ${city} · just now`;
}

async function run() {
  const id = ++loop;
  timers.forEach(clearTimeout);
  timers = [];
  const city = CITIES[(id - 1) % CITIES.length];
  if (reduce) return finalFrame(city);

  reset();
  await wait(500);
  await type(query, `website development company in ${city}`);
  await wait(300);
  stage.classList.add("s-results");
  await wait(1100);
  stage.classList.add("s-hover");
  await wait(900);
  addr.textContent = "billionwebstudio.com";
  stage.classList.add("s-site");
  await wait(800);
  for (const f of fields) await type(f, f.dataset.v, 45);
  stage.classList.add("s-press");
  await wait(250);
  stage.classList.remove("s-press");
  toastCity.textContent = `From ${city} · just now`;
  stage.classList.add("s-toast");
  await wait(2600);
  if (id === loop) run();
}

document.getElementById("replay").addEventListener("click", run);
run();
