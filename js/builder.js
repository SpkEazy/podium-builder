// js/builder.js
// Podium Builder (GitHub Pages safe) — Broker dropdown + DOCX parsing + reliable download via toBlob()

async function waitForElement(selector, root = document, timeout = 1500) {
  const start = Date.now();
  while (!root.querySelector(selector)) {
    await new Promise(r => requestAnimationFrame(r));
    if (Date.now() - start > timeout) return null;
  }
  return root.querySelector(selector);
}

function getImageDataUrl(inputId) {
  return new Promise((resolve) => {
    const file = document.getElementById(inputId)?.files?.[0];
    if (!file) return resolve('');
    if (file.size > 50 * 1024 * 1024) {
      alert("⚠️ Please upload an image under 50MB.");
      return resolve('');
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// -----------------------------------------
// ✅ Broker library (Podium uses PNG)
// Make sure you have: assets/brokers/<slug>/broker-photo.png
// -----------------------------------------
const BROKERS = {
  "alex-krause": {
    displayName: "Alex Krause",
    brokerName: "ALEX KRAUSE",
    brokerPhone: "078 549 2029",
    brokerEmail: "alex@auctioninc.co.za",
    brokerPhoto: "assets/brokers/alex-krause/broker-photo.png"
  },
  "bongane-khumalo": {
    displayName: "Bongane Khumalo",
    brokerName: "BONGANE KHUMALO",
    brokerPhone: "073 785 5100",
    brokerEmail: "bongane@auctioninc.co.za",
    brokerPhoto: "assets/brokers/bongane-khumalo/broker-photo.png"
  },
  "cliff-matshatsha": {
    displayName: "Cliff Matshatsha",
    brokerName: "CLIFF MATSHATSHA",
    brokerPhone: "082 099 8692",
    brokerEmail: "cliff@auctioninc.co.za",
    brokerPhoto: "assets/brokers/cliff-matshatsha/broker-photo.png"
  },
  "daniel-wachenheimer": {
    displayName: "Daniel Wachenheimer",
    brokerName: "DANIEL WACHENHEIMER",
    brokerPhone: "082 740 2856",
    brokerEmail: "daniel@auctioninc.co.za",
    brokerPhoto: "assets/brokers/daniel-wachenheimer/broker-photo.png"
  },
  "dean-doucha": {
    displayName: "Dean Doucha",
    brokerName: "DEAN DOUCHA",
    brokerPhone: "082 374 5565",
    brokerEmail: "dean@auctioninc.co.za",
    brokerPhoto: "assets/brokers/dean-doucha/broker-photo.png"
  },
  "doron-sacks": {
    displayName: "Doron Sacks",
    brokerName: "DORON SACKS",
    brokerPhone: "082 550 7081",
    brokerEmail: "doron@auctioninc.co.za",
    brokerPhoto: "assets/brokers/doron-sacks/broker-photo.png"
  },
  "elki-medalie": {
    displayName: "Elki Medalie",
    brokerName: "ELKI MEDALIE",
    brokerPhone: "083 764 5370",
    brokerEmail: "elki@auctioninc.co.za",
    brokerPhoto: "assets/brokers/elki-medalie/broker-photo.png"
  },
  "gary-brower": {
    displayName: "Gary Brower",
    brokerName: "GARY BROWER",
    brokerPhone: "082 352 5552",
    brokerEmail: "garyb@auctioninc.co.za",
    brokerPhoto: "assets/brokers/gary-brower/broker-photo.png"
  },
  "george-merricks": {
    displayName: "George Merricks",
    brokerName: "GEORGE MERRICKS",
    brokerPhone: "082 859 9303",
    brokerEmail: "george@auctioninc.co.za",
    brokerPhoto: "assets/brokers/george-merricks/broker-photo.png"
  },
  "gerhard-venter": {
    displayName: "Gerhard Venter",
    brokerName: "GERHARD VENTER",
    brokerPhone: "076 905 5519",
    brokerEmail: "gerhard@auctioninc.co.za",
    brokerPhoto: "assets/brokers/gerhard-venter/broker-photo.png"
  },
  "jenny-pillay": {
    displayName: "Jenny Pillay",
    brokerName: "JENNY PILLAY",
    brokerPhone: "063 959 2260",
    brokerEmail: "jenny@auctioninc.co.za",
    brokerPhoto: "assets/brokers/jenny-pillay/broker-photo.png"
  },
  "jessica-beyers-lahner": {
    displayName: "Jessica Beyers-Lahner",
    brokerName: "JESSICA BEYERS-LAHNER",
    brokerPhone: "072 576 0973",
    brokerEmail: "jessica@auctioninc.co.za",
    brokerPhoto: "assets/brokers/jessica-beyers-lahner/broker-photo.png"
  },
  "jodi-bedil": {
    displayName: "Jodi Bedil",
    brokerName: "JODI BEDIL",
    brokerPhone: "076 637 1273",
    brokerEmail: "jodib@auctioninc.co.za",
    brokerPhoto: "assets/brokers/jodi-bedil/broker-photo.png"
  },
  "jodi-frankel": {
    displayName: "Jodi Frankel",
    brokerName: "JODI FRANKEL",
    brokerPhone: "082 441 8409",
    brokerEmail: "jodif@auctioninc.co.za",
    brokerPhoto: "assets/brokers/jodi-frankel/broker-photo.png"
  },
  "keith-nkosi": {
    displayName: "Keith Nkosi",
    brokerName: "KEITH NKOSI",
    brokerPhone: "081 828 1817",
    brokerEmail: "keith@auctioninc.co.za",
    brokerPhoto: "assets/brokers/keith-nkosi/broker-photo.png"
  },
  "luanda-tlhotlhalemaje": {
    displayName: "Luanda Tlhotlhalemaje",
    brokerName: "LUANDA TLHOTLHALEMAJE",
    brokerPhone: "071 904 4061",
    brokerEmail: "luanda@skyriseproperties.co.za",
    brokerPhoto: "assets/brokers/luanda-tlhotlhalemaje/broker-photo.png"
  },
  "nic-brett": {
    displayName: "Nic Brett",
    brokerName: "NIC BRETT",
    brokerPhone: "078 330 7523",
    brokerEmail: "nic@auctioninc.co.za",
    brokerPhoto: "assets/brokers/nic-brett/broker-photo.png"
  },
  "reece-louw": {
    displayName: "Reece Louw",
    brokerName: "REECE LOUW",
    brokerPhone: "076 393 1131",
    brokerEmail: "reece@auctioninc.co.za",
    brokerPhoto: "assets/brokers/reece-louw/broker-photo.png"
  },
  "reshma-sookran": {
    displayName: "Reshma Sookran",
    brokerName: "RESHMA SOOKRAN",
    brokerPhone: "071 876 6524",
    brokerEmail: "reshma@auctioninc.co.za",
    brokerPhoto: "assets/brokers/reshma-sookran/broker-photo.png"
  },
  "shlomo-hecht": {
    displayName: "Shlomo Hecht",
    brokerName: "SHLOMO HECHT",
    brokerPhone: "073 791 7967",
    brokerEmail: "shlomo@auctioninc.co.za",
    brokerPhoto: "assets/brokers/shlomo-hecht/broker-photo.png"
  },
  "sim-mthembu": {
    displayName: "Sim Mthembu",
    brokerName: "SIM MTHEMBU",
    brokerPhone: "063 829 7431",
    brokerEmail: "simphiwe@auctioninc.co.za",
    brokerPhoto: "assets/brokers/sim-mthembu/broker-photo.png"
  },
  "stuart-holliman": {
    displayName: "Stuart Holliman",
    brokerName: "STUART HOLLIMAN",
    brokerPhone: "067 373 9239",
    brokerEmail: "stuart@auctioninc.co.za",
    brokerPhoto: "assets/brokers/stuart-holliman/broker-photo.png"
  },
  "thabani-ncube": {
    displayName: "Thabani Ncube",
    brokerName: "THABANI NCUBE",
    brokerPhone: "071 624 2899",
    brokerEmail: "thabani@auctioninc.co.za",
    brokerPhoto: "assets/brokers/thabani-ncube/broker-photo.png"
  },
  "yoni-dadon": {
    displayName: "Yoni Dadon",
    brokerName: "YONI DADON",
    brokerPhone: "061 822 6128",
    brokerEmail: "yoni@auctioninc.co.za",
    brokerPhoto: "assets/brokers/yoni-dadon/broker-photo.png"
  }
};

const DEFAULT_BROKER_SLUG = "alex-krause";

// Populate broker dropdown
function populateBrokerDropdown() {
  const select = document.getElementById("broker-select");
  if (!select) return;

  const entries = Object.entries(BROKERS);
  entries.sort((a, b) => (a[1].displayName || a[0]).localeCompare(b[1].displayName || b[0]));

  select.innerHTML = "";
  for (const [slug, b] of entries) {
    const opt = document.createElement("option");
    opt.value = slug;
    opt.textContent = b.displayName || b.brokerName || slug;
    select.appendChild(opt);
  }

  if (BROKERS[DEFAULT_BROKER_SLUG]) {
    select.value = DEFAULT_BROKER_SLUG;
  } else if (select.options.length) {
    select.selectedIndex = 0;
  }
}
document.addEventListener("DOMContentLoaded", populateBrokerDropdown);

// -----------------------------------------
// DOCX extraction (property fields ONLY)
// -----------------------------------------
async function extractDocxFields() {
  const file = document.getElementById("docx-file")?.files?.[0];
  if (!file) return {};

  const buffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const documentXml = await zip.file("word/document.xml").async("string");

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(documentXml, "application/xml");

  const texts = Array.from(xmlDoc.getElementsByTagName("w:t"))
    .map(t => (t.textContent || "").trim())
    .filter(Boolean);

  const fieldMap = {
    "Headline": "headline",
    "City": "city",
    "Suburb": "suburb",
    "Tagline 1": "tag1",
    "Tagline 2": "tag2",
    "Feature 1": "feat1",
    "Feature 2": "feat2",
    "Feature 3": "feat3",
    "GLA": "gla",
    "ERF Size": "erf",
    "Date & Time": "date"
  };

  const values = {};
  for (let i = 0; i < texts.length; i++) {
    const label = texts[i].replace(/:$/, "");
    const key = fieldMap[label];
    if (key) {
      for (let j = i + 1; j < texts.length; j++) {
        const candidate = texts[j];
        if (candidate && candidate !== ":") {
          values[key] = candidate;
          break;
        }
      }
    }
  }

  return values;
}

// -----------------------------------------
// Data collection (broker comes from dropdown)
// -----------------------------------------
async function collectPodiumFormData() {
  const docxFields = await extractDocxFields();

  const selectedSlug =
    document.getElementById("broker-select")?.value ||
    DEFAULT_BROKER_SLUG;

  const broker = BROKERS[selectedSlug] || BROKERS[DEFAULT_BROKER_SLUG];

  return {
    ...docxFields,
    propertyImage: await getImageDataUrl("property-img"),
    mapImage: await getImageDataUrl("map-img"),
    brokerName: (broker?.brokerName || "AUCTIONINC").toUpperCase(),
    brokerPhone: broker?.brokerPhone || "",
    brokerEmail: broker?.brokerEmail || "",
    brokerPhoto: broker?.brokerPhoto || ""
  };
}

// -----------------------------------------
// Template loader & rendering
// -----------------------------------------
async function loadTemplate(templatePath, targetId, data) {
  const res = await fetch(templatePath);
  let html = await res.text();

  // Replace placeholders
  for (const key in data) {
    html = html.replaceAll(`{{${key}}}`, data[key] ?? "");
  }

  const target = document.getElementById(targetId);
  target.innerHTML = "";
  target.innerHTML = html;

  await waitForImagesToLoad(target);

  const container = await waitForElement("#capture-container-podium", target);
  if (container) runFontResize(container);
}

function waitForImagesToLoad(container) {
  const images = container.querySelectorAll("img");
  const promises = Array.from(images).map(img =>
    new Promise(resolve => {
      if (img.complete) return resolve();
      img.onload = img.onerror = resolve;
    })
  );
  return Promise.all(promises).then(() => new Promise(r => requestAnimationFrame(r)));
}

// -----------------------------------------
// Font resize utilities (keeps look, prevents overflow)
// -----------------------------------------
function adjustFontSize(textbox) {
  const span = textbox.querySelector("span");
  if (!span) return;

  const text = span.innerText;
  const maxWidth = textbox.offsetWidth - 20;
  const maxHeight = textbox.offsetHeight - 20;

  let fontSize = 200;
  const dummy = document.createElement("span");
  dummy.style.visibility = "hidden";
  dummy.style.position = "absolute";
  dummy.style.fontSize = fontSize + "px";
  dummy.style.fontFamily = "Roboto, sans-serif";
  dummy.style.fontWeight = "900";
  dummy.innerText = text;
  document.body.appendChild(dummy);

  while ((dummy.offsetWidth > maxWidth || dummy.offsetHeight > maxHeight) && fontSize > 10) {
    fontSize--;
    dummy.style.fontSize = fontSize + "px";
  }

  span.style.fontSize = fontSize + "px";
  document.body.removeChild(dummy);
}

function runFontResize(container) {
  const ids = [
    "textbox_suburb",
    "textbox_title",
    "textboxRT1",
    "textboxRT2",
    "textbox_Feature_1",
    "textbox_Feature_2",
    "textbox_Feature_3"
  ];

  ids.forEach(id => {
    const el = container.querySelector(`#${id}`);
    if (el) adjustFontSize(el);
  });

  // Keep phone big but ensure it fits
  const contact = container.querySelector("#textbox_Contact_Details");
  if (contact) {
    const spans = contact.querySelectorAll("span");
    spans.forEach(sp => {
      // For phone, we don't want it to shrink too aggressively
      if (sp.classList.contains("phone-number")) return;
      // For broker name, fit safely
      const parent = contact;
      const maxW = parent.clientWidth - 10;
      // Give name a reasonable height to fit
      let fontSize = 60;
      sp.style.fontSize = fontSize + "px";
      while (sp.scrollWidth > maxW && fontSize > 18) {
        fontSize--;
        sp.style.fontSize = fontSize + "px";
      }
    });
  }
}

// -----------------------------------------
// Download logic (more reliable + smaller memory use)
// -----------------------------------------
async function downloadCanvasAsPng(canvas, filename) {
  if (canvas.toBlob) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          const link = document.createElement("a");
          link.download = filename;
          link.href = canvas.toDataURL("image/png");
          link.click();
          return resolve();
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve();
      }, "image/png");
    });
  }

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// -----------------------------------------
// Main action
// -----------------------------------------
async function generateAndDownload(templateType) {
  if (templateType !== "podium") return alert("❌ Unknown template type.");

  const data = await collectPodiumFormData();

  await loadTemplate("templates/podium.html", "podium-page-preview", JSON.parse(JSON.stringify(data)));

  const wrapper = document.getElementById("podium-page-preview");
  const container = await waitForElement("#capture-container-podium", wrapper);
  if (!container) return alert("❌ Could not render the podium template.");

  // Fixed A4 height
  container.style.height = "3508px";

  await waitForImagesToLoad(container);
  await new Promise(resolve => setTimeout(resolve, 300));

  // ✅ Print-ready without being massive:
  // 2480x3508 at scale 2 gives strong quality but smaller than scale 3.
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    windowHeight: container.scrollHeight
  });

  await downloadCanvasAsPng(canvas, "podium_page.png");

  // Clean preview after download (optional)
  container.innerHTML = "";
}
