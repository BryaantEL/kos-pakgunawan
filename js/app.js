(() => {
      "use strict";
      const STORAGE_KEY = "kos-pak-gunawan.v1";
      const THEME_KEY = "kos-pak-gunawan.theme";
      const DEFAULT_ROOM_RENT = 400000;
      const MAP_ADDRESS = "QCPG+733, Kutan, Randugunting, Bergas, Semarang Regency, Central Java 50552";
      const pageNames = { dashboard: "Dashboard", rooms: "Data Kamar", tenants: "Penyewa", bills: "Tagihan", payments: "Pembayaran", expenses: "Pengeluaran", reports: "Laporan Keuangan", settings: "Pengaturan" };
      const navItems = [
        ["dashboard", "grid", "Dashboard"], ["rooms", "door", "Kamar"], ["tenants", "users", "Penyewa"],
        ["bills", "receipt", "Tagihan"], ["payments", "money", "Pembayaran"], ["expenses", "wallet", "Pengeluaran"],
        ["reports", "chart", "Laporan"], ["settings", "file", "Pengaturan"]
      ];
      const preferredTheme = (() => {
        try {
          const saved = localStorage.getItem(THEME_KEY);
          if (saved === "light" || saved === "dark") return saved;
        } catch (error) {
          console.error("Preferensi tema tidak dapat dibaca.", error);
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      })();
      let currentTheme = preferredTheme;
      document.documentElement.dataset.theme = currentTheme;
      const icons = {
        home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z"/></svg>',
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"/><path d="m9 12 2 2 4-4"/></svg>',
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg>',
        door: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h16M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M14 12h.01"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l4-2 4 2 4-2 4 2V2l-4 2-4-2-4 2z"/><path d="M8 9h8M8 13h6"/></svg>',
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
        wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 15h.01"/><path d="M7 5V3h12v2"/></svg>',
        chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/></svg>',
        map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></svg>',
        more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
        plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
        arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>',
        bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v13M21 7v13M3 15h18M5 11h14a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2Z"/><path d="M5 11V8a1 1 0 0 1 1-1h4a2 2 0 0 1 2 2v2"/></svg>',
        money: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20m5-15H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
        close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg>',
        trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6"/></svg>',
        download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/></svg>',
        install: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 7v7m-3-3 3 3 3-3m-5 6h4"/></svg>',
        moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>',
        sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>',
        file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg>'
      };
      const todayISO = () => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      };
      const monthNow = () => todayISO().slice(0, 7);
      const newId = () => window.crypto && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const propertyInfo = {
        name: "Kos Pak Gunawan",
        address: MAP_ADDRESS,
        type: "Kos putri",
        floors: 2,
        facilities: [
          "Parkir motor", "Wi-Fi gratis", "Kamar mandi bersama di luar kamar",
          "Kasur, lemari, dan jendela di setiap kamar", "Tidak menggunakan AC"
        ],
        bathrooms: { 1: 7, 2: 1 },
        electricity: "Listrik dasar termasuk harga sewa. Biaya tambahan barang elektronik ditentukan pemilik per penyewa.",
        water: "Air sumur sendiri; tidak ada biaya air."
      };
      const defaultCategories = ["Jasa angkut sampah", "Wi-Fi", "Galon", "Listrik area umum", "Perawatan fasilitas", "Lainnya"];
      const emptyData = () => ({
        rooms: [], tenants: [], bills: [], payments: [], expenses: [], adjustments: [], auditLog: [],
        categories: defaultCategories.map(name => ({ id: newId(), name, active: true })),
        settings: { ownerWhatsApp: "", mapLocation: null },
        property: propertyInfo
      });
      const collections = ["rooms", "tenants", "bills", "payments", "expenses", "adjustments", "auditLog"];
      const seedRooms = () => Array.from({ length: 21 }, (_, index) => ({
        id: newId(),
        name: `Kamar ${String(index + 1).padStart(2, "0")}`,
        floor: index < 15 ? 1 : 2,
        rent: DEFAULT_ROOM_RENT,
        notes: "",
        availabilityConfirmed: false
      }));
      let data;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        data = raw ? { ...emptyData(), ...JSON.parse(raw) } : emptyData();
        for (const key of collections) if (!Array.isArray(data[key])) data[key] = [];
        if (!data.property || typeof data.property !== "object") data.property = propertyInfo;
        data.property = { ...propertyInfo, ...data.property };
        data.property.address = MAP_ADDRESS;
        if (!Array.isArray(data.payments)) data.payments = [];
        if (!Array.isArray(data.adjustments)) data.adjustments = [];
        if (!Array.isArray(data.auditLog)) data.auditLog = [];
        if (!Array.isArray(data.categories)) data.categories = defaultCategories.map(name => ({ id: newId(), name, active: true }));
        if (!data.settings || typeof data.settings !== "object") data.settings = { ownerWhatsApp: "", mapLocation: null };
        data.settings = { ownerWhatsApp: "", mapLocation: null, ...data.settings };
        if (!data.defaultRoomRentApplied) {
          data.rooms = data.rooms.map(item => ({ ...item, rent: DEFAULT_ROOM_RENT }));
          data.defaultRoomRentApplied = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        if (!data.initialSetupComplete) {
          if (!raw || collections.every(key => data[key].length === 0)) data.rooms = seedRooms();
          data.initialSetupComplete = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        if (raw) {
          data.rooms = data.rooms.map(item => {
            const configuredFloor = Number(item.floor);
            const roomNumber = Number((item.name || "").match(/\d+/)?.[0]);
            return { ...item, floor: configuredFloor === 1 || configuredFloor === 2 ? configuredFloor : roomNumber > 15 ? 2 : 1, availabilityConfirmed: item.availabilityConfirmed === true };
          });
          data.tenants = data.tenants.map(item => ({ ...item, electronics: Array.isArray(item.electronics) ? item.electronics : [] }));
          data.tenants = data.tenants.map(item => ({
            ...item,
            leaseId: item.leaseId || item.id,
            isPrimary: item.isPrimary !== false,
            peopleCount: Math.max(1, Math.min(2, Number(item.peopleCount) || 1)),
            endDate: item.endDate || null
          }));
        }
        if (!data.paymentsMigrated) {
          data.payments.push(...data.bills.filter(item => item.status === "paid" && item.paidAt && !data.payments.some(payment => payment.billId === item.id)).map(item => ({
            id: newId(), billId: item.id, tenantId: item.tenantId, date: item.paidAt,
            method: "tunai", amount: Number(item.amount), appliedAmount: Number(item.amount),
            excessAmount: 0, disposition: null, note: "Riwayat pembayaran sebelum pencatatan transaksi."
          })));
          data.paymentsMigrated = true;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.error("Data kos tidak dapat dibaca dari penyimpanan lokal.", error);
        data = emptyData();
        setTimeout(() => toast("Penyimpanan lokal bermasalah. Data baru belum bisa disimpan."), 0);
      }
      let currentPage = "dashboard";
      let query = "";
      let selectedMonth = monthNow();
      let dashboardFloor = "all";
      let dashboardRoomStatus = "all";
      let toastTimer;
      let pageTransition;
      let installPrompt = window.kosInstallPrompt || null;
      const content = document.getElementById("content");
      const overlay = document.getElementById("overlay");
      const money = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0);
      const formatDate = value => value ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "—";
      const monthLabel = value => {
        const [year, month] = value.split("-").map(Number);
        return new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
      };
      const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
      const persist = () => {
        try {
          const snapshot = JSON.stringify(data);
          localStorage.setItem(STORAGE_KEY, snapshot);
          if (window.KosCloud) window.KosCloud.save(data);
          return true;
        }
        catch (error) { console.error("Data kos gagal disimpan.", error); toast("Gagal menyimpan data. Periksa kapasitas penyimpanan browser.", "error"); return false; }
      };
      const icon = name => icons[name] || "";
      const room = id => data.rooms.find(item => item.id === id);
      const tenant = id => data.tenants.find(item => item.id === id);
      const activeTenants = () => data.tenants.filter(item => item.status === "active");
      const roomOccupants = roomId => activeTenants().filter(item => item.roomId === roomId);
      const roomTenant = roomId => roomOccupants(roomId).find(item => item.isPrimary) || roomOccupants(roomId)[0];
      const roomStatus = item => roomTenant(item.id) ? "occupied" : item.availabilityConfirmed ? "available" : "unknown";
      const electronicCharges = person => (person?.electronics || []).reduce((sum, item) => sum + (Number(item.monthlyFee) || 0), 0);
      const configuredRent = item => Number.isSafeInteger(Number(item?.rent)) && Number(item.rent) > 0;
      const tenantBillTotal = (person, assignedRoom) => Number(assignedRoom?.rent || 0) + electronicCharges(person);
      const billPayments = billId => data.payments.filter(item => item.billId === billId);
      const billPaidAmount = bill => billPayments(bill.id).reduce((sum, item) => sum + Number(item.appliedAmount ?? item.amount), 0);
      const billAdjustments = billId => data.adjustments.filter(item => item.billId === billId).reduce((sum, item) => sum + Number(item.amount), 0);
      const billBalance = bill => Math.max(0, Number(bill.amount) - billPaidAmount(bill) - billAdjustments(bill.id));
      const depositRemaining = payment => Math.max(0, Number(payment.excessAmount || 0) - data.payments.filter(item => item.sourceDepositId === payment.id).reduce((sum, item) => sum + Number(item.amount), 0));
      const statusText = value => ({
        paid: "Lunas", adjusted: "Disesuaikan", due: "Belum jatuh tempo", today: "Jatuh tempo hari ini", partial: "Dibayar sebagian",
        overdue: "Terlambat", active: "Aktif", ended: "Selesai", occupied: "Terisi", available: "Kosong", unknown: "Belum dicatat"
      }[value] || value);
      const badge = value => `<span class="status status-${esc(value)}">${statusText(value)}</span>`;
      const billStatus = bill => {
        const balance = billBalance(bill);
        if (balance <= 0) return billPaidAmount(bill) >= Number(bill.amount) ? "paid" : "adjusted";
        const dueDate = bill.dueDate || `${bill.month}-01`;
        if (dueDate < todayISO()) return "overdue";
        if (dueDate === todayISO()) return "today";
        if (billPaidAmount(bill) > 0) return "partial";
        return "due";
      };
      const monthBills = month => data.bills.filter(item => item.month === month);
      const monthIncome = month => data.payments.filter(item => item.date?.slice(0, 7) === month).reduce((sum, item) =>
        sum + Number(item.appliedAmount ?? item.amount) + (item.disposition === "revenue" ? Number(item.excessAmount || 0) : 0) - Number(item.refundedAmount || 0), 0);
      const monthExpenses = month => data.expenses.filter(item => item.date && item.date.slice(0, 7) === month).reduce((sum, item) => sum + Number(item.amount), 0);
      const monthReceivables = month => data.bills.filter(item => item.month === month).reduce((sum, item) => sum + billBalance(item), 0);
      const lastDayOfMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();
      const daysChargedInMonth = (startDate, month) => {
        const [year, monthNumber] = month.split("-").map(Number);
        const totalDays = lastDayOfMonth(year, monthNumber - 1);
        return startDate.slice(0, 7) === month ? totalDays - Number(startDate.slice(8, 10)) + 1 : totalDays;
      };
      const dueDateForMonth = (startDate, month) => {
        const originalDay = Number(startDate.slice(8, 10));
        const [year, monthNumber] = month.split("-").map(Number);
        const isMoveInMonth = startDate.slice(0, 7) === month;
        const dueMonth = monthNumber - 1 + (isMoveInMonth ? 1 : 0);
        const dueYear = year + Math.floor(dueMonth / 12);
        const normalizedMonth = ((dueMonth % 12) + 12) % 12;
        const day = Math.min(originalDay, lastDayOfMonth(dueYear, normalizedMonth));
        return `${dueYear}-${String(normalizedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      };
      const leaseMembers = leaseId => activeTenants().filter(item => item.leaseId === leaseId);
      const activeLeases = () => {
        const seen = new Set();
        return activeTenants().filter(person => {
          if (seen.has(person.leaseId)) return false;
          seen.add(person.leaseId);
          return true;
        }).map(person => ({ person: leaseMembers(person.leaseId).find(item => item.isPrimary) || person, members: leaseMembers(person.leaseId) }));
      };
      if (!data.billDueDatesMigrated) {
        data.bills = data.bills.map(bill => {
          const startDate = bill.startDate || tenant(bill.tenantId)?.startDate;
          return /^\d{4}-\d{2}-\d{2}$/.test(startDate || "") && /^\d{4}-\d{2}$/.test(bill.month || "")
            ? { ...bill, startDate, dueDate: dueDateForMonth(startDate, bill.month) }
            : bill;
        });
        data.billDueDatesMigrated = true;
        persist();
      }
      const whatsappNumber = value => String(value || "").replace(/\D/g, "").replace(/^0/, "62");
      const audit = (entity, id, action, reason, before, after) => {
        data.auditLog.push({ id: newId(), entity, entityId: id, action, reason: reason || "", before, after, date: todayISO(), createdAt: new Date().toISOString() });
      };
      const head = (eyebrow, title, subtitle, action = "") => `<div class="welcome"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
      const pageAction = (label, action, iconName = "plus") => `<button class="button button-primary" data-action="${action}">${icon(iconName)}${label}</button>`;
      const emptyState = (title, description, button = "") => `<div class="empty"><div class="empty-icon">${icon("file")}</div><strong>${title}</strong><p>${description}</p>${button ? `<div style="margin-top:14px">${button}</div>` : ""}</div>`;
      const monthInput = (value, id = "month-picker") => `<input class="select-small" type="month" id="${id}" value="${esc(value)}" aria-label="Pilih bulan">`;
      function toast(message, type = "success") {
        const previous = document.querySelector(".toast");
        if (previous) previous.remove();
        const node = document.createElement("div");
        node.className = `toast toast-${type}`;
        node.setAttribute("role", type === "error" ? "alert" : "status");
        node.textContent = message;
        document.body.appendChild(node);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => node.remove(), 3000);
      }
      function updateThemeButton() {
        const button = document.querySelector("[data-action='toggle-theme']");
        if (!button) return;
        const darkMode = currentTheme === "dark";
        button.innerHTML = icon(darkMode ? "sun" : "moon");
        button.setAttribute("aria-label", darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap");
        button.setAttribute("aria-pressed", String(darkMode));
        button.title = darkMode ? "Beralih ke mode terang" : "Beralih ke mode gelap";
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", darkMode ? "#121815" : "#f6f8f7");
      }
      function toggleTheme() {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        currentTheme = nextTheme;
        updateThemeButton();
        try {
          localStorage.setItem(THEME_KEY, currentTheme);
          toast(currentTheme === "dark" ? "Mode gelap diaktifkan." : "Mode terang diaktifkan.");
        } catch (error) {
          console.error("Preferensi tema gagal disimpan.", error);
          toast("Tema berubah, tetapi preferensinya tidak bisa disimpan.", "error");
        }
      }
      function setPage(page) {
        overlay.innerHTML = "";
        currentPage = page;
        query = "";
        render(true);
      }
      function renderNav() {
        const overflowActive = ["expenses", "reports", "settings"].includes(currentPage);
        document.getElementById("navigation").innerHTML = `${navItems.map(([id, iconName, label]) => `<button class="nav-item ${currentPage === id ? "active" : ""}" data-page="${id}">${icon(iconName)}<span>${label}</span></button>`).join("")}<button class="nav-item nav-more ${overflowActive ? "active" : ""}" data-action="more-pages">${icon("more")}<span>Lainnya</span></button>`;
        document.getElementById("crumb").textContent = pageNames[currentPage];
        const alerts = data.bills.filter(item => ["overdue", "today"].includes(billStatus(item))).length;
        const button = document.querySelector("[data-action='show-notifications']");
        if (button) {
          button.innerHTML = `${icon("bell")}${alerts ? `<span class="notification-count">${alerts}</span>` : ""}`;
          button.setAttribute("aria-label", alerts ? `${alerts} notifikasi tagihan` : "Tidak ada notifikasi tagihan");
        }
      }
      function render(transition = false) {
        renderNav();
        updateThemeButton();
        document.getElementById("today").textContent = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
        const views = { dashboard: renderDashboard, rooms: renderRooms, tenants: renderTenants, bills: renderBills, payments: renderPayments, expenses: renderExpenses, reports: renderReports, settings: renderSettings };
        content.innerHTML = views[currentPage]();
        if (transition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          pageTransition?.cancel();
          content.setAttribute("aria-busy", "true");
          pageTransition = content.animate([{ opacity: .75, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 170, easing: "ease-out" });
          pageTransition.onfinish = () => {
            if (content.getAttribute("aria-busy") === "true") content.removeAttribute("aria-busy");
          };
        }
      }
      function metric(label, value, hint, iconName, tone = "") {
        return `<div class="metric"><div class="metric-top"><span>${label}</span><span class="metric-icon ${tone}">${icon(iconName)}</span></div><div class="metric-value">${value}</div><div class="metric-hint">${hint}</div></div>`;
      }
      function roomCardMarkup(item) {
        const occupants = roomOccupants(item.id);
        const primary = occupants.find(person => person.isPrimary) || occupants[0];
        const currentBill = primary && [...data.bills].reverse().find(bill => bill.tenantId === primary.id && billBalance(bill) > 0);
        const currentStatus = currentBill ? billStatus(currentBill) : roomStatus(item);
        return `<article class="room-card" data-status="${roomStatus(item)}" data-room-id="${esc(item.id)}">
          <button class="room-card-open" type="button" data-action="room-detail" data-id="${esc(item.id)}" aria-label="Lihat detail ${esc(item.name)}">
            <span class="room-card-head"><span><span class="room-number">${esc(item.name)}</span><span class="room-floor-label">Lantai ${item.floor || 1}</span></span>${badge(roomStatus(item))}</span>
            <span class="room-card-rent">${configuredRent(item) ? money(item.rent) : `<span class="unconfigured">Tarif belum diatur</span>`}<span>/ bulan</span></span>
            <span class="room-card-occupant"><span>Penghuni · ${occupants.length} / 2</span><strong>${occupants.length ? occupants.map(person => esc(person.name)).join(", ") : "Belum dicatat"}</strong></span>
            ${primary ? `<span class="room-card-occupant"><span>Kontak tagihan · masuk ${formatDate(primary.startDate)}</span><strong>${money(occupants.reduce((sum, person) => sum + electronicCharges(person), 0))} biaya elektronik / bulan</strong></span>` : ""}
            ${currentBill ? `<span class="room-card-bill">${badge(currentStatus)}<strong>Sisa ${money(billBalance(currentBill))}</strong></span>` : ""}
          </button>
          <div class="room-card-actions">${occupants.length >= 2 ? `<button class="button button-quiet button-small" type="button" disabled>Kamar penuh</button>` : roomStatus(item) === "unknown" ? `<button class="button button-quiet button-small" data-action="confirm-room-vacant" data-id="${esc(item.id)}">Konfirmasi kosong</button>` : `<button class="button button-quiet button-small" data-action="add-tenant-to-room" data-id="${esc(item.id)}">${icon("plus")}Tambah penyewa</button>`}<button class="icon-button" title="Edit data kamar" aria-label="Edit data kamar" data-action="edit-room" data-id="${esc(item.id)}">${icon("file")}</button></div>
        </article>`;
      }
      function renderDashboard() {
        const rooms = data.rooms.length, occupied = data.rooms.filter(item => roomStatus(item) === "occupied").length;
        const dueAlerts = data.bills.filter(item => ["overdue", "today"].includes(billStatus(item)));
        const expenses = data.expenses.filter(item => item.date.slice(0, 7) === selectedMonth);
        const latest = [...data.bills].sort((a, b) => (b.dueDate || b.month || "").localeCompare(a.dueDate || a.month || "")).slice(0, 5);
        const hasOverdue = item => data.bills.some(bill => (bill.roomId || tenant(bill.tenantId)?.roomId) === item.id && billStatus(bill) === "overdue");
        const visibleRooms = data.rooms.filter(item =>
          (dashboardFloor === "all" || String(item.floor) === dashboardFloor) &&
          (dashboardRoomStatus === "all" || (dashboardRoomStatus === "overdue" ? hasOverdue(item) : roomStatus(item) === dashboardRoomStatus)) &&
          `${item.name} ${roomOccupants(item.id).map(person => person.name).join(" ")}`.toLowerCase().includes(query.toLowerCase())
        );
        const roomSections = [1, 2].map(floor => {
          const floorRooms = visibleRooms.filter(item => item.floor === floor);
          return floorRooms.length ? `<section class="floor-section"><div class="floor-heading"><div><h2>Lantai ${floor}</h2><span>${floorRooms.length} kamar · ${data.property.bathrooms[floor]} kamar mandi bersama</span></div></div><div class="rooms-grid">${floorRooms.map(roomCardMarkup).join("")}</div></section>` : "";
        }).join("");
        return `${head("DASHBOARD PEMILIK", "Selamat datang, Pak Gunawan", `Ringkasan operasional dan keuangan kos Anda untuk ${monthLabel(selectedMonth)}.`, pageAction("Catat pengeluaran", "add-expense", "plus"))}
          <section class="panel map-panel"><div class="panel-head"><div><div class="panel-title">Lokasi kos</div><div class="panel-subtitle">${esc(data.property.address)}</div></div><a class="button button-quiet button-small" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_ADDRESS)}" target="_blank" rel="noopener noreferrer">Buka Google Maps ${icon("arrow")}</a></div>
            <div class="property-map"><iframe title="Peta lokasi Kos Pak Gunawan" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(MAP_ADDRESS)}&output=embed"></iframe></div>
          </section>
          <div class="metrics">
            ${metric("Pemasukan diterima", money(monthIncome(selectedMonth)), monthLabel(selectedMonth), "money")}
            ${metric("Sisa tagihan", money(data.bills.reduce((sum, item) => sum + billBalance(item), 0)), `${data.bills.filter(item => billBalance(item) > 0).length} tagihan belum lunas`, "clock", "gold")}
            ${metric("Kamar terisi", `${occupied}<span style="font-size:14px;color:var(--text-subtle);font-weight:500"> / ${rooms}</span>`, activeTenants().length ? `${Math.round(occupied / Math.max(rooms, 1) * 100)}% hunian tercatat` : "Belum ada penyewa dicatat", "bed")}
            ${metric("Pengeluaran operasional", money(expenses.reduce((sum, item) => sum + Number(item.amount), 0)), `${expenses.length} transaksi bulan ini`, "wallet", "red")}
            ${metric("Total penghuni", String(activeTenants().length), "Tidak ada penghuni yang diisi otomatis", "users")}
            ${metric("Jatuh tempo hari ini", String(data.bills.filter(item => billStatus(item) === "today").length), "Tanpa denda keterlambatan", "clock", "gold")}
            ${metric("Tagihan terlambat", String(data.bills.filter(item => billStatus(item) === "overdue").length), "Berdasarkan tanggal jatuh tempo", "receipt", "red")}
            ${metric("Arus kas bersih", money(monthIncome(selectedMonth) - expenses.reduce((sum, item) => sum + Number(item.amount), 0)), monthLabel(selectedMonth), "chart")}
          </div>
          <section class="panel property-panel"><div class="panel-head"><div><div class="panel-title">${esc(data.property.name)} · ${esc(data.property.type)}</div><div class="panel-subtitle">${esc(data.property.address)}</div></div><span class="property-floor-count">${data.property.floors} lantai · ${rooms} kamar</span></div>
            <div class="property-details"><div><strong>Pembagian kamar</strong><span>Lantai 1: kamar 01–15 · ${data.property.bathrooms[1]} kamar mandi bersama</span><span>Lantai 2: kamar 16–21 · ${data.property.bathrooms[2]} kamar mandi bersama</span></div>
              <div><strong>Fasilitas</strong><span>${data.property.facilities.map(esc).join(" · ")}</span><span>${esc(data.property.electricity)} ${esc(data.property.water)}</span></div></div>
          </section>
          <section class="dashboard-rooms"><div class="dashboard-rooms-head"><div><div class="panel-title">Daftar kamar</div><div class="panel-subtitle">Pilih kamar untuk melihat detail penghuni dan tagihan</div></div><div class="dashboard-room-filters"><select class="select-small" id="room-floor-filter" aria-label="Filter lantai"><option value="all" ${dashboardFloor === "all" ? "selected" : ""}>Semua lantai</option><option value="1" ${dashboardFloor === "1" ? "selected" : ""}>Lantai 1</option><option value="2" ${dashboardFloor === "2" ? "selected" : ""}>Lantai 2</option></select><select class="select-small" id="room-status-filter" aria-label="Filter status kamar"><option value="all" ${dashboardRoomStatus === "all" ? "selected" : ""}>Semua status</option><option value="unknown" ${dashboardRoomStatus === "unknown" ? "selected" : ""}>Belum dicatat</option><option value="available" ${dashboardRoomStatus === "available" ? "selected" : ""}>Kosong</option><option value="occupied" ${dashboardRoomStatus === "occupied" ? "selected" : ""}>Terisi</option><option value="overdue" ${dashboardRoomStatus === "overdue" ? "selected" : ""}>Tunggakan</option></select>${filterBox("Cari kamar atau penyewa...")}</div></div>
            ${visibleRooms.length ? roomSections : emptyState("Kamar tidak ditemukan", "Sesuaikan filter atau kata kunci pencarian.")}</section>
          <div class="grid-main">
            <section class="panel"><div class="panel-head"><div><div class="panel-title">Tagihan yang perlu perhatian</div><div class="panel-subtitle">Pengingat jatuh tempo manual, tanpa denda</div></div><button class="text-link" data-page="bills">Semua tagihan →</button></div>
              ${dueAlerts.length ? `<div class="attention-list">${dueAlerts.map(item => `<div class="attention-row"><div><strong>${esc(item.tenantName || tenant(item.tenantId)?.name || "Penyewa")}</strong><span>${esc(item.roomName || room(tenant(item.tenantId)?.roomId)?.name || "—")} · jatuh tempo ${formatDate(item.dueDate)}</span></div><div>${badge(billStatus(item))}<strong>${money(billBalance(item))}</strong></div><button class="button button-quiet button-small" data-action="record-payment" data-id="${item.id}">Catat bayar</button>${whatsappButton(item)}</div>`).join("")}</div>` : emptyState("Tidak ada pengingat jatuh tempo", "Pengingat akan muncul setelah tagihan diterbitkan.")}</section>
            <section class="panel"><div class="panel-head"><div><div class="panel-title">Tagihan terbaru</div><div class="panel-subtitle">${monthLabel(selectedMonth)}</div></div>${monthInput(selectedMonth)}</div>
              ${latest.length ? `<div class="compact-bill-list">${latest.map(item => `<div><span><strong>${esc(item.tenantName || tenant(item.tenantId)?.name || "Penyewa")}</strong><small>${esc(item.roomName || "—")} · ${monthLabel(item.month)}</small></span><span>${money(billBalance(item))}${badge(billStatus(item))}</span></div>`).join("")}</div>` : emptyState("Belum ada tagihan", "Tambahkan tarif kamar dan penyewa sebelum menerbitkan tagihan.")}</section>
          </div>
          <div class="grid-main dashboard-lower">
            <section class="panel"><div class="panel-head"><div><div class="panel-title">Akses cepat</div><div class="panel-subtitle">Catat dan kelola aktivitas kos</div></div></div><div class="panel-body"><div class="quick-list">
              <button class="quick-action" data-action="add-tenant"><span class="quick-icon">${icon("users")}</span><span class="quick-copy"><strong>Tambah penyewa</strong><span>Daftarkan penghuni baru</span></span></button>
              <button class="quick-action" data-action="generate-bills"><span class="quick-icon">${icon("receipt")}</span><span class="quick-copy"><strong>Buat tagihan bulanan</strong><span>${monthLabel(selectedMonth)}</span></span></button>
              <button class="quick-action" data-action="add-expense"><span class="quick-icon">${icon("wallet")}</span><span class="quick-copy"><strong>Catat pengeluaran</strong><span>Rekam biaya operasional</span></span></button>
            </div></div></section>
            <section class="panel"><div class="panel-head"><div><div class="panel-title">Pembayaran & data</div><div class="panel-subtitle">Transaksi diverifikasi langsung oleh pemilik</div></div></div><div class="panel-body"><button class="button button-quiet button-small" data-page="payments">Buka riwayat pembayaran ${icon("arrow")}</button><p class="field-hint" style="margin-top:12px">Sebelum Supabase disiapkan, data tersimpan lokal pada browser ini. Ekspor cadangan secara berkala.</p></div></section>
          </div>`;
      }
      function filterBox(placeholder) {
        return `<input class="search" type="search" id="search-input" placeholder="${placeholder}" value="${esc(query)}" aria-label="${placeholder}">`;
      }
      function renderRooms() {
        const list = data.rooms.filter(item => `${item.name} ${item.notes || ""}`.toLowerCase().includes(query.toLowerCase()));
        const cardsById = new Map(list.map(item => [item.id, roomCardMarkup(item)]));
        const floorCards = floor => {
          const floorRooms = list.filter(item => (item.floor || 1) === floor);
          if (!floorRooms.length) return "";
          return `<section class="floor-section"><div class="floor-heading"><div><h2>Lantai ${floor}</h2><span>${floorRooms.length} kamar · ${data.property.bathrooms[floor]} kamar mandi bersama</span></div><span class="floor-range">${floor === 1 ? "01–15" : "16–21"}</span></div><div class="rooms-grid">${floorRooms.map(item => cardsById.get(item.id)).join("")}</div></section>`;
        };
        const emptyRooms = query ? emptyState("Kamar tidak ditemukan", "Coba kata kunci pencarian yang lain.") : "";
        return `${head("INVENTARIS PROPERTI", "Kamar", "Kelola 21 kamar di dua lantai. Tarif awal Rp400.000 per kamar/bulan dan dapat disesuaikan.", pageAction("Tambah kamar", "add-room"))}
          <div class="page-toolbar"><span class="toolbar-note">${data.rooms.length} kamar · tarif awal ${money(DEFAULT_ROOM_RENT)} per kamar/bulan</span><div class="filter-group">${filterBox("Cari kamar...")}</div></div>
          ${list.length ? `${floorCards(1)}${floorCards(2)}` : emptyRooms}`;
      }
      function renderTenants() {
        const list = data.tenants.filter(item => `${item.name} ${item.phone || ""} ${room(item.roomId)?.name || ""}`.toLowerCase().includes(query.toLowerCase()));
        const rows = list.map(item => `<tr><td class="table-first"><strong>${esc(item.name)}</strong><small class="table-detail">${item.isPrimary ? "Kontak tagihan utama" : "Penghuni kedua"}</small></td><td>${esc(item.phone || "—")}</td><td>${esc(room(item.roomId)?.name || "Kamar dihapus")}</td><td>${formatDate(item.startDate)}</td><td>${item.electronics?.length ? money(electronicCharges(item)) : "—"}</td><td>${badge(item.status)}</td><td><div class="row-actions"><button class="icon-button" title="Edit penyewa" aria-label="Edit penyewa" data-action="edit-tenant" data-id="${item.id}">${icon("file")}</button>${item.status === "active" ? `<button class="icon-button" title="Akhiri masa sewa" aria-label="Akhiri masa sewa" data-action="end-tenant" data-id="${item.id}">${icon("clock")}</button>` : ""}<button class="icon-button delete" title="Hapus penyewa" aria-label="Hapus penyewa" data-action="delete-tenant" data-id="${item.id}">${icon("trash")}</button></div></td></tr>`).join("");
        return `${head("PENGELOLAAN PENGHUNI", "Penyewa", "Informasi penghuni dan riwayat masa sewa.", pageAction("Tambah penyewa", "add-tenant"))}
          <div class="page-toolbar"><span class="toolbar-note">${activeTenants().length} penyewa aktif · ${data.tenants.length} total tercatat</span><div class="filter-group">${filterBox("Cari nama, telepon, kamar...")}</div></div>
          <section class="panel data-panel"><div class="panel-head"><div><div class="panel-title">Daftar penyewa</div><div class="panel-subtitle">Maksimal dua orang per kamar; kontak utama menerima satu tagihan untuk masa sewa</div></div></div>
          ${list.length ? `<div class="table-wrap"><table><thead><tr><th class="table-first">NAMA PENYEWA</th><th>NO. TELEPON</th><th>KAMAR</th><th>MULAI SEWA</th><th>TAMBAHAN ELEKTRONIK / BLN</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState(query ? "Penyewa tidak ditemukan" : "Belum ada penyewa", query ? "Coba kata kunci pencarian yang lain." : "Tambahkan kamar terlebih dahulu, lalu daftarkan penyewa.", query ? "" : data.rooms.length ? pageAction("Tambah penyewa", "add-tenant") : `<button class="button button-quiet button-small" data-action="add-room">Tambah kamar dulu</button>`)}</section>`;
      }
      function renderBills() {
        const bills = monthBills(selectedMonth);
        const rows = bills.map(item => {
          const person = tenant(item.tenantId), roomData = person && room(person.roomId);
          const status = billStatus(item);
          const rentAmount = Number(item.rentAmount ?? item.amount);
          const addOnAmount = Number(item.electronicsTotal) || 0;
          const monthDays = lastDayOfMonth(...item.month.split("-").map((part, index) => index === 1 ? Number(part) - 1 : Number(part)));
          const details = `${addOnAmount ? `<div class="field-hint">Elektronik: ${money(addOnAmount)}${item.electronics?.length ? ` · ${item.electronics.map(device => `${esc(device.name)}${device.prorataDays < monthDays ? ` (${device.prorataDays} hari)` : ""}`).join(", ")}` : ""}</div>` : ""}${item.prorataDays && item.fullRentAmount && rentAmount < item.fullRentAmount ? `<div class="field-hint">Sewa prorata ${item.prorataDays} hari dari ${money(item.fullRentAmount)}</div>` : ""}${billAdjustments(item.id) ? `<div class="field-hint">Penyesuaian −${money(billAdjustments(item.id))}</div>` : ""}<div class="field-hint">Sisa ${money(billBalance(item))} · jatuh tempo ${formatDate(item.dueDate)}</div>`;
          return `<tr><td class="table-first"><strong>${esc(item.tenantName || person?.name || "Penyewa dihapus")}</strong><small class="table-detail">${esc(item.leaseMemberNames || "")}</small></td><td>${esc(item.roomName || roomData?.name || "—")}</td><td><strong>${money(item.amount)}</strong>${details}</td><td>${billPaidAmount(item) ? money(billPaidAmount(item)) : "—"}</td><td>${badge(status)}</td><td><div class="row-actions">${billBalance(item) > 0 ? `<button class="button button-quiet button-small" data-action="record-payment" data-id="${item.id}">Catat bayar</button>${whatsappButton(item)}` : ""}<button class="icon-button delete" title="Hapus tagihan" aria-label="Hapus tagihan" data-action="delete-bill" data-id="${item.id}">${icon("trash")}</button></div></td></tr>`;
        }).join("");
        const due = bills.reduce((sum, item) => sum + billBalance(item), 0);
        return `${head("PENAGIHAN SEWA", "Tagihan", "Buat tagihan bulanan dan pantau pembayaran setiap penyewa.", pageAction("Buat tagihan", "generate-bills"))}
          <div class="note-banner"><strong>Perhitungan otomatis.</strong> Tagihan pertama dihitung prorata sejak tanggal masuk (inklusif) dan jatuh tempo satu bulan setelah tanggal masuk. Tagihan berikutnya jatuh tempo pada tanggal masuk di bulan tagihan; bulan yang lebih pendek menyesuaikan tanggal jatuh tempo.</div>
          <div class="page-toolbar"><span class="toolbar-note">${bills.length} tagihan · ${money(due)} belum lunas</span><div class="filter-group">${monthInput(selectedMonth, "page-month-picker")}</div></div>
          <section class="panel data-panel"><div class="panel-head"><div><div class="panel-title">Tagihan ${monthLabel(selectedMonth)}</div><div class="panel-subtitle">Pilih bulan untuk melihat tagihan terkait</div></div></div>
          ${bills.length ? `<div class="table-wrap"><table><thead><tr><th class="table-first">KONTAK TAGIHAN</th><th>KAMAR</th><th>NOMINAL</th><th>SUDAH DIBAYAR</th><th>STATUS</th><th>AKSI</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("Belum ada tagihan bulan ini", activeLeases().length ? "Buat tagihan untuk kontak utama setiap kamar berpenghuni." : "Daftarkan penyewa aktif terlebih dahulu untuk membuat tagihan.", activeLeases().length ? pageAction("Buat tagihan", "generate-bills") : "")}</section>`;
      }
      function whatsappButton(bill) {
        const person = tenant(bill.tenantId);
        const number = whatsappNumber(person?.phone);
        if (!number) return "";
        const text = `Halo ${person.name}, pengingat tagihan kos ${bill.roomName || ""} untuk ${monthLabel(bill.month)} sebesar ${money(billBalance(bill))}. Jatuh tempo ${formatDate(bill.dueDate)}.`;
        return `<a class="button button-quiet button-small" href="https://wa.me/${encodeURIComponent(number)}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener noreferrer" aria-label="Kirim pengingat WhatsApp kepada ${esc(person.name)}">WhatsApp</a>`;
      }
      function renderPayments() {
        const list = [...data.payments].filter(item => item.date?.slice(0, 7) === selectedMonth).sort((a, b) => b.date.localeCompare(a.date));
        const rows = list.map(item => {
          const bill = data.bills.find(entry => entry.id === item.billId);
          const person = tenant(item.tenantId);
          return `<tr><td class="table-first">${formatDate(item.date)}</td><td><strong>${esc(item.tenantName || person?.name || "Penyewa dihapus")}</strong></td><td>${esc(item.roomName || bill?.roomName || "—")} · ${monthLabel(item.month || bill?.month || selectedMonth)}</td><td><strong>${money(item.amount)}</strong></td><td>${esc(item.method || "—")}</td><td>${item.excessAmount ? `${money(item.excessAmount)} · ${esc(item.disposition || "belum dialokasikan")}` : money(item.appliedAmount ?? item.amount)}</td></tr>`;
        }).join("");
        const total = monthIncome(selectedMonth);
        return `${head("TRANSAKSI MASUK", "Pembayaran", "Riwayat penerimaan dan alokasi pembayaran yang dicatat pemilik.", "")}
          <div class="page-toolbar"><span class="toolbar-note">${list.length} transaksi · pemasukan teralokasi ${money(total)}</span><div class="filter-group">${monthInput(selectedMonth, "payment-month-picker")}</div></div>
          <section class="panel data-panel"><div class="panel-head"><div><div class="panel-title">Riwayat pembayaran · ${monthLabel(selectedMonth)}</div><div class="panel-subtitle">Pembayaran tunai/transfer dan alokasi deposit</div></div></div>
          ${list.length ? `<div class="table-wrap"><table><thead><tr><th class="table-first">TANGGAL</th><th>PENYEWA</th><th>TAGIHAN</th><th>DIBAYAR</th><th>METODE</th><th>DIALOKASIKAN</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState("Belum ada pembayaran", "Pemasukan akan dicatat setelah pemilik merekam transaksi pembayaran.")}</section>
          <section class="panel data-panel" style="margin-top:16px"><div class="panel-head"><div><div class="panel-title">Pembayaran lebih / deposit</div><div class="panel-subtitle">Dana lebih tidak dihitung sebagai pendapatan sebelum dialokasikan ke tagihan</div></div></div>
          ${data.payments.some(item => depositRemaining(item) > 0 && item.disposition === "deposit") ? `<div class="table-wrap"><table><thead><tr><th class="table-first">TANGGAL</th><th>PENYEWA</th><th>SALDO DEPOSIT</th><th>CATATAN</th><th>AKSI</th></tr></thead><tbody>${data.payments.filter(item => depositRemaining(item) > 0 && item.disposition === "deposit").map(item => `<tr><td class="table-first">${formatDate(item.date)}</td><td>${esc(item.tenantName || tenant(item.tenantId)?.name || "Penyewa")}</td><td>${money(depositRemaining(item))}</td><td>${esc(item.note || "Deposit")}</td><td><button class="button button-quiet button-small" data-action="allocate-deposit" data-id="${item.id}">Alokasikan</button></td></tr>`).join("")}</tbody></table></div>` : emptyState("Belum ada deposit tercatat", "Pilih perlakuan deposit saat pembayaran melebihi sisa tagihan.")}</section>`;
      }
      function renderSettings() {
        const recentAudit = [...data.auditLog].reverse().slice(0, 8);
        const auditLabels = { ended: "Masa sewa diakhiri", adjusted: "Piutang disesuaikan", received: "Pembayaran dicatat", created: "Transaksi dicatat", updated: "Transaksi diperbarui", deleted: "Transaksi dihapus" };
        return `${head("PREFERENSI PEMILIK", "Pengaturan", "Kelola informasi properti, pengalaman aplikasi, dan cadangan data lokal.", "")}
          <section class="panel settings-panel"><div class="panel-head"><div><div class="panel-title">Pasang aplikasi di HP</div><div class="panel-subtitle">Akses Kos Pak Gunawan langsung dari layar utama</div></div><button class="button button-primary button-small" type="button" data-action="install-app">${icon("install")}Instal aplikasi</button></div><div class="panel-body"><p class="field-hint">Pasang sebagai aplikasi agar lebih mudah dibuka. Jika dialog instal tidak muncul, petunjuk pemasangan akan ditampilkan.</p></div></section>
          <section class="panel settings-panel"><div class="panel-head"><div><div class="panel-title">Pengingat pembayaran</div><div class="panel-subtitle">WhatsApp dibuka manual dari tombol pada tagihan</div></div></div><div class="panel-body"><p class="field-hint">Nomor telepon penyewa yang sudah dicatat akan digunakan untuk menyiapkan pesan pengingat. Pesan tidak dikirim otomatis, sehingga pemilik dapat memeriksanya terlebih dahulu.</p></div></section>
          <section class="panel settings-panel"><div class="panel-head"><div><div class="panel-title">Data lokal & cadangan</div><div class="panel-subtitle">Cadangkan atau pulihkan data kos</div></div></div><div class="panel-body"><p class="field-hint">Unduh cadangan JSON secara berkala. Saat memulihkan, isi data saat ini akan diganti dengan data pada berkas cadangan.</p><div class="backup-actions"><button class="button button-quiet button-small" data-action="export-json">${icon("download")}Unduh cadangan</button><button class="button button-quiet button-small" data-action="import-json">Unggah cadangan</button><input id="backup-file" type="file" accept="application/json,.json" hidden></div></div></section>
          <section class="panel settings-panel"><div class="panel-head"><div><div class="panel-title">Tentang properti</div><div class="panel-subtitle">${esc(data.property.name)} · ${esc(data.property.type)}</div></div></div><div class="panel-body"><p class="field-hint">${esc(data.property.address)}</p><p class="field-hint">${data.rooms.length} kamar · ${data.property.floors} lantai · listrik dasar termasuk sewa · air sumur sendiri (tanpa biaya air).</p></div></section>
          <section class="panel data-panel"><div class="panel-head"><div><div class="panel-title">Riwayat aktivitas</div><div class="panel-subtitle">Perubahan transaksi dan penyesuaian yang dicatat pemilik</div></div></div>${recentAudit.length ? `<div class="compact-bill-list">${recentAudit.map(item => `<div><span><strong>${esc(auditLabels[item.action] || item.action)}</strong><small>${formatDate(item.date)} · ${esc(item.reason || "Tanpa catatan")}</small></span><span>${esc(item.entity)}</span></div>`).join("")}</div>` : emptyState("Belum ada riwayat aktivitas", "Perubahan masa sewa dan transaksi akan dicatat di sini.")}</section>`;
      }
      function renderExpenses() {
        const list = data.expenses.filter(item => `${item.note} ${item.category}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date));
        const rows = list.map(item => `<tr><td class="table-first">${formatDate(item.date)}</td><td>${esc(item.category)}</td><td><strong>${esc(item.note)}</strong></td><td><strong>${money(item.amount)}</strong></td><td><div class="row-actions"><button class="icon-button" title="Edit pengeluaran" aria-label="Edit pengeluaran" data-action="edit-expense" data-id="${item.id}">${icon("file")}</button><button class="icon-button delete" title="Hapus pengeluaran" aria-label="Hapus pengeluaran" data-action="delete-expense" data-id="${item.id}">${icon("trash")}</button></div></td></tr>`).join("");
        const total = data.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
        return `${head("BIAYA OPERASIONAL", "Pengeluaran", "Catat biaya operasional agar laporan keuangan tetap akurat.", pageAction("Catat pengeluaran", "add-expense"))}
          <div class="page-toolbar"><span class="toolbar-note">${data.expenses.length} transaksi tercatat · Total ${money(total)}</span><div class="filter-group">${filterBox("Cari kategori atau catatan...")}</div></div>
          <section class="panel data-panel"><div class="panel-head"><div><div class="panel-title">Riwayat pengeluaran</div><div class="panel-subtitle">Semua biaya yang dicatat pemilik kos</div></div></div>
          ${list.length ? `<div class="table-wrap"><table><thead><tr><th class="table-first">TANGGAL</th><th>KATEGORI</th><th>CATATAN</th><th>NOMINAL</th><th>AKSI</th></tr></thead><tbody>${rows}</tbody></table></div>` : emptyState(query ? "Transaksi tidak ditemukan" : "Belum ada pengeluaran", query ? "Coba kata kunci pencarian yang lain." : "Catat pengeluaran nyata seperti jasa angkut sampah, Wi-Fi, galon, listrik, atau perbaikan.", query ? "" : pageAction("Catat pengeluaran", "add-expense"))}</section>`;
      }
      function renderReports() {
        const months = Array.from({ length: 6 }, (_, index) => {
          const date = new Date(`${selectedMonth}-01T00:00:00`);
          date.setMonth(date.getMonth() - (5 - index));
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        });
        const values = months.map(month => ({ month, income: monthIncome(month), expense: monthExpenses(month) }));
        const maxValue = Math.max(1, ...values.flatMap(item => [item.income, item.expense]));
        const selectedIncome = monthIncome(selectedMonth), selectedExpense = monthExpenses(selectedMonth);
        const chart = values.map(item => `<div class="chart-column"><div class="bar-pair"><div class="bar income" title="Pemasukan ${money(item.income)}" style="height:${Math.max(item.income ? 4 : 2, item.income / maxValue * 100)}%"></div><div class="bar expense" title="Pengeluaran ${money(item.expense)}" style="height:${Math.max(item.expense ? 4 : 2, item.expense / maxValue * 100)}%"></div></div><span class="chart-label">${new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(`${item.month}-01T00:00:00`))}</span></div>`).join("");
        return `${head("ANALISIS KEUANGAN", "Laporan", "Pantau arus kas berdasarkan pembayaran dan pengeluaran nyata.", `<button class="button button-quiet" data-action="export-csv">${icon("download")}Ekspor CSV</button>`)}
          <div class="page-toolbar"><span class="toolbar-note">Periode laporan: ${monthLabel(selectedMonth)}</span><div class="filter-group">${monthInput(selectedMonth, "report-month-picker")}</div></div>
          <div class="note-banner">Pemasukan mengikuti catatan pembayaran nyata yang dimasukkan pemilik. Deposit/kelebihan bayar tidak dihitung otomatis sebagai pendapatan, dan penyesuaian piutang bukan pemasukan. Tidak ada denda keterlambatan.</div>
          <div class="report-grid">
            <section class="panel"><div class="panel-head"><div><div class="panel-title">Arus kas 6 bulan</div><div class="panel-subtitle">Perbandingan pemasukan diterima dan pengeluaran</div></div></div><div class="panel-body"><div class="legend"><span><i></i>Pemasukan</span><span><i class="expense"></i>Pengeluaran</span></div><div class="chart">${chart}</div></div></section>
            <section class="panel"><div class="panel-head"><div><div class="panel-title">Ringkasan ${monthLabel(selectedMonth)}</div><div class="panel-subtitle">Rangkuman transaksi pada periode ini</div></div></div><div class="panel-body"><div class="report-summary">
              <div class="summary-line"><span>Pemasukan diterima</span><strong>${money(selectedIncome)}</strong></div>
              <div class="summary-line"><span>Pengeluaran operasional</span><strong>${money(selectedExpense)}</strong></div>
              <div class="summary-divider"></div>
              <div class="summary-line"><span>Arus kas bersih</span><strong style="color:${selectedIncome - selectedExpense < 0 ? "var(--red)" : "var(--green)"}">${money(selectedIncome - selectedExpense)}</strong></div>
              <div class="summary-line"><span>Tagihan belum lunas</span><strong>${money(monthBills(selectedMonth).reduce((sum, item) => sum + billBalance(item), 0))}</strong></div>
              <div class="summary-line"><span>Kamar berpenghuni (tercatat)</span><strong>${activeTenants().length ? `${data.rooms.filter(item => roomStatus(item) === "occupied").length} / ${data.rooms.length}` : "Belum dicatat"}</strong></div>
            </div></div></section>
          </div>
          <div style="margin-top:16px" class="panel"><div class="panel-head"><div><div class="panel-title">Cadangan data</div><div class="panel-subtitle">Simpan salinan data kos Anda ke perangkat</div></div><button class="button button-quiet button-small" data-action="export-json">${icon("download")}Unduh JSON</button></div></div>`;
      }
      function deviceRow(item = {}, index = 0) {
        return `<div class="device-row"><div class="field"><label for="device-name-${index}">Barang elektronik</label><input id="device-name-${index}" name="deviceName-${index}" maxlength="60" placeholder="Nama barang" value="${esc(item.name || "")}"></div><div class="field"><label for="device-fee-${index}">Tambahan / bulan (Rp)</label><input id="device-fee-${index}" name="deviceFee-${index}" type="number" min="0" step="1" placeholder="Ditentukan pemilik" value="${esc(item.monthlyFee ?? "")}"></div><button class="icon-button delete device-remove" type="button" title="Hapus perangkat" aria-label="Hapus perangkat" data-action="remove-device">${icon("trash")}</button></div>`;
      }
      function openModal(type, id = "", roomId = "") {
        const editing = Boolean(id);
        const existingRoom = editing ? data.rooms.find(item => item.id === id) : null;
        const existingExpense = editing ? data.expenses.find(item => item.id === id) : null;
        let title = "Tambah kamar", description = "Masukkan informasi kamar dan tarif sewa bulanan.";
        let fields = "";
        if (type === "room") {
          title = editing ? "Edit kamar" : "Tambah kamar";
          fields = `<div class="field"><label for="room-name">Nama kamar</label><input id="room-name" name="name" required maxlength="60" placeholder="Contoh: Kamar 01" value="${esc(existingRoom?.name || "")}"></div>
            <div class="field"><label for="room-floor">Lantai</label><select id="room-floor" name="floor" required><option value="1" ${existingRoom?.floor !== 2 ? "selected" : ""}>Lantai 1</option><option value="2" ${existingRoom?.floor === 2 ? "selected" : ""}>Lantai 2</option></select></div>
            <div class="field full"><label for="room-rent">Harga sewa per bulan (Rp)</label><input id="room-rent" name="rent" type="number" min="1" step="1" placeholder="${DEFAULT_ROOM_RENT}" value="${esc(existingRoom?.rent ?? DEFAULT_ROOM_RENT)}"><p class="field-hint">Tarif awal Rp400.000 per bulan. Ubah nominal ini jika tarif kamar berbeda.</p></div>
            <div class="field full"><label for="room-notes">Catatan (opsional)</label><textarea id="room-notes" name="notes" maxlength="300" placeholder="Fasilitas atau informasi kamar">${esc(existingRoom?.notes || "")}</textarea></div>`;
        } else if (type === "tenant") {
          title = editing ? "Edit penyewa" : "Tambah penyewa";
          description = "Penyewa aktif menempati satu kamar dan menjadi dasar tagihan bulanan.";
          const person = editing ? tenant(id) : null;
          if (editing && person?.status !== "active") {
            toast("Data penyewa yang masa sewanya berakhir tidak dapat diedit.");
            return;
          }
          const availableRooms = data.rooms.filter(item => roomOccupants(item.id).length < 2 || item.id === person?.roomId);
          if (!availableRooms.length) {
            toast("Tidak ada kamar kosong. Tambahkan kamar atau akhiri masa sewa terlebih dahulu.");
            return;
          }
          const selectedRoomId = person?.roomId || roomId || availableRooms[0]?.id;
          const selectedRoomOccupants = roomOccupants(selectedRoomId).filter(item => item.id !== person?.id);
          const sharedLease = Boolean(person && leaseMembers(person.leaseId || person.id).length > 1);
          fields = `<div class="field full"><label for="tenant-name">Nama lengkap</label><input id="tenant-name" name="name" required maxlength="100" placeholder="Nama penyewa" value="${esc(person?.name || "")}"></div>
            <div class="form-grid"><div class="field"><label for="tenant-phone">No. telepon (opsional)</label><input id="tenant-phone" name="phone" type="tel" maxlength="30" placeholder="08xxxxxxxxxx" value="${esc(person?.phone || "")}"></div>
            <div class="field"><label for="tenant-start">Mulai sewa</label><input id="tenant-start" name="startDate" type="date" required value="${esc(person?.startDate || todayISO())}"></div></div>
            <div class="field"><label for="tenant-room">Kamar</label><select id="tenant-room" ${sharedLease ? "disabled" : 'name="roomId"'} required>${availableRooms.map(item => `<option value="${esc(item.id)}" ${selectedRoomId === item.id ? "selected" : ""}>${esc(item.name)} — ${configuredRent(item) ? `${money(item.rent)}/bln` : "tarif belum diatur"}</option>`).join("")}</select>${sharedLease ? `<input type="hidden" name="roomId" value="${esc(person.roomId)}"><p class="field-hint">Kamar tidak dapat dipisahkan dari penghuni lain dalam satu masa sewa.</p>` : ""}</div>
            <div class="field full" id="secondary-occupancy-field" ${selectedRoomOccupants.length ? "" : "hidden"}><label class="check-field"><input type="checkbox" name="secondary" value="yes" ${roomId ? "checked" : ""}> Penghuni kedua dalam satu kamar (maksimal dua orang)</label><p class="field-hint">Satu penyewa kontak utama akan menerima satu tagihan untuk kamar ini.</p></div>
            <div class="field full"><label>Barang elektronik dengan biaya tambahan</label><p class="field-hint">Listrik dasar sudah termasuk sewa. Biaya bulanan perangkat ditentukan pemilik per penghuni dan masuk ke satu tagihan kontak utama. Air sumur tidak dikenakan biaya.</p></div>
            <div class="field full"><div class="device-list" id="device-list">${(person?.electronics || []).map((item, index) => deviceRow(item, index)).join("")}</div><button class="button button-quiet button-small" type="button" data-action="add-device">${icon("plus")}Tambah perangkat</button></div>`;
        } else if (type === "lease-end") {
          const person = tenant(id);
          if (!person || person.status !== "active") return;
          const leaseId = person.leaseId || person.id;
          const openBills = data.bills.filter(item => (item.leaseId || item.tenantId) === leaseId && billBalance(item) > 0);
          title = "Akhiri masa sewa";
          description = `Akhiri sewa ${esc(person.name)} dan penghuni lain pada kamar yang sama.`;
          fields = `<div class="field"><label for="lease-end-date">Tanggal keluar</label><input id="lease-end-date" name="endDate" type="date" required max="${todayISO()}" value="${todayISO()}"></div>
            ${openBills.length ? `<div class="field"><label for="adjustment-bill">Tagihan untuk penyesuaian (opsional)</label><select id="adjustment-bill" name="billId"><option value="">Tidak ada penyesuaian</option>${openBills.map(item => `<option value="${esc(item.id)}">${esc(item.roomName)} · ${monthLabel(item.month)} · sisa ${money(billBalance(item))}</option>`).join("")}</select></div>
              <div class="field"><label for="adjustment-amount">Penyesuaian pengurang piutang (Rp)</label><input id="adjustment-amount" name="adjustmentAmount" type="number" min="0" step="1" value="0"></div>
              <div class="field"><label for="adjustment-reason">Alasan penyesuaian</label><input id="adjustment-reason" name="adjustmentReason" maxlength="200" placeholder="Wajib diisi jika nominal penyesuaian lebih dari 0"></div>` : ""}
            <p class="field-hint">Penyesuaian mengurangi piutang secara manual dan tidak dicatat sebagai pembayaran atau pendapatan.</p>`;
        } else if (type === "deposit-allocation") {
          const deposit = data.payments.find(item => item.id === id && item.disposition === "deposit");
          const leaseId = deposit?.leaseId || deposit?.tenantId;
          const openBills = data.bills.filter(item => (item.leaseId || item.tenantId) === leaseId && billBalance(item) > 0);
          if (!deposit || depositRemaining(deposit) <= 0 || !openBills.length) {
            toast("Tidak ada saldo deposit atau tagihan terbuka untuk dialokasikan.", "error");
            return;
          }
          title = "Alokasikan deposit";
          description = `Saldo deposit ${money(depositRemaining(deposit))} milik ${esc(deposit.tenantName || "penyewa")}.`;
          fields = `<input type="hidden" name="sourceDepositId" value="${esc(deposit.id)}"><div class="field"><label for="deposit-bill">Tagihan</label><select id="deposit-bill" name="billId" required>${openBills.map(item => `<option value="${esc(item.id)}">${esc(item.roomName)} · ${monthLabel(item.month)} · sisa ${money(billBalance(item))}</option>`).join("")}</select></div>
            <div class="field"><label for="deposit-amount">Nominal alokasi (Rp)</label><input id="deposit-amount" name="amount" type="number" min="1" max="${depositRemaining(deposit)}" step="1" required value="${Math.min(depositRemaining(deposit), billBalance(openBills[0]))}"></div>
            <div class="field"><label for="deposit-date">Tanggal alokasi</label><input id="deposit-date" name="date" type="date" required value="${todayISO()}"></div>
            <p class="field-hint">Alokasi deposit mengurangi saldo piutang dan dicatat sebagai pendapatan pada tanggal alokasi. Tidak ada penerimaan kas baru.</p>`;
        } else if (type === "payment") {
          const bill = data.bills.find(item => item.id === id);
          if (!bill || billBalance(bill) <= 0) {
            toast("Tagihan sudah lunas atau tidak ditemukan.", "error");
            return;
          }
          title = "Catat pembayaran";
          description = `${esc(bill.tenantName || tenant(bill.tenantId)?.name || "Penyewa")} · ${esc(bill.roomName || "")} · sisa ${money(billBalance(bill))}`;
          fields = `<input type="hidden" name="billId" value="${esc(bill.id)}"><div class="form-grid">
            <div class="field"><label for="payment-date">Tanggal diterima</label><input id="payment-date" name="date" type="date" required value="${todayISO()}"></div>
            <div class="field"><label for="payment-amount">Nominal diterima (Rp)</label><input id="payment-amount" name="amount" type="number" min="1" step="1" required value="${billBalance(bill)}"></div>
            </div><div class="field"><label for="payment-method">Metode</label><select id="payment-method" name="method" required><option value="transfer">Transfer</option><option value="tunai">Tunai</option></select></div>
            <div class="field"><label for="payment-excess">Jika pembayaran melebihi sisa tagihan</label><select id="payment-excess" name="disposition"><option value="deposit">Simpan sebagai deposit / kredit (bukan pendapatan)</option><option value="refund">Kembalikan kelebihan kepada penyewa</option><option value="revenue">Alokasikan seluruhnya sebagai pendapatan</option></select><p class="field-hint">Kelebihan bayar tidak otomatis menjadi pendapatan. Pilih perlakuan yang sesuai.</p></div>
            <div class="field"><label for="payment-note">Catatan (opsional)</label><input id="payment-note" name="note" maxlength="200" placeholder="Referensi transaksi atau catatan"></div>`;
        } else {
          title = editing ? "Edit pengeluaran" : "Catat pengeluaran";
          description = "Masukkan transaksi operasional yang benar-benar terjadi.";
          fields = `<div class="field"><label for="expense-date">Tanggal transaksi</label><input id="expense-date" name="date" type="date" required value="${esc(existingExpense?.date || todayISO())}"></div>
            <div class="field"><label for="expense-amount">Nominal (Rp)</label><input id="expense-amount" name="amount" type="number" min="1" step="1" required placeholder="Nominal transaksi" value="${esc(existingExpense?.amount ?? "")}"></div>
            <div class="field"><label for="expense-category">Kategori</label><input id="expense-category" name="category" list="expense-categories" required maxlength="60" placeholder="Pilih atau ketik kategori" value="${esc(existingExpense?.category || "")}"><datalist id="expense-categories">${["Jasa angkut sampah", "Wi-Fi", "Galon", "Listrik", "Perbaikan", "Kebersihan", "Perlengkapan", "Pajak", "Lainnya"].map(value => `<option value="${value}">`).join("")}</datalist></div>
            <div class="field"><label for="expense-note">Catatan</label><input id="expense-note" name="note" required maxlength="120" placeholder="Catatan transaksi" value="${esc(existingExpense?.note || "")}"></div>`;
        }
        overlay.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-head"><div><h2 id="modal-title">${title}</h2><p>${description}</p></div><button class="modal-close" type="button" aria-label="Tutup" data-close-modal>${icon("close")}</button></div>
          <form class="modal-form" id="entry-form" data-form-type="${type}" data-id="${esc(id)}"><div class="form-grid">${fields}</div><p class="form-error" id="form-error" hidden></p><div class="modal-actions"><button class="button button-quiet" type="button" data-close-modal>Batal</button><button class="button button-primary" type="submit">${type === "lease-end" ? "Akhiri masa sewa" : type === "payment" ? "Catat pembayaran" : type === "deposit-allocation" ? "Alokasikan deposit" : editing ? "Simpan perubahan" : "Simpan"}</button></div></form>
        </section></div>`;
        const first = overlay.querySelector("input, select");
        if (first) first.focus();
      }
      function openMoreMenu() {
        overlay.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="quick-menu" role="dialog" aria-label="Menu lainnya">
          <div class="quick-menu-head"><strong>Menu lainnya</strong><button class="icon-button" type="button" aria-label="Tutup" data-close-modal>${icon("close")}</button></div>
          ${navItems.filter(([id]) => ["expenses", "reports", "settings"].includes(id)).map(([id, iconName, label]) => `<button class="quick-menu-item" data-page="${id}">${icon(iconName)}<span>${label}</span>${currentPage === id ? `<span class="quick-menu-current">Aktif</span>` : ""}</button>`).join("")}
        </section></div>`;
      }
      function createBills() {
        const month = selectedMonth;
        const leases = activeLeases();
        if (!leases.length) { toast("Belum ada penyewa aktif untuk ditagih."); return; }
        const existingIds = new Set(data.bills.filter(item => item.month === month).map(item => item.leaseId || item.tenantId));
        const eligible = leases.filter(lease => !existingIds.has(lease.person.leaseId || lease.person.id)).map(lease => {
          const assignedRoom = room(lease.person.roomId);
          return { ...lease, assignedRoom };
        });
        const skipped = eligible.filter(item => !configuredRent(item.assignedRoom));
        const invalidStart = eligible.filter(({ person }) => !/^\d{4}-\d{2}-\d{2}$/.test(person.startDate || ""));
        const futureStart = eligible.filter(({ person }) => person.startDate && person.startDate.slice(0, 7) > month);
        const additions = eligible.filter(item => configuredRent(item.assignedRoom) && /^\d{4}-\d{2}-\d{2}$/.test(item.person.startDate || "") && item.person.startDate.slice(0, 7) <= month).map(({ person, members, assignedRoom }) => {
          const membersInPeriod = members.filter(member => /^\d{4}-\d{2}-\d{2}$/.test(member.startDate || "") && member.startDate.slice(0, 7) <= month);
          const daysInMonth = lastDayOfMonth(...month.split("-").map((part, index) => index === 1 ? Number(part) - 1 : Number(part)));
          const daysCharged = daysChargedInMonth(person.startDate, month);
          const rentAmount = Math.round(Number(assignedRoom.rent) * daysCharged / daysInMonth);
          const electronics = membersInPeriod.flatMap(member => {
            const memberDays = daysChargedInMonth(member.startDate, month);
            return (member.electronics || []).map(item => ({
              name: item.name, monthlyFee: Number(item.monthlyFee), tenantName: member.name,
              billedFee: Math.round(Number(item.monthlyFee) * memberDays / daysInMonth), prorataDays: memberDays
            }));
          });
          const electronicsTotal = electronics.reduce((sum, item) => sum + item.billedFee, 0);
          const fullAmount = Number(assignedRoom.rent) + electronics.reduce((sum, item) => sum + item.monthlyFee, 0);
          const amount = rentAmount + electronicsTotal;
          return {
            id: newId(), leaseId: person.leaseId || person.id, tenantId: person.id, tenantName: person.name, leaseMemberNames: membersInPeriod.map(member => member.name).join(", "), roomId: assignedRoom.id, roomName: assignedRoom.name,
            month, startDate: person.startDate, rentAmount, fullRentAmount: Number(assignedRoom.rent), electronics, electronicsTotal,
            fullAmount, prorataDays: daysCharged, amount, dueDate: dueDateForMonth(person.startDate, month), status: "due", paidAt: null
          };
        });
        if (!additions.length) {
          toast(invalidStart.length ? `${invalidStart.length} penyewa belum memiliki tanggal mulai sewa.` : skipped.length ? `${skipped.length} kamar belum memiliki tarif sewa. Atur tarif sebelum membuat tagihan.` : futureStart.length ? "Tanggal mulai sewa penyewa berada setelah bulan tagihan yang dipilih." : "Tagihan untuk semua penyewa aktif sudah tersedia pada bulan ini.");
          return;
        }
        data.bills.push(...additions);
        if (persist()) {
          toast(`${additions.length} tagihan dibuat${skipped.length ? `; ${skipped.length} tarif belum diatur` : ""}${invalidStart.length ? `; ${invalidStart.length} tanggal masuk belum tersedia` : ""}${futureStart.length ? `; ${futureStart.length} belum mulai` : ""}.`);
          render();
        }
      }
      function downloadFile(filename, contents, mime) {
        const blob = new Blob([contents], { type: mime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      function showInstallInstructions() {
        if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true) {
          toast("Aplikasi sudah dibuka dalam mode terpasang.");
          return;
        }
        overlay.innerHTML = `<div class="modal-backdrop" data-close-modal><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-head"><div><h2 id="modal-title">Pasang Kos Pak Gunawan</h2><p>Jika dialog instal otomatis tidak tersedia, gunakan menu browser.</p></div><button class="modal-close" type="button" aria-label="Tutup" data-close-modal>${icon("close")}</button></div>
          <div class="modal-form"><div class="note-banner"><strong>Android · Chrome</strong><br>Buka menu ⋮ di Chrome, lalu pilih “Instal aplikasi” atau “Tambahkan ke layar utama”.</div>
            <div class="note-banner"><strong>iPhone/iPad · Safari</strong><br>Ketuk tombol Bagikan, lalu pilih “Tambahkan ke Layar Utama”.</div>
            <div class="note-banner"><strong>Komputer · Chrome/Edge</strong><br>Gunakan ikon instal di bilah alamat atau menu browser untuk memasang aplikasi.</div>
            <div class="modal-actions"><button class="button button-primary" type="button" data-close-modal>Tutup</button></div>
          </div></section></div>`;
      }
      function csvCell(value) {
        let text = String(value ?? "");
        if (/^[=+\-@]/.test(text)) text = `'${text}`;
        return `"${text.replace(/"/g, '""')}"`;
      }
      function exportCsv() {
        const rows = [["Jenis transaksi", "Tanggal/periode", "Penyewa/kategori", "Kamar/catatan", "Sewa dasar (IDR)", "Tambahan elektronik (IDR)", "Detail barang elektronik", "Nominal total (IDR)", "Status"]];
        data.bills.filter(item => item.month === selectedMonth).forEach(item => {
          const person = tenant(item.tenantId);
          const electronics = item.electronics || [];
          rows.push([
            "Tagihan sewa", item.month, item.tenantName || person?.name || "Penyewa dihapus",
            item.roomName || room(person?.roomId)?.name || "", item.rentAmount ?? item.amount,
            item.electronicsTotal || 0, electronics.map(device => `${device.name} (${device.tenantName || ""}): tarif ${money(device.monthlyFee)}, ditagih ${money(device.billedFee ?? device.monthlyFee)}`).join("; "),
            item.amount, `${statusText(billStatus(item))} · sisa ${money(billBalance(item))}`
          ]);
        });
        data.payments.filter(item => item.date?.slice(0, 7) === selectedMonth).forEach(item => rows.push([
          "Pembayaran", item.date, item.tenantName || tenant(item.tenantId)?.name || "Penyewa dihapus",
          `${item.roomName || ""} · ${monthLabel(item.month || monthNow())}`, "", "", item.method || "",
          item.amount, `Dialokasikan ${money(item.appliedAmount ?? item.amount)}${item.excessAmount ? ` · kelebihan ${money(item.excessAmount)} (${item.disposition || "belum diatur"})` : ""}`
        ]));
        data.adjustments.filter(item => item.date?.slice(0, 7) === selectedMonth).forEach(item => rows.push([
          "Penyesuaian piutang", item.date, tenant(item.tenantId)?.name || "Penyewa dihapus",
          item.reason, "", "", "", -Number(item.amount), "Bukan pemasukan"
        ]));
        data.expenses.filter(item => item.date?.slice(0, 7) === selectedMonth).forEach(item => rows.push(["Pengeluaran", item.date, item.category, item.note, "", "", "", item.amount, "Tercatat"]));
        downloadFile(`laporan-kos-${selectedMonth}.csv`, "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
        toast("Laporan CSV berhasil diunduh.");
      }
      function handleAction(action, id) {
        if (action === "toggle-theme") toggleTheme();
        else if (action === "add-room") openModal("room");
        else if (action === "edit-room") openModal("room", id);
        else if (action === "add-tenant") openModal("tenant");
        else if (action === "add-tenant-to-room") openModal("tenant", "", id);
        else if (action === "confirm-room-vacant") {
          const item = room(id);
          if (!item || roomOccupants(id).length) { toast("Kamar yang masih ditempati tidak dapat ditandai kosong.", "error"); return; }
          item.availabilityConfirmed = true;
          if (persist()) { toast("Kamar ditandai kosong."); render(); }
        }
        else if (action === "edit-tenant") openModal("tenant", id);
        else if (action === "add-expense") openModal("expense");
        else if (action === "edit-expense") openModal("expense", id);
        else if (action === "record-payment") openModal("payment", id);
        else if (action === "allocate-deposit") openModal("deposit-allocation", id);
        else if (action === "generate-bills") createBills();
        else if (action === "more-pages") openMoreMenu();
        else if (action === "show-notifications") { setPage("bills"); selectedMonth = monthNow(); render(); }
        else if (action === "install-app") {
          const prompt = installPrompt || window.kosInstallPrompt;
          if (!prompt) { showInstallInstructions(); return; }
          void (async () => {
            try {
              await prompt.prompt();
              const result = await prompt.userChoice;
              if (result.outcome === "accepted") toast("Aplikasi berhasil dipasang.");
              installPrompt = null;
              window.kosInstallPrompt = null;
              const installButton = document.querySelector(".install-button");
              if (installButton) installButton.hidden = true;
            } catch (error) {
              console.error("Dialog pemasangan aplikasi gagal.", error);
              toast("Dialog instal tidak dapat dibuka. Ikuti petunjuk pemasangan.", "error");
              showInstallInstructions();
            }
          })();
        } else if (action === "import-json") {
          document.getElementById("backup-file")?.click();
        } else if (action === "room-detail") {
          setPage("rooms");
          const card = document.querySelector(`[data-room-id="${CSS.escape(id)}"]`);
          card?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        else if (action === "toggle-paid") {
          const item = data.bills.find(bill => bill.id === id);
          if (!item) return;
          item.status = item.status === "paid" ? "due" : "paid";
          item.paidAt = item.status === "paid" ? todayISO() : null;
          if (persist()) { toast(item.status === "paid" ? "Pembayaran ditandai lunas." : "Status pembayaran dikembalikan."); render(); }
        } else if (action === "delete-room") {
          const assigned = roomTenant(id);
          if (assigned) { toast(`Kamar masih ditempati ${assigned.name}. Akhiri masa sewa terlebih dahulu.`); return; }
          if (!window.confirm("Hapus kamar ini? Tagihan historis tetap disimpan.")) return;
          data.rooms = data.rooms.filter(item => item.id !== id);
          if (persist()) { toast("Kamar berhasil dihapus."); render(); }
        } else if (action === "end-tenant") {
          openModal("lease-end", id);
        } else if (action === "delete-tenant") {
          if (data.bills.some(item => item.tenantId === id)) { toast("Penyewa ini memiliki riwayat tagihan. Akhiri masa sewa agar riwayat keuangan tetap utuh."); return; }
          if (!window.confirm("Hapus data penyewa ini?")) return;
          const roomId = tenant(id)?.roomId;
          data.tenants = data.tenants.filter(item => item.id !== id);
          if (roomId && !roomOccupants(roomId).length) {
            const assignedRoom = room(roomId);
            if (assignedRoom) assignedRoom.availabilityConfirmed = true;
          }
          if (persist()) { toast("Data penyewa berhasil dihapus."); render(); }
        } else if (action === "delete-bill") {
          if (data.payments.some(item => item.billId === id) || data.adjustments.some(item => item.billId === id)) { toast("Tagihan memiliki riwayat transaksi. Pertahankan untuk menjaga jejak keuangan.", "error"); return; }
          if (!window.confirm("Hapus tagihan ini? Perubahan ini akan memengaruhi laporan keuangan.")) return;
          audit("bill", id, "deleted", "Tagihan dihapus oleh pemilik.", data.bills.find(item => item.id === id), null);
          data.bills = data.bills.filter(item => item.id !== id);
          if (persist()) { toast("Tagihan berhasil dihapus."); render(); }
        } else if (action === "delete-expense") {
          if (!window.confirm("Hapus transaksi pengeluaran ini? Perubahan ini akan memengaruhi laporan.")) return;
          audit("expense", id, "deleted", "Pengeluaran dihapus oleh pemilik.", data.expenses.find(item => item.id === id), null);
          data.expenses = data.expenses.filter(item => item.id !== id);
          if (persist()) { toast("Transaksi berhasil dihapus."); render(); }
        } else if (action === "export-json") {
          downloadFile(`cadangan-kos-${todayISO()}.json`, JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, ...data }, null, 2), "application/json;charset=utf-8");
          toast("Cadangan data berhasil diunduh.");
        } else if (action === "export-csv") exportCsv();
      }
      async function importBackup(file) {
        try {
          const parsed = JSON.parse(await file.text());
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) ||
            !["rooms", "tenants", "bills", "payments", "expenses", "adjustments", "auditLog", "categories"].every(key => Array.isArray(parsed[key]))) {
            throw new Error("Format cadangan tidak sesuai. Gunakan file JSON hasil ekspor aplikasi ini.");
          }
          if (!window.confirm("Pulihkan data dari cadangan ini? Data saat ini akan diganti.")) return;
          const previousData = data;
          data = {
            ...emptyData(),
            ...parsed,
            property: { ...propertyInfo, ...(parsed.property || {}), address: MAP_ADDRESS },
            settings: { ownerWhatsApp: "", mapLocation: null, ...(parsed.settings || {}) },
            defaultRoomRentApplied: true
          };
          if (!persist()) {
            data = previousData;
            return;
          }
          query = "";
          toast("Cadangan berhasil dipulihkan.");
          render();
        } catch (error) {
          console.error("Pemulihan cadangan gagal.", error);
          toast(`Cadangan tidak dapat dipulihkan: ${error.message}`, "error");
        }
      }
      function handleFormSubmit(form) {
        if (form.id === "settings-form") {
          data.settings.ownerWhatsApp = new FormData(form).get("ownerWhatsApp").toString().trim();
          if (persist()) toast("Pengaturan berhasil disimpan.");
          return;
        }
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());
        const type = form.dataset.formType;
        const id = form.dataset.id;
        let message = "";
        if (type === "room") {
          const rent = values.rent === "" ? null : Number(values.rent);
          const floor = Number(values.floor);
          if (!values.name.trim() || (rent !== null && (!Number.isSafeInteger(rent) || rent < 1)) || ![1, 2].includes(floor)) message = "Masukkan nama kamar, lantai, dan tarif sewa bulanan yang valid jika sudah ditentukan.";
          else {
            const duplicate = data.rooms.some(item => item.name.trim().toLowerCase() === values.name.trim().toLowerCase() && item.id !== id);
            if (duplicate) message = "Nama kamar tersebut sudah digunakan.";
            else if (id) {
              const item = data.rooms.find(roomItem => roomItem.id === id);
              if (item) Object.assign(item, { name: values.name.trim(), floor, rent, notes: values.notes.trim() });
            } else data.rooms.push({ id: newId(), name: values.name.trim(), floor, rent, notes: values.notes.trim() });
          }
        } else if (type === "lease-end") {
          const person = tenant(id);
          const endDate = values.endDate;
          const amount = Number(values.adjustmentAmount || 0);
          const bill = data.bills.find(item => item.id === values.billId);
          if (!person || !endDate || endDate > todayISO()) message = "Pilih tanggal keluar yang valid dan tidak melebihi hari ini.";
          else if (!Number.isSafeInteger(amount) || amount < 0) message = "Nominal penyesuaian harus berupa bilangan bulat nol atau lebih.";
          else if (amount > 0 && (!bill || amount > billBalance(bill) || !values.adjustmentReason.trim())) message = "Pilih tagihan, masukkan alasan, dan pastikan penyesuaian tidak melebihi sisa piutang.";
          else {
            const leaseId = person.leaseId || person.id;
            const members = activeTenants().filter(item => (item.leaseId || item.id) === leaseId);
            members.forEach(member => { member.status = "ended"; member.endDate = endDate; });
            const assignedRoom = room(person.roomId);
            if (assignedRoom && !roomOccupants(assignedRoom.id).length) assignedRoom.availabilityConfirmed = true;
            if (amount > 0) {
              const adjustment = { id: newId(), billId: bill.id, leaseId, tenantId: person.id, amount, date: endDate, reason: values.adjustmentReason.trim() };
              const balanceBefore = billBalance(bill);
              data.adjustments.push(adjustment);
              audit("bill", bill.id, "adjusted", adjustment.reason, { balance: balanceBefore }, { adjustmentAmount: amount, balance: balanceBefore - amount });
            }
            audit("lease", leaseId, "ended", "", { members: members.length, status: "active" }, { members: members.length, status: "ended", endDate });
          }
        } else if (type === "deposit-allocation") {
          const deposit = data.payments.find(item => item.id === values.sourceDepositId && item.disposition === "deposit");
          const bill = data.bills.find(item => item.id === values.billId);
          const amount = Number(values.amount);
          if (!deposit || !bill || (bill.leaseId || bill.tenantId) !== (deposit.leaseId || deposit.tenantId) || !values.date || values.date > todayISO()) message = "Pilih tagihan milik penyewa yang sama dan tanggal alokasi yang valid.";
          else if (!Number.isSafeInteger(amount) || amount < 1 || amount > depositRemaining(deposit) || amount > billBalance(bill)) message = "Nominal alokasi harus sesuai saldo deposit dan sisa tagihan.";
          else {
            const allocation = {
              id: newId(), billId: bill.id, leaseId: deposit.leaseId, tenantId: deposit.tenantId,
              tenantName: deposit.tenantName, roomName: bill.roomName, month: bill.month,
              date: values.date, method: "deposit", amount, appliedAmount: amount, excessAmount: 0,
              sourceDepositId: deposit.id, note: "Alokasi deposit ke tagihan."
            };
            data.payments.push(allocation);
            audit("payment", bill.id, "received", allocation.note, null, { amount, date: values.date, source: "deposit" });
            if (billBalance(bill) <= 0) bill.paidAt = values.date;
          }
        } else if (type === "payment") {
          const bill = data.bills.find(item => item.id === values.billId);
          const amount = Number(values.amount);
          if (!bill || !Number.isSafeInteger(amount) || amount < 1 || !values.date || !["tunai", "transfer"].includes(values.method)) message = "Lengkapi tanggal, nominal, dan metode pembayaran yang valid.";
          else if (values.date > todayISO()) message = "Tanggal pembayaran tidak boleh di masa depan.";
          else if (amount > billBalance(bill) && !["deposit", "refund", "revenue"].includes(values.disposition)) message = "Pilih perlakuan untuk kelebihan pembayaran.";
          else {
            const appliedAmount = Math.min(amount, billBalance(bill));
            const excessAmount = amount - appliedAmount;
            const person = tenant(bill.tenantId);
            data.payments.push({
              id: newId(), billId: bill.id, leaseId: bill.leaseId, tenantId: bill.tenantId,
              tenantName: bill.tenantName || person?.name || "Penyewa dihapus", roomName: bill.roomName,
              month: bill.month, date: values.date, method: values.method, amount, appliedAmount,
              excessAmount, disposition: excessAmount ? values.disposition : null, note: values.note.trim()
            });
            audit("payment", bill.id, "received", values.note.trim(), null, { amount, appliedAmount, excessAmount, disposition: excessAmount ? values.disposition : null, date: values.date });
            if (billBalance(bill) <= 0) bill.paidAt = values.date;
          }
        } else if (type === "tenant") {
          const assignedRoom = room(values.roomId);
          const occupants = roomOccupants(values.roomId).filter(item => item.id !== id);
          const secondary = values.secondary === "yes";
          const devices = new Map();
          for (const [key, value] of formData.entries()) {
            const match = key.match(/^device(Name|Fee)-(\d+)$/);
            if (!match) continue;
            const device = devices.get(match[2]) || {};
            if (match[1] === "Name") device.name = value.trim();
            else device.monthlyFee = value === "" ? null : Number(value);
            devices.set(match[2], device);
          }
          const electronics = Array.from(devices.values()).filter(item => item.name || item.monthlyFee !== null);
          const invalidDevice = electronics.some(item => !item.name || item.monthlyFee === null || !Number.isSafeInteger(item.monthlyFee) || item.monthlyFee < 0);
          const totalFee = electronics.reduce((sum, item) => sum + (item.monthlyFee || 0), 0);
          const leaseFeeTotal = occupants.reduce((sum, item) => sum + electronicCharges(item), 0) + totalFee;
          if (!values.name.trim() || !values.startDate || !assignedRoom) message = "Lengkapi nama, tanggal mulai, dan kamar penyewa.";
          else if (occupants.length >= 2) message = "Kamar tersebut sudah mencapai batas dua penghuni.";
          else if (occupants.length && !secondary && !id) message = "Pilih opsi penghuni kedua agar satu kontak utama tetap menerima tagihan.";
          else if (secondary && !occupants.length) message = "Penghuni kedua harus dihubungkan dengan penyewa utama yang sudah terdaftar.";
          else if (invalidDevice || !Number.isSafeInteger(leaseFeeTotal) || (configuredRent(assignedRoom) && !Number.isSafeInteger(Number(assignedRoom.rent) + leaseFeeTotal))) message = "Lengkapi nominal elektronik yang valid dan pastikan total tagihan tidak melebihi batas perhitungan.";
          else if (id) {
            const person = tenant(id);
            if (person) {
              const previousRoomId = person.roomId;
              Object.assign(person, { name: values.name.trim(), phone: values.phone.trim(), roomId: values.roomId, startDate: values.startDate, electronics });
              const previousRoom = room(previousRoomId);
              if (previousRoom && previousRoomId !== values.roomId && !roomOccupants(previousRoomId).length) previousRoom.availabilityConfirmed = true;
            }
          } else {
            const primary = secondary ? occupants.find(item => item.isPrimary) || occupants[0] : null;
            const tenantId = newId();
            data.tenants.push({
              id: tenantId, leaseId: primary?.leaseId || tenantId, isPrimary: !secondary, peopleCount: 1,
              name: values.name.trim(), phone: values.phone.trim(), roomId: values.roomId, startDate: values.startDate,
              status: "active", electronics
            });
          }
        } else {
          const amount = Number(values.amount);
          if (!values.date || !values.category || !values.note.trim() || !Number.isSafeInteger(amount) || amount < 1) message = "Lengkapi tanggal, kategori, catatan, dan nominal yang valid.";
          else if (id) {
            const expense = data.expenses.find(item => item.id === id);
            if (expense) {
              const before = { ...expense };
              Object.assign(expense, { date: values.date, category: values.category.trim(), note: values.note.trim(), amount });
              audit("expense", id, "updated", "Pengeluaran diedit oleh pemilik.", before, { ...expense });
            }
          } else {
            const expense = { id: newId(), date: values.date, category: values.category.trim(), note: values.note.trim(), amount };
            data.expenses.push(expense);
            audit("expense", expense.id, "created", "", null, { ...expense });
          }
        }
        if (message) {
          const error = document.getElementById("form-error");
          error.textContent = message;
          error.hidden = false;
          return;
        }
        if (persist()) {
          overlay.innerHTML = "";
          toast(type === "expense" ? (id ? "Pengeluaran berhasil diperbarui." : "Pengeluaran berhasil dicatat.") : type === "payment" ? "Pembayaran berhasil dicatat." : type === "deposit-allocation" ? "Deposit berhasil dialokasikan." : type === "lease-end" ? "Masa sewa diakhiri dan penyesuaian dicatat." : type === "tenant" ? "Data penyewa berhasil disimpan." : "Data kamar berhasil disimpan.");
          render();
        }
      }
      document.addEventListener("click", event => {
        const target = event.target.closest("[data-page], [data-action], [data-close-modal]");
        if (!target) return;
        if (target.hasAttribute("data-close-modal")) {
          if (!target.classList.contains("modal-backdrop") || event.target === target) overlay.innerHTML = "";
          return;
        }
        if (target.dataset.action === "add-device") {
          const list = document.getElementById("device-list");
          if (!list) return;
          const indexes = Array.from(list.querySelectorAll("[id^='device-name-']"), input => Number(input.id.slice("device-name-".length)));
          const index = indexes.length ? Math.max(...indexes) + 1 : 0;
          list.insertAdjacentHTML("beforeend", deviceRow({}, index));
          list.querySelector(`#device-name-${index}`).focus();
          return;
        }
        if (target.dataset.action === "remove-device") {
          target.closest(".device-row")?.remove();
          return;
        }
        if (target.dataset.page) { setPage(target.dataset.page); return; }
        if (target.dataset.action) handleAction(target.dataset.action, target.dataset.id);
      });
      document.addEventListener("submit", event => {
        if (!["entry-form", "settings-form"].includes(event.target.id)) return;
        event.preventDefault();
        handleFormSubmit(event.target);
      });
      document.addEventListener("input", event => {
        if (event.target.id === "search-input") {
          query = event.target.value;
          const position = event.target.selectionStart;
          render();
          const next = document.getElementById("search-input");
          if (next) { next.focus(); next.setSelectionRange(position, position); }
        }
      });
      document.addEventListener("change", event => {
        if (event.target.id === "backup-file") {
          const [file] = event.target.files || [];
          if (file) void importBackup(file);
          event.target.value = "";
        } else if (["month-picker", "page-month-picker", "report-month-picker", "payment-month-picker"].includes(event.target.id) && /^\d{4}-\d{2}$/.test(event.target.value)) {
          selectedMonth = event.target.value;
          render();
        } else if (event.target.id === "room-floor-filter") {
          dashboardFloor = event.target.value;
          render();
        } else if (event.target.id === "room-status-filter") {
          dashboardRoomStatus = event.target.value;
          render();
        } else if (event.target.id === "tenant-room") {
          const currentId = document.getElementById("entry-form")?.dataset.id;
          const occupants = roomOccupants(event.target.value).filter(item => item.id !== currentId);
          const option = document.getElementById("secondary-occupancy-field");
          if (option) option.hidden = occupants.length === 0;
          if (!occupants.length) {
            const checkbox = document.querySelector('input[name="secondary"]');
            if (checkbox) checkbox.checked = false;
          }
        }
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape") overlay.innerHTML = "";
      });
      document.querySelectorAll("[data-icon]").forEach(node => { node.innerHTML = icon(node.dataset.icon); });
      window.addEventListener("kos-install-available", () => {
        installPrompt = window.kosInstallPrompt || null;
        const button = document.querySelector(".install-button");
        if (button) button.hidden = !installPrompt;
      });
      window.addEventListener("appinstalled", () => {
        installPrompt = null;
        window.kosInstallPrompt = null;
        const button = document.querySelector(".install-button");
        if (button) button.hidden = true;
        toast("Kos Pak Gunawan berhasil dipasang.");
      });
      const installButton = document.querySelector(".install-button");
      if (installButton) installButton.hidden = !installPrompt;
      render();
      if (window.KosCloud) window.KosCloud.save(data);
    })();
