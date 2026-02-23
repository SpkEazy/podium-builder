// js/builder.js
// Podium Builder (GitHub Pages safe)

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

/* ============================
   BROKER LIBRARY (UNCHANGED)
   ============================ */

const BROKERS = {
  "alex-krause": { displayName:"Alex Krause", brokerName:"ALEX KRAUSE", brokerPhone:"078 549 2029", brokerEmail:"alex@auctioninc.co.za", brokerPhoto:"assets/brokers/alex-krause/broker-photo.png" },
  "bongane-khumalo": { displayName:"Bongane Khumalo", brokerName:"BONGANE KHUMALO", brokerPhone:"073 785 5100", brokerEmail:"bongane@auctioninc.co.za", brokerPhoto:"assets/brokers/bongane-khumalo/broker-photo.png" },
  "cliff-matshatsha": { displayName:"Cliff Matshatsha", brokerName:"CLIFF MATSHATSHA", brokerPhone:"082 099 8692", brokerEmail:"cliff@auctioninc.co.za", brokerPhoto:"assets/brokers/cliff-matshatsha/broker-photo.png" },
  "daniel-wachenheimer": { displayName:"Daniel Wachenheimer", brokerName:"DANIEL WACHENHEIMER", brokerPhone:"082 740 2856", brokerEmail:"daniel@auctioninc.co.za", brokerPhoto:"assets/brokers/daniel-wachenheimer/broker-photo.png" },
  "dean-doucha": { displayName:"Dean Doucha", brokerName:"DEAN DOUCHA", brokerPhone:"082 374 5565", brokerEmail:"dean@auctioninc.co.za", brokerPhoto:"assets/brokers/dean-doucha/broker-photo.png" },
  "doron-sacks": { displayName:"Doron Sacks", brokerName:"DORON SACKS", brokerPhone:"082 550 7081", brokerEmail:"doron@auctioninc.co.za", brokerPhoto:"assets/brokers/doron-sacks/broker-photo.png" },
  "elki-medalie": { displayName:"Elki Medalie", brokerName:"ELKI MEDALIE", brokerPhone:"083 764 5370", brokerEmail:"elki@auctioninc.co.za", brokerPhoto:"assets/brokers/elki-medalie/broker-photo.png" },
  "gary-brower": { displayName:"Gary Brower", brokerName:"GARY BROWER", brokerPhone:"082 352 5552", brokerEmail:"garyb@auctioninc.co.za", brokerPhoto:"assets/brokers/gary-brower/broker-photo.png" },
  "george-merricks": { displayName:"George Merricks", brokerName:"GEORGE MERRICKS", brokerPhone:"082 859 9303", brokerEmail:"george@auctioninc.co.za", brokerPhoto:"assets/brokers/george-merricks/broker-photo.png" },
  "gerhard-venter": { displayName:"Gerhard Venter", brokerName:"GERHARD VENTER", brokerPhone:"076 905 5519", brokerEmail:"gerhard@auctioninc.co.za", brokerPhoto:"assets/brokers/gerhard-venter/broker-photo.png" },
  "jenny-pillay": { displayName:"Jenny Pillay", brokerName:"JENNY PILLAY", brokerPhone:"063 959 2260", brokerEmail:"jenny@auctioninc.co.za", brokerPhoto:"assets/brokers/jenny-pillay/broker-photo.png" },
  "jessica-beyers-lahner": { displayName:"Jessica Beyers-Lahner", brokerName:"JESSICA BEYERS-LAHNER", brokerPhone:"072 576 0973", brokerEmail:"jessica@auctioninc.co.za", brokerPhoto:"assets/brokers/jessica-beyers-lahner/broker-photo.png" },
  "jodi-bedil": { displayName:"Jodi Bedil", brokerName:"JODI BEDIL", brokerPhone:"076 637 1273", brokerEmail:"jodib@auctioninc.co.za", brokerPhoto:"assets/brokers/jodi-bedil/broker-photo.png" },
  "jodi-frankel": { displayName:"Jodi Frankel", brokerName:"JODI FRANKEL", brokerPhone:"082 441 8409", brokerEmail:"jodif@auctioninc.co.za", brokerPhoto:"assets/brokers/jodi-frankel/broker-photo.png" },
  "keith-nkosi": { displayName:"Keith Nkosi", brokerName:"KEITH NKOSI", brokerPhone:"081 828 1817", brokerEmail:"keith@auctioninc.co.za", brokerPhoto:"assets/brokers/keith-nkosi/broker-photo.png" },
  "luanda-tlhotlhalemaje": { displayName:"Luanda Tlhotlhalemaje", brokerName:"LUANDA TLHOTLHALEMAJE", brokerPhone:"071 904 4061", brokerEmail:"luanda@skyriseproperties.co.za", brokerPhoto:"assets/brokers/luanda-tlhotlhalemaje/broker-photo.png" },
  "nic-brett": { displayName:"Nic Brett", brokerName:"NIC BRETT", brokerPhone:"078 330 7523", brokerEmail:"nic@auctioninc.co.za", brokerPhoto:"assets/brokers/nic-brett/broker-photo.png" },
  "reece-louw": { displayName:"Reece Louw", brokerName:"REECE LOUW", brokerPhone:"076 393 1131", brokerEmail:"reece@auctioninc.co.za", brokerPhoto:"assets/brokers/reece-louw/broker-photo.png" },
  "reshma-sookran": { displayName:"Reshma Sookran", brokerName:"RESHMA SOOKRAN", brokerPhone:"071 876 6524", brokerEmail:"reshma@auctioninc.co.za", brokerPhoto:"assets/brokers/reshma-sookran/broker-photo.png" },
  "shlomo-hecht": { displayName:"Shlomo Hecht", brokerName:"SHLOMO HECHT", brokerPhone:"073 791 7967", brokerEmail:"shlomo@auctioninc.co.za", brokerPhoto:"assets/brokers/shlomo-hecht/broker-photo.png" },
  "sim-mthembu": { displayName:"Sim Mthembu", brokerName:"SIM MTHEMBU", brokerPhone:"063 829 7431", brokerEmail:"simphiwe@auctioninc.co.za", brokerPhoto:"assets/brokers/sim-mthembu/broker-photo.png" },
  "stuart-holliman": { displayName:"Stuart Holliman", brokerName:"STUART HOLLIMAN", brokerPhone:"067 373 9239", brokerEmail:"stuart@auctioninc.co.za", brokerPhoto:"assets/brokers/stuart-holliman/broker-photo.png" },
  "thabani-ncube": { displayName:"Thabani Ncube", brokerName:"THABANI NCUBE", brokerPhone:"071 624 2899", brokerEmail:"thabani@auctioninc.co.za", brokerPhoto:"assets/brokers/thabani-ncube/broker-photo.png" },
  "yoni-dadon": { displayName:"Yoni Dadon", brokerName:"YONI DADON", brokerPhone:"061 822 6128", brokerEmail:"yoni@auctioninc.co.za", brokerPhoto:"assets/brokers/yoni-dadon/broker-photo.png" }
};

const DEFAULT_BROKER_SLUG = "alex-krause";

/* ============================
   DROPDOWN
   ============================ */

function populateBrokerDropdown() {
  const select = document.getElementById("broker-select");
  if (!select) return;

  const entries = Object.entries(BROKERS);
  entries.sort((a,b)=>a[1].displayName.localeCompare(b[1].displayName));

  select.innerHTML="";
  entries.forEach(([slug,b])=>{
    const opt=document.createElement("option");
    opt.value=slug;
    opt.textContent=b.displayName;
    select.appendChild(opt);
  });

  select.value = DEFAULT_BROKER_SLUG;
}
document.addEventListener("DOMContentLoaded", populateBrokerDropdown);

/* ============================
   FONT RESIZE FIX
   ============================ */

function adjustFontSize(textbox) {
  const span=textbox.querySelector("span");
  if(!span) return;

  let fontSize=200;
  span.style.fontSize=fontSize+"px";

  while(
    (span.scrollWidth>textbox.clientWidth-20 ||
     span.scrollHeight>textbox.clientHeight-20) &&
    fontSize>10
  ){
    fontSize--;
    span.style.fontSize=fontSize+"px";
  }
}

function runFontResize(container) {
  const ids=["textbox_suburb","textbox_title","textboxRT1","textboxRT2","textbox_Feature_1","textbox_Feature_2","textbox_Feature_3"];
  ids.forEach(id=>{
    const el=container.querySelector(`#${id}`);
    if(el) adjustFontSize(el);
  });

  const contact=container.querySelector("#textbox_Contact_Details");
  if(!contact) return;

  const nameSpan=contact.querySelector(".broker-name");
  if(!nameSpan) return;

  nameSpan.style.whiteSpace="nowrap";
  nameSpan.style.display="inline-block";

  const maxWidth=contact.clientWidth-30;

  let fontSize=90;
  nameSpan.style.fontSize=fontSize+"px";

  while(nameSpan.scrollWidth>maxWidth && fontSize>32){
    fontSize--;
    nameSpan.style.fontSize=fontSize+"px";
  }
}
