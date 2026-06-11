(function () {
  "use strict";

  const SETTINGS_KEY = "mujskoy_admin_settings";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  window.loadAdminSettings = function loadAdminSettings() {
    const settings = {
      storeName: "Sale Market",
      phone: "+998 90 123 45 67",
      deliveryPrice: "30000",
      minOrder: "100000",
      ...readSettings(),
    };

    const fields = {
      settingStoreName: settings.storeName,
      settingPhone: settings.phone,
      settingDeliveryPrice: settings.deliveryPrice,
      settingMinOrder: settings.minOrder,
    };

    Object.entries(fields).forEach(([id, value]) => {
      const input = document.getElementById(id);
      if (input) input.value = value;
    });
  };

  window.saveAdminSettings = function saveAdminSettings() {
    const settings = {
      storeName: document.getElementById("settingStoreName")?.value.trim() || "Sale Market",
      phone: document.getElementById("settingPhone")?.value.trim() || "",
      deliveryPrice: document.getElementById("settingDeliveryPrice")?.value.trim() || "0",
      minOrder: document.getElementById("settingMinOrder")?.value.trim() || "0",
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    const message = document.getElementById("settingsMessage");
    if (message) {
      message.innerHTML = '<div class="empty">Sozlamalar saqlandi.</div>';
    }

    if (typeof window.showNotice === "function") {
      window.showNotice("Sozlamalar saqlandi");
    }
  };

  function filterVisibleOrders(query) {
    const orders = document.querySelectorAll("#ordersList .order-item");
    orders.forEach((item) => {
      const match = !query || item.textContent.toLowerCase().includes(query);
      item.style.display = match ? "" : "none";
    });
  }

  function bindGlobalSearch() {
    const input = document.getElementById("adminGlobalSearch");
    if (!input) return;

    input.addEventListener("input", function () {
      const query = input.value.trim().toLowerCase();
      const productSearch = document.getElementById("productSearch");
      if (productSearch) productSearch.value = query;

      if (!document.getElementById("sectionProducts")?.classList.contains("hidden") && typeof window.renderProducts === "function") {
        window.renderProducts();
      }

      if (!document.getElementById("sectionOrders")?.classList.contains("hidden")) {
        filterVisibleOrders(query);
      }
    });

    input.addEventListener("keydown", function (event) {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (typeof window.showSection === "function") {
        window.showSection("products");
        const productSearch = document.getElementById("productSearch");
        if (productSearch) productSearch.value = input.value.trim().toLowerCase();
        if (typeof window.renderProducts === "function") window.renderProducts();
      }
    });
  }

  function bindNotificationButton() {
    const button = document.querySelector(".admin-icon-btn");
    if (!button) return;
    button.addEventListener("click", function () {
      if (typeof window.showNotice === "function") {
        window.showNotice("Yangi bildirishnoma yo'q");
      }
    });
  }

  function enhanceSectionSwitching() {
    if (typeof window.showSection !== "function" || window.showSection.__adminEnhanced) return;
    const originalShowSection = window.showSection;

    window.showSection = function enhancedShowSection(section) {
      originalShowSection(section);
      const activePanel = document.querySelector("main .panel:not(.hidden)");
      if (activePanel) {
        activePanel.classList.remove("admin-section-active");
        window.requestAnimationFrame(() => activePanel.classList.add("admin-section-active"));
      }
    };

    window.showSection.__adminEnhanced = true;
  }

  ready(function () {
    bindGlobalSearch();
    bindNotificationButton();
    enhanceSectionSwitching();
    window.loadAdminSettings();
  });
})();
