(() => {
  "use strict";

  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;

  const hadController = Boolean(navigator.serviceWorker.controller);
  if (hadController) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      location.reload();
    }, { once: true });
  }

  navigator.serviceWorker.register("./service-worker.js")
    .then(registration => registration.update())
    .then(() => console.info("Penyimpanan offline aplikasi aktif."))
    .catch(error => console.error("Service worker gagal diperbarui.", error));
})();
