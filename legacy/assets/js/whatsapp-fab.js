const waFab = document.getElementById("whatsapp-fab");
const waToggle = document.getElementById("whatsapp-toggle");
const waOptions = document.getElementById("whatsapp-options");

let waOpen = false;

function openWaMenu() {
  waOpen = true;
  waOptions.style.opacity = "1";
  waOptions.style.transform = "translateY(0)";
  waOptions.style.pointerEvents = "auto";
}

function closeWaMenu() {
  waOpen = false;
  waOptions.style.opacity = "0";
  waOptions.style.transform = "translateY(16px)";
  waOptions.style.pointerEvents = "none";
}

waToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  waOpen ? closeWaMenu() : openWaMenu();
});

document.addEventListener("click", (e) => {
  if (!waFab.contains(e.target) && waOpen) {
    closeWaMenu();
  }
});
