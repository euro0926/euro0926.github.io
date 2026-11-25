function makeArtworkDataUri(label, c1, c2, monochrome = false) {
  const filterAttr = monochrome ? 'filter="grayscale(100%) contrast(135%)"' : "";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}" />
          <stop offset="100%" stop-color="${c2}" />
        </linearGradient>
      </defs>
      <g ${filterAttr}>
        <rect width="800" height="500" fill="url(#g)" />
        <circle cx="610" cy="150" r="95" fill="rgba(255,255,255,0.22)" />
        <polygon points="0,500 260,230 470,500" fill="rgba(0,0,0,0.16)" />
        <polygon points="320,500 590,260 800,500" fill="rgba(0,0,0,0.24)" />
        <text x="44" y="445" fill="#ffffff" font-family="sans-serif" font-size="44" font-weight="700">${label}</text>
      </g>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const photos = [
  {
    id: "alley",
    title: "Alley",
    dateLabel: "Oct 12",
    timestamp: new Date("2026-10-12").getTime(),
    note: "Evening light between tall city buildings.",
    beforeSrc: makeArtworkDataUri("Alley · Before", "#e07a5f", "#3d405b", false),
    afterSrc: makeArtworkDataUri("Alley · After", "#e07a5f", "#3d405b", true),
    showAfter: false
  },
  {
    id: "beach",
    title: "Beach",
    dateLabel: "Aug 20",
    timestamp: new Date("2026-08-20").getTime(),
    note: "Warm morning tide along the shore.",
    beforeSrc: makeArtworkDataUri("Beach · Before", "#f4a261", "#2a9d8f", false),
    afterSrc: makeArtworkDataUri("Beach · After", "#f4a261", "#2a9d8f", true),
    showAfter: false
  },
  {
    id: "night",
    title: "Night",
    dateLabel: "Sep 03",
    timestamp: new Date("2026-09-03").getTime(),
    note: "Quiet street reflections after rain.",
    beforeSrc: makeArtworkDataUri("Night · Before", "#5e60ce", "#48bfe3", false),
    afterSrc: makeArtworkDataUri("Night · After", "#5e60ce", "#48bfe3", true),
    showAfter: false
  }
];

function byNewest(a, b) {
  return b.timestamp - a.timestamp;
}

function byTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Merge Sort implementation: O(n log n)
function mergeSort(items, compareFn) {
  if (items.length <= 1) {
    return items.slice();
  }
  const mid = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, mid), compareFn);
  const right = mergeSort(items.slice(mid), compareFn);
  return merge(left, right, compareFn);
}

function merge(left, right, compareFn) {
  const merged = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      merged.push(left[i]);
      i += 1;
    } else {
      merged.push(right[j]);
      j += 1;
    }
  }

  while (i < left.length) {
    merged.push(left[i]);
    i += 1;
  }

  while (j < right.length) {
    merged.push(right[j]);
    j += 1;
  }

  return merged;
}

let currentSort = "newest";
let orderedPhotos = mergeSort(photos, byNewest);

const galleryEl = document.getElementById("gallery");
const newestBtn = document.getElementById("newest-btn");
const titleBtn = document.getElementById("title-btn");
const statusEl = document.getElementById("sort-status");
const orderEl = document.getElementById("sort-order");

function renderGallery() {
  galleryEl.innerHTML = "";

  orderedPhotos.forEach((photo) => {
    const card = document.createElement("article");
    card.className = "card";

    const img = document.createElement("img");
    img.src = photo.showAfter ? photo.afterSrc : photo.beforeSrc;
    img.alt = `${photo.title} (${photo.showAfter ? "After" : "Before"})`;

    const body = document.createElement("div");
    body.className = "card-body";

    const top = document.createElement("div");
    top.className = "card-top";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = photo.title;

    const date = document.createElement("span");
    date.className = "card-date";
    date.textContent = photo.dateLabel;

    const note = document.createElement("p");
    note.className = "card-note";
    note.textContent = photo.note;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "toggle-btn";
    toggleBtn.textContent = photo.showAfter ? "Show Before" : "Show After";
    toggleBtn.addEventListener("click", () => {
      photo.showAfter = !photo.showAfter;
      renderGallery();
    });

    top.appendChild(title);
    top.appendChild(date);
    body.appendChild(top);
    body.appendChild(note);
    body.appendChild(toggleBtn);
    card.appendChild(img);
    card.appendChild(body);
    galleryEl.appendChild(card);
  });

  newestBtn.classList.toggle("active", currentSort === "newest");
  titleBtn.classList.toggle("active", currentSort === "title");

  statusEl.textContent =
    currentSort === "newest"
      ? "Sorted by Newest using mergeSort(photos, byNewest)"
      : "Sorted by Title A-Z using mergeSort(photos, byTitle)";

  orderEl.textContent = orderedPhotos
    .map((p, idx) => `${idx + 1}. ${p.title} (${p.dateLabel})`)
    .join("  ->  ");
}

function applySort(mode) {
  currentSort = mode;
  const comparator = mode === "title" ? byTitle : byNewest;
  orderedPhotos = mergeSort(orderedPhotos, comparator);
  renderGallery();
}

newestBtn.addEventListener("click", () => applySort("newest"));
titleBtn.addEventListener("click", () => applySort("title"));

renderGallery();