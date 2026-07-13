const $ = (id) => document.getElementById(id);
let mode = "natural";

const topbar = document.querySelector(".topbar");
function updateNavigation() {
  topbar.classList.toggle("isVisible", window.scrollY > window.innerHeight * .72);
}
window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();

function updateModel() {
  const climate = $("climate").value;
  const material = $("material").value;
  const airflow = Number($("airflow").value);
  const humidity = Number($("humidity").value);
  const climateBase = climate === "kyiv" ? 1 : climate === "london" ? .77 : .92;
  const fabric = material === "sf20" ? 1 : material === "sf32" ? 1.18 : .86;
  const forced = mode === "forced" ? 1.24 : 1;
  const drying = Math.max(.35, (1.35 - humidity / 100) * (.7 + airflow) * forced / fabric);
  const delay = Math.max(18, Math.round(118 / drying));
  const center = 1.51 * climateBase * drying;
  const ring = 6.56 * climateBase * (.82 + airflow * .24);
  const total = center + ring;
  const centerPct = Math.round(center / total * 100);
  const ringPct = 100 - centerPct;

  $("humidityOut").textContent = humidity + "%";
  $("airflowOut").textContent = airflow.toFixed(1) + " m/s";
  $("delay").textContent = delay;
  $("dryingIndex").textContent = Math.round(drying * 100);
  $("dial").style.setProperty("--value", Math.min(100, drying * 52) + "%");
  $("status").textContent = delay < 80 ? "decisive response" : "soft adaptation";
  $("status").classList.toggle("fast", delay < 80);
  $("centerValue").textContent = center.toFixed(2);
  $("ringValue").textContent = ring.toFixed(2);
  $("totalValue").textContent = total.toFixed(2);
  $("centerPct").textContent = centerPct + "%";
  $("ringPct").textContent = ringPct + "%";
  $("centerBar").style.height = Math.round(center / total * 145) + "px";
  $("ringBar").style.height = Math.round(ring / total * 145) + "px";
  $("readout").innerHTML = `${humidity}% RH and ${airflow.toFixed(1)} m/s airflow produce a <b>${delay < 80 ? "short, decisive" : "longer, adaptive"}</b> drying window with ${material.toUpperCase()}.`;
}

document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
  mode = button.dataset.mode;
  document.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("on", item === button));
  updateModel();
}));
["climate", "material", "airflow", "humidity"].forEach((id) => $(id).addEventListener("input", updateModel));
updateModel();
