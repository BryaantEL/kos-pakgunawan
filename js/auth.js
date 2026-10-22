(() => {
  "use strict";

  const OWNER_EMAIL = "kost.pakgunawan@gmail.com";
  const STORAGE_KEY = "kos-pak-gunawan.v1";
  const authScreen = document.getElementById("auth-screen");
  const appRoot = document.getElementById("app-root");
  const loginForm = document.getElementById("login-form");
  const loginButton = loginForm.querySelector('button[type="submit"]');
  const message = document.getElementById("auth-message");
  const syncStatus = document.getElementById("sync-status");
  const syncIndicator = document.getElementById("sync-indicator");
  let supabaseClient;
  let ownerId;
  let saveQueue = Promise.resolve();
  let lastSnapshot = "";
  let appStarted = false;

  function setMessage(text, isError = false) {
    message.textContent = text;
    message.dataset.error = String(isError);
  }

  function setSyncStatus(title, detail, isError = false) {
    syncStatus.replaceChildren();
    const icon = document.createElement("span");
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"/><path d="m9 12 2 2 4-4"/></svg>';
    const heading = document.createElement("strong");
    heading.textContent = title;
    syncStatus.append(icon, heading, document.createTextNode(detail));
    syncStatus.dataset.error = String(isError);
    syncIndicator.dataset.state = isError ? "error" : title === "Menyimpan…" ? "pending" : "ready";
    syncIndicator.setAttribute("aria-label", `Status sinkronisasi: ${title}. ${detail}`);
    syncIndicator.title = `Status sinkronisasi: ${title}`;
  }

  function showLogin() {
    appRoot.hidden = true;
    authScreen.hidden = false;
  }

  async function loadApp() {
    if (!appStarted) {
      appStarted = true;
      const script = document.createElement("script");
      script.src = "js/app.js";
      script.onerror = () => {
        appStarted = false;
        setMessage("Aplikasi gagal dimuat. Muat ulang halaman dan coba lagi.", true);
        showLogin();
      };
      document.body.append(script);
    }
    authScreen.hidden = true;
    appRoot.hidden = false;
  }

  async function loadOwnerData(user) {
    ownerId = user.id;
    const { data: row, error } = await supabaseClient
      .from("owner_data")
      .select("payload")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (row) {
      const snapshot = JSON.stringify(row.payload);
      localStorage.setItem(STORAGE_KEY, snapshot);
      lastSnapshot = snapshot;
    } else {
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        await saveData(parsed, true);
      }
    }

    setSyncStatus("Sinkronisasi aktif", "Perubahan disimpan ke akun pemilik.");
    await loadApp();
  }

  async function saveData(data, force = false) {
    if (!ownerId) return;
    const snapshot = JSON.stringify(data);
    if (!force && snapshot === lastSnapshot) return;
    lastSnapshot = snapshot;
    setSyncStatus("Menyimpan…", "Mengirim perubahan ke Supabase.");
    saveQueue = saveQueue.then(async () => {
      const { error } = await supabaseClient.from("owner_data").upsert({
        owner_id: ownerId,
        payload: JSON.parse(snapshot),
        updated_at: new Date().toISOString()
      }, { onConflict: "owner_id" });
      if (error) throw error;
      setSyncStatus("Tersinkron", "Data terbaru sudah tersimpan di Supabase.");
    }).catch(error => {
      console.error("Sinkronisasi data ke Supabase gagal.", error);
      setSyncStatus("Belum tersinkron", "Periksa koneksi internet, perubahan masih ada di perangkat ini.", true);
      lastSnapshot = "";
    });
    return saveQueue;
  }

  window.KosCloud = {
    save(data) {
      void saveData(data);
    }
  };

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabaseClient) {
      setMessage("Supabase belum dikonfigurasi. Ikuti langkah setup pada panduan proyek.", true);
      return;
    }
    const formData = new FormData(loginForm);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    if (email !== OWNER_EMAIL) {
      setMessage("Login hanya tersedia untuk email pemilik yang telah ditetapkan.", true);
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Memeriksa…";
    setMessage("");
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user.email?.toLowerCase() !== OWNER_EMAIL) {
        await supabaseClient.auth.signOut();
        throw new Error("Akun ini bukan akun pemilik yang diizinkan.");
      }
      await loadOwnerData(data.user);
    } catch (error) {
      console.error("Login atau pemuatan data gagal.", error);
      setMessage(error.message === "Invalid login credentials"
        ? "Email atau kata sandi tidak sesuai."
        : `Tidak dapat masuk: ${error.message}`, true);
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Masuk";
    }
  });

  document.getElementById("logout-button").addEventListener("click", async () => {
    await saveQueue;
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Logout gagal.", error);
      setSyncStatus("Gagal keluar", error.message, true);
      return;
    }
    ownerId = null;
    window.location.reload();
  });

  window.addEventListener("online", () => {
    if (!ownerId) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) void saveData(JSON.parse(raw), true);
    } catch (error) {
      console.error("Data lokal tidak dapat dibaca untuk sinkronisasi ulang.", error);
      setSyncStatus("Belum tersinkron", "Data lokal tidak dapat dibaca.", true);
    }
  });

  async function initialize() {
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("./service-worker.js")
        .then(() => console.info("Penyimpanan offline aplikasi aktif."))
        .catch(error => console.error("Service worker gagal didaftarkan.", error));
    }
    const config = window.KOS_SUPABASE_CONFIG;
    if (!window.supabase?.createClient) {
      setMessage("Layanan login tidak dapat dimuat. Periksa koneksi internet.", true);
      return;
    }
    if (!config?.url || !config?.publishableKey) {
      setMessage("Supabase belum dikonfigurasi. Isi URL dan publishable key sesuai panduan proyek.", true);
      return;
    }
    supabaseClient = window.supabase.createClient(config.url, config.publishableKey);
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Sesi Supabase gagal diperiksa.", error);
      setMessage("Sesi login tidak dapat diperiksa. Muat ulang halaman.", true);
      return;
    }
    if (data.session?.user.email?.toLowerCase() === OWNER_EMAIL) {
      try {
        await loadOwnerData(data.session.user);
      } catch (loadError) {
        console.error("Data akun pemilik gagal dimuat.", loadError);
        setMessage(`Data akun gagal dimuat: ${loadError.message}`, true);
        await supabaseClient.auth.signOut();
      }
    } else if (data.session) {
      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) {
        console.error("Sesi akun yang tidak diizinkan gagal diakhiri.", signOutError);
        setMessage("Sesi akun lain tidak dapat diakhiri. Muat ulang halaman.", true);
      }
    }

    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        ownerId = null;
        showLogin();
      }
    });
  }

  void initialize();
})();
