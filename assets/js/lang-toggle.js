const btnEn = document.getElementById("toggle-en");
const btnEs = document.getElementById("toggle-es");
const textEn = document.getElementById("en-text");
const textEs = document.getElementById("es-text");

const serviceOptions = [
  { en: "Framing",                        es: "Estructuras" },
  { en: "Interior & Exterior Renovation", es: "Remodelación Interior y Exterior" },
  { en: "Roofing",                        es: "Techado" },
  { en: "Other",                          es: "Otro" },
];

function setLang(lang) {
  document.documentElement.setAttribute("data-lang", lang);
  localStorage.setItem("zc-lang", lang);

  if (lang === "es") {
    textEn.style.opacity = "0.5";
    textEn.style.borderBottom = "none";
    textEs.style.opacity = "1";
    textEs.style.borderBottom = "2px solid #e5e2e1";
  } else {
    textEs.style.opacity = "0.5";
    textEs.style.borderBottom = "none";
    textEn.style.opacity = "1";
    textEn.style.borderBottom = "2px solid #e5e2e1";
  }

  const serviceSelect = document.querySelector('select[name="service"]');
  if (serviceSelect) {
    Array.from(serviceSelect.options).forEach((opt, i) => {
      if (serviceOptions[i]) opt.textContent = serviceOptions[i][lang];
    });
  }
}

const savedLang = localStorage.getItem("zc-lang") || "en";
setLang(savedLang);

btnEn.addEventListener("click", () => setLang("en"));
btnEs.addEventListener("click", () => setLang("es"));
