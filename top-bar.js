/* MINAMI STOCK - top-bar.js (4 line top bar + dot menu + Firebase)
   Page-e:  <div id="site-topbar"></div>  ar  <script src="top-bar.js"></script>  */
/* ===== DEBUG: page-er link-er shesh-e ?debug=1 likhle niche status box dekhabe ===== */
(function () {
  if (!/[?&]debug/.test(location.search)) return;
  var d;
  function box(msg, bad) {
    if (!d) {
      d = document.createElement("div");
      d.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;padding:8px 12px;font:12px/1.5 monospace;color:#fff;background:#166534;max-height:40vh;overflow:auto";
      (document.body || document.documentElement).appendChild(d);
    }
    if (bad) d.style.background = "#991b1b";
    d.innerHTML += msg + "<br>";
  }
  window.addEventListener("error", function (e) { box("ERROR: " + e.message + " (" + (e.filename || "").split("/").pop() + ":" + e.lineno + ")", true); });
  document.addEventListener("click", function (e) {
    var t = e.target;
    box("click -> " + t.tagName + "." + (t.className && t.className.baseVal === undefined ? t.className : "") + " | appsDrop show: " + (document.getElementById("appsDrop") ? document.getElementById("appsDrop").classList.contains("show") : "NO appsDrop"));
  }, true);
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
      box("top-bar.js chalu | .top-nav: " + document.querySelectorAll(".top-nav").length + " | #appsBtn: " + document.querySelectorAll("#appsBtn").length +
          " | #appsDrop: " + document.querySelectorAll("#appsDrop").length + " | scripts: " +
          Array.prototype.map.call(document.scripts, function (x) { return (x.src || "").split("/").pop(); }).filter(function (x) { return /top-bar|site-layout|layout-part/.test(x); }).join(", "));
    }, 1200);
  });
})();

(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- HELPERS ---------- */
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m])
    );

  const safeUrl = (u) => {
    try {
      const p = new URL(u, location.href);
      return p.protocol === "https:" || p.protocol === "http:" ? p.href : "";
    } catch { return ""; }
  };

  const LOGO = "https://i.ibb.co.com/N51GvDS/1000032434-removebg-preview.png";
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const act = (href) => (current === String(href).split("?")[0].toLowerCase() ? ' class="active"' : "");

  /* ---------- MENU DATA ---------- */
  const appsLinks = [
    ["index.html", "fa-house", "Home"],
    ["stock-photo.html", "fa-image", "Stock Photos"],
    ["shop.html", "fa-bag-shopping", "Shop"],
    ["tools.html", "fa-screwdriver-wrench", "All Tools"],
    ["image-generator.html", "fa-wand-magic-sparkles", "AI Generator"],
    ["upload.html", "fa-cloud-arrow-up", "Upload"],
    ["dashboard.html", "fa-gauge", "Dashboard"],
    ["account.html", "fa-user", "Account"],
    ["about.html", "fa-circle-info", "About"],
    ["privacy.html", "fa-shield-halved", "Privacy"]
  ];

  const imgTools = [
    ["image-inhancer.html", "fa-wand-magic-sparkles", "Image Enhancer"],
    ["upscaler.html", "fa-up-right-and-down-left-from-center", "Upscaler"],
    ["converter.html", "fa-right-left", "Converter"],
    ["image-to-pdf.html", "fa-file-image", "Image to PDF"],
    ["qr-code.html", "fa-qrcode", "QR Code"]
  ];

  const textTools = [
    ["text-to-pdf.html", "fa-file-pdf", "Text to PDF"],
    ["word-counter.html", "fa-font", "Word Counter"],
    ["calculator.html", "fa-calculator", "Calculator"],
    ["age-calculator.html", "fa-cake-candles", "Age Calculator"]
  ];

  /* ★★★ LINE 2 - sub bar (Vlog যুক্ত করা হয়েছে Dashboard-এর নিচে) ★★★ */
  const subLinks = [
    ["portfolio.html", "fa-briefcase", "Portfolio"],
    ["dashboard.html", "fa-gauge", "Dashboard"],
    ["vlog-video.html", "fa-video", "Vlog"],
    ["upload.html", "fa-cloud-arrow-up", "Upload"],
    ["tools.html", "fa-screwdriver-wrench", "All Tools"],
    ["stock-photo.html", "fa-image", "Stock Photos"],
    ["image-generator.html", "fa-wand-magic-sparkles", "AI Generator"]
  ];

  /* LINE 3/4 - photo-stock keywords / categories */
  const keywordLinks = [
    ["stock-photo.html?cat=Trending", "fa-fire", "Trending"],
    ["stock-photo.html?cat=Nature", "fa-leaf", "Nature"],
    ["stock-photo.html?cat=Business", "fa-briefcase", "Business"],
    ["stock-photo.html?cat=Technology", "fa-microchip", "Technology"],
    ["stock-photo.html?cat=People", "fa-users", "People"],
    ["stock-photo.html?cat=Food", "fa-utensils", "Food"],
    ["stock-photo.html?cat=AI%20Generated", "fa-robot", "AI Generated"],
    ["stock-photo.html?cat=Animals", "fa-paw", "Animals"],
    ["stock-photo.html?cat=Sports", "fa-basketball", "Sports"],
    ["stock-photo.html?cat=Travel", "fa-plane", "Travel"],
    ["stock-photo.html?cat=Mockups", "fa-mobile-screen", "Mockups"],
    ["stock-photo.html?cat=Backgrounds", "fa-layer-group", "Backgrounds"],
    ["stock-photo.html?cat=Abstract", "fa-shapes", "Abstract"],
    ["stock-photo.html?cat=City", "fa-city", "City"],
    ["stock-photo.html?cat=Architecture", "fa-building", "Architecture"],
    ["stock-photo.html?cat=Fashion", "fa-shirt", "Fashion"],
    ["stock-photo.html?cat=Health", "fa-heart-pulse", "Health"],
    ["stock-photo.html?cat=Education", "fa-graduation-cap", "Education"],
    ["stock-photo.html?cat=Music", "fa-music", "Music"],
    ["stock-photo.html?cat=Cars", "fa-car", "Cars"],
    ["stock-photo.html?cat=Festival", "fa-champagne-glasses", "Festival"],
    ["stock-photo.html?cat=Space", "fa-user-astronaut", "Space"],
    ["stock-photo.html?cat=Flowers", "fa-seedling", "Flowers"],
    ["stock-photo.html?cat=Textures", "fa-border-all", "Textures"],
    ["stock-photo.html?cat=Posters", "fa-rectangle-ad", "Posters"],
    ["stock-photo.html?cat=Illustrations", "fa-pen-nib", "Illustrations"],
    ["stock-photo.html?cat=Icons", "fa-icons", "Icons"],
    ["stock-photo.html?cat=3D", "fa-cube", "3D"],
    ["stock-photo.html?cat=Typography", "fa-font", "Typography"],
    ["stock-photo.html?cat=Night", "fa-moon", "Night"]
  ];

  appsLinks.push(...imgTools, ...textTools);

  const mk = (arr, withActive) =>
    arr.map((l) =>
      '<a href="' + esc(l[0]) + '"' + (withActive === false ? "" : act(l[0])) +
      '><i class="fa-solid ' + esc(l[1]) + '"></i>' + esc(l[2]) + "</a>"
    ).join("");

  const splitRows = (arr) => {
    const h = Math.ceil(arr.length / 2);
    return [arr.slice(0, h), arr.slice(h)];
  };
  const kwRows = splitRows(keywordLinks);

  /* MENU 1 (3-dot): pages up to Stock Photos */
  const pagesLinks = subLinks.slice(0, 5); 

  /* ---------- HTML ---------- */
  /* ★ এখান থেকে sidebarMenu এবং toolsMenu ব্লক দুটি রিমুভ করা হয়েছে ★ */
  const html = `
<header class="top-nav">
  <div class="in">

    <!-- ===== DOT MENU (left of logo) ===== -->
    <div class="dot-menu" id="dotMenu">
      <button class="dot-trigger" id="dotBtn" type="button"
              aria-label="Pages" aria-haspopup="true" aria-expanded="false">
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
      <div class="dot-dropdown" id="dotDrop">${mk(pagesLinks)}</div>
    </div>

    <a class="logo-container" href="index.html">
      <img class="site-logo" src="${esc(LOGO)}" alt="MINAMI STOCK" onerror="this.onerror=null;this.src='logo.png'">
      <span class="logo-text">MINAMI STOCK</span>
    </a>

    <div class="nav-right">
      <a class="shop-logo-btn" href="shop.html"><i class="fa-solid fa-bag-shopping"></i><span>Shop</span></a>

      <div class="auth-buttons" id="guestBox">
        <a class="btn-account" href="login.html" aria-label="Account"><i class="fa-solid fa-circle-user"></i></a>
        <a class="btn-signin" href="login.html">Sign in</a>
        <a class="btn-signup" href="register.html">Sign up</a>
      </div>

      <div class="account-wrapper" id="userBox">
        <button class="account-avatar" id="avatarBtn" type="button"
                aria-label="Account menu" aria-haspopup="true" aria-expanded="false">U</button>
        <div class="account-dropdown" id="acctDrop">
          <div class="account-header">
            <div class="account-avatar-large" id="ddAv">U</div>
            <div class="account-info">
              <div class="account-name" id="ddName"></div>
              <div class="account-email" id="ddEmail"></div>
            </div>
          </div>
          <div class="account-divider"></div>
          <a class="account-menu-item" href="account.html"><i class="fa-solid fa-user"></i>My Account</a>
          <a class="account-menu-item" href="dashboard.html"><i class="fa-solid fa-gauge"></i>Dashboard</a>
          <a class="account-menu-item" href="vlog-video.html"><i class="fa-solid fa-video"></i>Vlog</a>
          <a class="account-menu-item" href="upload.html"><i class="fa-solid fa-cloud-arrow-up"></i>Upload</a>
          <div class="account-divider"></div>
          <button class="account-menu-item" id="logoutBtn" type="button"><i class="fa-solid fa-right-from-bracket"></i>Sign out</button>
        </div>
      </div>
    </div>
  </div>
</header>`;

  /* ---------- STYLES ---------- */
  function injectStyles() {
    if (!document.querySelector('link[href*="font-awesome"],link[href*="fontawesome"]')) {
      const pre1 = document.createElement("link");
      pre1.rel = "preconnect";
      pre1.href = "https://cdnjs.cloudflare.com";
      document.head.appendChild(pre1);

      const fa = document.createElement("link");
      fa.rel = "stylesheet";
      fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(fa);
    }

    const style = document.createElement("style");
    style.textContent = `
:root{--nav-h:60px}
.top-nav{
  position:sticky;top:0;z-index:1000;width:100%;box-sizing:border-box;
  background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.08);
  font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;
}
.top-nav .in{
  display:flex;align-items:center;justify-content:flex-start;gap:12px;
  width:100%;max-width:none;box-sizing:border-box;
  height:var(--nav-h);padding:0 16px;
}

/* ===== SHARED BUTTONS (dot trigger) ===== */
.dot-menu{position:relative;flex:none}
.dot-trigger{
  width:38px;height:38px;border-radius:10px;
  display:grid;place-items:center;cursor:pointer;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.12);
  color:#60a5fa;font-size:16px;transition:.2s;
}
.dot-trigger:hover{border-color:#fbbf24;color:#fbbf24}

/* ===== DROPDOWNS (dot) ===== */
.dot-dropdown{
  display:none;position:absolute;left:0;top:46px;
  max-height:80vh;overflow-y:auto;
  background:#0a0a0a;border:1px solid rgba(255,255,255,0.1);
  border-radius:12px;padding:6px;
  box-shadow:0 14px 34px rgba(0,0,0,.8);z-index:9999;
  width:220px;
}
.dot-dropdown.show{display:block}

.dot-dropdown a{
  display:flex;align-items:center;gap:12px;
  padding:11px 12px;border-radius:8px;
  font-size:14px;font-weight:600;
  color:#cbd5e1;text-decoration:none;
}
.dot-dropdown a:hover{background:rgba(251,191,36,0.1);color:#fbbf24}
.dot-dropdown a.active{
  background:rgba(251,191,36,0.12);
  box-shadow:inset 3px 0 #fbbf24;
  color:#fbbf24;
}
.dot-dropdown i{width:18px;text-align:center;color:#64748b;font-size:14px}
.dot-dropdown a:hover i,
.dot-dropdown a.active i{color:#fbbf24}

/* LOGO */
.logo-container{
  display:flex;align-items:center;gap:8px;
  font-weight:800;font-size:16px;white-space:nowrap;
  color:#fff;text-decoration:none;min-width:0;
}
.logo-text{
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
  background:linear-gradient(90deg,#fff,#fbbf24);
  -webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
}
.site-logo{width:32px;height:32px;object-fit:contain;flex:none}

/* RIGHT SIDE */
.nav-right{margin-left:auto;display:flex;align-items:center;gap:8px;flex:none}
.shop-logo-btn{
  display:flex;align-items:center;gap:7px;
  padding:8px 14px;border-radius:20px;
  font-weight:700;font-size:13.5px;
  background:rgba(251,191,36,0.12);
  border:1px solid rgba(251,191,36,0.3);
  color:#fbbf24;text-decoration:none;white-space:nowrap;
  transition:.2s;
}
.shop-logo-btn:hover{background:#fbbf24;color:#0a1628}

.auth-buttons{display:flex;align-items:center;gap:6px}
.btn-account{font-size:24px;color:#fbbf24;display:grid;place-items:center;text-decoration:none}
.btn-account:hover{color:#f59e0b}
.btn-signin,.btn-signup{
  padding:7px 16px;border-radius:20px;font-weight:700;font-size:13.5px;
  display:inline-block;text-align:center;text-decoration:none;
  white-space:nowrap;transition:.2s;
}
.btn-signin{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.15);
  color:#fff;
}
.btn-signin:hover{background:rgba(255,255,255,0.12);border-color:#fbbf24;color:#fbbf24}
.btn-signup{background:#fbbf24;border:1px solid #fbbf24;color:#0a1628}
.btn-signup:hover{background:#f59e0b}

/* ACCOUNT */
.account-wrapper{display:none;position:relative}
.account-wrapper.show{display:block}
.account-avatar{
  width:36px;height:36px;border-radius:50%;
  border:2px solid rgba(255,255,255,0.15);
  background:#1a1a1a;
  display:grid;place-items:center;overflow:hidden;
  font-weight:700;font-size:14px;padding:0;cursor:pointer;color:#fff;
}
.account-avatar:hover{border-color:#fbbf24}
.account-avatar img{width:100%;height:100%;object-fit:cover}
.account-dropdown{
  display:none;position:absolute;right:0;top:46px;
  width:270px;max-width:calc(100vw - 24px);
  background:#0a0a0a;border:1px solid rgba(255,255,255,0.1);
  border-radius:12px;padding:8px;
  box-shadow:0 14px 34px rgba(0,0,0,.8);z-index:9999;
}
.account-dropdown.show{display:block}
.account-header{display:flex;align-items:center;gap:12px;padding:10px}
.account-avatar-large{
  width:44px;height:44px;border-radius:50%;
  background:#fbbf24;color:#0a1628;
  display:grid;place-items:center;
  font-weight:700;font-size:18px;overflow:hidden;flex:none;
}
.account-avatar-large img{width:100%;height:100%;object-fit:cover}
.account-info{min-width:0;flex:1}
.account-name{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#fff}
.account-email{font-size:12px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.account-divider{height:1px;background:rgba(255,255,255,0.08);margin:6px 4px}
.account-menu-item{
  display:flex;align-items:center;gap:10px;
  width:100%;padding:10px 12px;border:0;background:none;
  border-radius:8px;font-size:14px;font-weight:600;
  text-align:left;cursor:pointer;color:#cbd5e1;text-decoration:none;
  transition:.15s;
}
.account-menu-item:hover{background:rgba(251,191,36,0.1);color:#fbbf24}
.account-menu-item i{width:18px;text-align:center;color:#64748b}
.account-menu-item:hover i{color:#fbbf24}

/* SUB BAR */
.sub-bar{
  position:relative;z-index:999;
  background:#0a0a0a;border-bottom:1px solid rgba(255,255,255,0.08);
  font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif;
}
.sub-bar-in{
  display:flex;align-items:center;gap:6px;
  padding:8px 16px;overflow-x:auto;white-space:nowrap;
  scrollbar-width:none;
}
.sub-bar-in::-webkit-scrollbar{display:none}
.sub-bar a{
  display:inline-flex;align-items:center;gap:7px;flex:none;
  padding:7px 14px;border-radius:20px;
  font-size:13px;font-weight:600;
  color:#cbd5e1;text-decoration:none;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  transition:.2s;
}
.sub-bar-tools{background:#070707}
.sub-bar a i{font-size:12px;color:#64748b}
.sub-bar a:hover,
.sub-bar a.active{
  background:rgba(251,191,36,0.12);
  border-color:rgba(251,191,36,0.4);
  color:#fbbf24;
}
.sub-bar a:hover i,
.sub-bar a.active i{color:#fbbf24}

/* RESPONSIVE */
@media (max-width:900px){
  .shop-logo-btn span{display:none}
  .shop-logo-btn{padding:8px 11px}
}
@media (max-width:640px){
  :root{--nav-h:54px}
  .top-nav .in{padding:0 10px;height:54px;gap:8px}
  .logo-text{font-size:14px;max-width:120px}
  .site-logo{width:28px;height:28px}
  .btn-signin{display:none}
  .btn-signup{padding:7px 12px;font-size:13px}
  .dot-trigger{width:36px;height:36px}
  .sub-bar-in{padding:7px 10px}
  .sub-bar a{padding:6px 12px;font-size:12.5px}
}
@media (max-width:420px){
  .logo-text{display:none}
  .btn-account{font-size:22px}
  .account-avatar{width:34px;height:34px}
}
`;
    document.head.appendChild(style);
  }

  /* ---------- FIREBASE (v8) ---------- */
  const FB_CONFIG = {
    apiKey: "AIzaSyAzWwbk-Dh1Kzzp9CvNyqC28ToCWXw41Qs",
    authDomain: "creoverse-stock.firebaseapp.com",
    projectId: "creoverse-stock",
    storageBucket: "creoverse-stock.firebasestorage.app",
    messagingSenderId: "128072247505",
    appId: "1:128072247505:web:47e58c3a140f4e858bbdf0"
  };

  function loadJs(src, cb) {
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => cb();
    el.onerror = () => { console.warn("[top-bar] load hoy nai:", src); cb(); };
    document.head.appendChild(el);
  }

  function ensureFirebase(done) {
    const base = "https://www.gstatic.com/firebasejs/8.10.1/";
    const steps = [];
    if (!window.firebase) steps.push("firebase-app.js");
    if (!window.firebase || !firebase.auth) steps.push("firebase-auth.js");
    if (!window.firebase || !firebase.firestore) steps.push("firebase-firestore.js");
    (function next() {
      if (steps.length) return loadJs(base + steps.shift(), next);
      try {
        if (window.firebase && !firebase.apps.length) firebase.initializeApp(FB_CONFIG);
      } catch (e) { console.warn("[top-bar] Firebase init:", e); }
      done();
    })();
  }

  function wireEvents() {
    const dotBtn  = document.getElementById("dotBtn");
    const dotDrop = document.getElementById("dotDrop");

    const avatarBtn = document.getElementById("avatarBtn");
    const acctDrop  = document.getElementById("acctDrop");

    function closeAll(except) {
      if (dotDrop && dotDrop !== except) {
        dotDrop.classList.remove("show");
        if (dotBtn) dotBtn.setAttribute("aria-expanded", "false");
      }
      if (acctDrop && acctDrop !== except) {
        acctDrop.classList.remove("show");
        if (avatarBtn) avatarBtn.setAttribute("aria-expanded", "false");
      }
    }

    function bind(btn, drop) {
      if (!btn || !drop) return;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !drop.classList.contains("show");
        closeAll(drop);
        drop.classList.toggle("show", willOpen);
        drop.style.left = "";
        if (willOpen) {
          const r = drop.getBoundingClientRect();
          const over = r.right - (window.innerWidth - 8);
          if (over > 0) drop.style.left = (-over) + "px";
        }
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    }

    bind(dotBtn, dotDrop);
    bind(avatarBtn, acctDrop);

    document.addEventListener("click", (e) => {
      if (e.target.closest(".dot-menu")) return;
      if (e.target.closest("#userBox")) return;
      closeAll();
    });

    // ESC key closes all menus
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (window.firebase && firebase.auth) {
          firebase.auth().signOut()
            .then(() => { location.href = "index.html"; })
            .catch(() => { location.href = "index.html"; });
        } else {
          location.href = "index.html";
        }
      });
    }
  }

  function loadFirebaseAuth() {
    if (!window.firebase || !firebase.auth) return;
    try {
      firebase.auth().onAuthStateChanged((u) => {
        const guest   = document.getElementById("guestBox");
        const userBox = document.getElementById("userBox");
        if (!guest || !userBox) return;

        if (u) {
          guest.style.display = "none";
          userBox.style.display = "block";
          userBox.classList.add("show");

          const n = u.displayName || (u.email || "U").split("@")[0];
          document.getElementById("ddName").textContent = n;
          document.getElementById("ddEmail").textContent = u.email || "";

          const initial = (n[0] || "U").toUpperCase();
          const imgUrl  = u.photoURL ? safeUrl(u.photoURL) : "";
          const face    = imgUrl ? '<img src="' + esc(imgUrl) + '" alt="">' : esc(initial);

          document.getElementById("avatarBtn").innerHTML = face;
          document.getElementById("ddAv").innerHTML      = face;
        } else {
          guest.style.display = "flex";
          userBox.style.display = "none";
          userBox.classList.remove("show");
        }
      });
    } catch (e) {
      console.warn("[top-bar] Firebase error:", e);
    }
  }

  ready(function () {
    if (document.querySelector(".top-nav")) return; // already added
    const target = document.getElementById("site-topbar");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const frag = document.createDocumentFragment();
    while (wrapper.firstElementChild) frag.appendChild(wrapper.firstElementChild);

    if (target) target.replaceWith(frag);
    else document.body.insertBefore(frag, document.body.firstChild);

    injectStyles();
    wireEvents();
    ensureFirebase(function () {
      loadFirebaseAuth();
    });
  });
})();