/* =========================================================
   CI – Creators & Innovators | script.js
   كل الوظائف تعمل محلياً في المتصفح (Client-side) دون أي خادم
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {

    const MOBILE_BREAKPOINT = 1024;
    const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- أدوات مساعدة للتخزين المحلي ---------- */
    const storage = {
        get(key) {
            try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
        },
        set(key, value) {
            try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* التخزين غير متاح */ }
        },
        remove(key) {
            try { localStorage.removeItem(key); } catch (e) { /* التخزين غير متاح */ }
        }
    };

    /* ---------- إشعار سريع (Toast) ---------- */
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    let toastTimer;
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
    }

    /* =====================================================
       1. خلفية الجزيئات (tsParticles)
       ===================================================== */
    if (document.getElementById("tsparticles") && window.tsParticles) {
        const small = window.innerWidth < 700;
        tsParticles.load("tsparticles", {
            fpsLimit: 60,
            particles: {
                number: { value: small ? 70 : 140, density: { enable: true, area: 900 } },
                color: { value: ["#7c3aed", "#a78bfa", "#c9a24a", "#4f46e5"] },
                shape: { type: "circle" },
                opacity: { value: { min: 0.25, max: 0.6 } },
                size: { value: { min: 2, max: 5 } },
                links: {
                    enable: true,
                    distance: 160,
                    color: "#8052ff",
                    opacity: 0.3,
                    width: 1.2
                },
                move: {
                    enable: !reduceMotion,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "out" }
                }
            },
            interactivity: {
                events: {
                    onHover: { enable: !small, mode: "grab" },
                    onClick: { enable: false }
                }
            },
            detectRetina: true
        });
    }

    /* =====================================================
       2. تمييز الرابط النشط حسب الصفحة الحالية
       ===================================================== */
    const page = document.body.dataset.page;
    if (page) {
        document.querySelectorAll('[data-nav="' + page + '"]').forEach(el => el.classList.add("active"));
    }

    /* =====================================================
       3. قائمة الموبايل والقوائم المنسدلة
       ===================================================== */
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links-list");

    function closeMenu() {
        if (!navLinks || !mobileMenu) return;
        navLinks.classList.remove("active");
        mobileMenu.classList.remove("is-active");
        mobileMenu.setAttribute("aria-expanded", "false");
        document.querySelectorAll(".dropdown.open").forEach(d => d.classList.remove("open"));
    }

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener("click", function (e) {
            e.stopPropagation();
            const open = navLinks.classList.toggle("active");
            mobileMenu.classList.toggle("is-active", open);
            mobileMenu.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // على الموبايل: الضغط على عنوان القائمة المنسدلة يفتحها بدلاً من الانتقال
        document.querySelectorAll(".drop-btn").forEach(btn => {
            btn.setAttribute("aria-haspopup", "true");
            btn.addEventListener("click", function (e) {
                if (!isMobile()) return;
                e.preventDefault();
                const parent = btn.closest(".dropdown");
                const willOpen = !parent.classList.contains("open");
                document.querySelectorAll(".dropdown.open").forEach(d => d.classList.remove("open"));
                parent.classList.toggle("open", willOpen);
                btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
            });
        });

        // إغلاق القائمة عند الضغط على أي رابط فعلي
        navLinks.querySelectorAll("a:not(.drop-btn)").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // إغلاق القائمة عند الضغط خارجها
        document.addEventListener("click", function (e) {
            if (navLinks.classList.contains("active") && !e.target.closest(".navbar")) closeMenu();
        });

        window.addEventListener("resize", function () {
            if (!isMobile()) closeMenu();
        });
    }

    /* =====================================================
       4. تسجيل الدخول التجريبي (Mock Login)
       ===================================================== */
    const AUTH_KEY = "ci_auth_user";
    const loginBtn = document.getElementById("login-btn");

    const getUser = () => storage.get(AUTH_KEY);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function nameFromEmail(email) {
        const base = String(email).split("@")[0].replace(/[._-]+/g, " ").trim();
        return base ? base.charAt(0).toUpperCase() + base.slice(1) : "مستخدم";
    }

    // بناء النافذة المنبثقة مرة واحدة
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "login-modal";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button type="button" class="modal-close" aria-label="إغلاق">×</button>

            <div class="login-view">
                <img src="Image1.png" alt="" class="modal-logo">
                <h2 class="modal-title" id="modal-title">تسجيل الدخول</h2>
                <p class="modal-sub">ادخل إلى حسابك لمتابعة طلباتك واستفساراتك لدى CI</p>

                <form class="login-form" novalidate>
                    <div class="form-error" role="alert"></div>

                    <div class="form-group">
                        <label for="login-email">البريد الإلكتروني</label>
                        <input type="email" id="login-email" name="email" placeholder="name@company.com" autocomplete="email" required>
                    </div>

                    <div class="form-group">
                        <label for="login-password">كلمة المرور</label>
                        <div class="password-wrap">
                            <input type="password" id="login-password" name="password" placeholder="6 أحرف على الأقل" autocomplete="current-password" minlength="6" required>
                            <button type="button" class="toggle-pass" aria-label="إظهار كلمة المرور">إظهار</button>
                        </div>
                    </div>

                    <div class="login-row">
                        <label><input type="checkbox" name="remember" checked> تذكّرني</label>
                        <button type="button" class="link-btn forgot-btn">نسيت كلمة المرور؟</button>
                    </div>

                    <button type="submit" class="btn-primary">تسجيل الدخول</button>
                </form>

                <div class="divider">أو</div>

                <button type="button" class="google-btn">
                    <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
                    <span>المتابعة باستخدام Google (تجريبي)</span>
                </button>

                <p class="demo-note">نسخة تجريبية: يتم حفظ حالة الدخول على هذا المتصفح فقط، ولا تُرسل أي بيانات أو تُحفظ كلمة المرور.</p>
            </div>

            <div class="account-view" hidden>
                <div class="account-panel">
                    <div class="account-avatar" aria-hidden="true"></div>
                    <h2 class="modal-title acc-name"></h2>
                    <p class="acc-email"></p>
                    <p class="acc-meta"></p>
                    <div class="account-actions">
                        <a href="contact.html" class="btn-primary">إرسال استفسار جديد</a>
                        <button type="button" class="btn-logout">تسجيل الخروج</button>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const modal = overlay.querySelector(".modal");
    const loginView = overlay.querySelector(".login-view");
    const accountView = overlay.querySelector(".account-view");
    const loginForm = overlay.querySelector(".login-form");
    const errorBox = overlay.querySelector(".form-error");
    const emailInput = overlay.querySelector("#login-email");
    const passInput = overlay.querySelector("#login-password");
    const googleBtn = overlay.querySelector(".google-btn");
    let lastFocused = null;

    function showError(msg, info) {
        errorBox.textContent = msg;
        errorBox.classList.toggle("info", !!info);
        errorBox.classList.add("show");
    }
    function clearError() {
        errorBox.classList.remove("show", "info");
        errorBox.textContent = "";
    }

    function renderAccountView() {
        const user = getUser();
        if (!user) return;
        overlay.querySelector(".account-avatar").textContent = user.name.charAt(0).toUpperCase();
        overlay.querySelector(".acc-name").textContent = "مرحباً، " + user.name;
        overlay.querySelector(".acc-email").textContent = user.email;
        const when = new Date(user.loggedInAt).toLocaleString("ar-JO", { dateStyle: "medium", timeStyle: "short" });
        overlay.querySelector(".acc-meta").textContent =
            (user.provider === "google" ? "تم الدخول عبر Google (تجريبي)" : "تم الدخول بالبريد الإلكتروني") + " — " + when;
    }

    function updateLoginButton() {
        if (!loginBtn) return;
        const user = getUser();
        loginBtn.textContent = "";
        if (user) {
            const avatar = document.createElement("span");
            avatar.className = "user-avatar";
            avatar.textContent = user.name.charAt(0).toUpperCase();
            const label = document.createElement("span");
            label.textContent = "حسابي";
            loginBtn.append(avatar, label);
            loginBtn.setAttribute("aria-label", "حسابي: " + user.name);
        } else {
            loginBtn.textContent = "تسجيل الدخول";
            loginBtn.removeAttribute("aria-label");
        }
    }

    function openModal() {
        lastFocused = document.activeElement;
        closeMenu();
        clearError();
        const loggedIn = !!getUser();
        loginView.hidden = loggedIn;
        accountView.hidden = !loggedIn;
        if (loggedIn) renderAccountView();
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        setTimeout(() => {
            (loggedIn ? overlay.querySelector(".account-actions a") : emailInput).focus();
        }, 50);
    }

    function closeModal() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        loginForm.reset();
        passInput.type = "password";
        overlay.querySelector(".toggle-pass").textContent = "إظهار";
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function completeLogin(user, remember) {
        user.loggedInAt = new Date().toISOString();
        storage.set(AUTH_KEY, user);
        try {
            if (!remember) sessionStorage.setItem("ci_session_only", "1");
            else sessionStorage.removeItem("ci_session_only");
        } catch (e) { /* تجاهل */ }
        updateLoginButton();
        prefillForms();
        closeModal();
        showToast("تم تسجيل الدخول بنجاح. أهلاً " + user.name + "!");
    }

    // إذا اختار المستخدم عدم التذكر، تُمسح الجلسة عند فتح المتصفح من جديد
    try {
        if (getUser() && localStorage.getItem("ci_remember_off") === "1" && !sessionStorage.getItem("ci_session_only")) {
            storage.remove(AUTH_KEY);
            localStorage.removeItem("ci_remember_off");
        }
    } catch (e) { /* تجاهل */ }

    if (loginBtn) loginBtn.addEventListener("click", openModal);

    overlay.querySelector(".modal-close").addEventListener("click", closeModal);
    overlay.addEventListener("mousedown", e => { if (e.target === overlay) closeModal(); });

    document.addEventListener("keydown", function (e) {
        if (!overlay.classList.contains("open")) return;
        if (e.key === "Escape") { closeModal(); return; }
        if (e.key === "Tab") {
            // حصر التنقل بلوحة المفاتيح داخل النافذة
            const focusables = Array.from(modal.querySelectorAll("a[href], button, input"))
                .filter(el => !el.disabled && el.offsetParent !== null);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });

    overlay.querySelector(".toggle-pass").addEventListener("click", function () {
        const show = passInput.type === "password";
        passInput.type = show ? "text" : "password";
        this.textContent = show ? "إخفاء" : "إظهار";
        this.setAttribute("aria-label", show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
    });

    overlay.querySelector(".forgot-btn").addEventListener("click", function () {
        showError("استعادة كلمة المرور غير متاحة في النسخة التجريبية. يُرجى التواصل معنا عبر صفحة «تواصل معنا».", true);
    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        clearError();
        const email = emailInput.value.trim();
        const password = passInput.value;
        if (!emailPattern.test(email)) {
            showError("يُرجى إدخال بريد إلكتروني صحيح.");
            emailInput.focus();
            return;
        }
        if (password.length < 6) {
            showError("كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.");
            passInput.focus();
            return;
        }
        const remember = loginForm.elements.remember.checked;
        try {
            if (remember) localStorage.removeItem("ci_remember_off");
            else localStorage.setItem("ci_remember_off", "1");
        } catch (err) { /* تجاهل */ }
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = "جارٍ تسجيل الدخول...";
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "تسجيل الدخول";
            // لا يتم حفظ كلمة المرور إطلاقاً
            completeLogin({ name: nameFromEmail(email), email: email, provider: "email" }, remember);
        }, 600);
    });

    googleBtn.addEventListener("click", function () {
        clearError();
        googleBtn.disabled = true;
        const label = googleBtn.querySelector("span");
        label.textContent = "جارٍ الاتصال بـ Google...";
        setTimeout(() => {
            googleBtn.disabled = false;
            label.textContent = "المتابعة باستخدام Google (تجريبي)";
            try { localStorage.removeItem("ci_remember_off"); } catch (err) { /* تجاهل */ }
            completeLogin({ name: "Google User", email: "demo.user@gmail.com", provider: "google" }, true);
        }, 900);
    });

    overlay.querySelector(".btn-logout").addEventListener("click", function () {
        storage.remove(AUTH_KEY);
        updateLoginButton();
        closeModal();
        showToast("تم تسجيل الخروج.");
    });

    updateLoginButton();

    /* =====================================================
       5. النماذج: تعبئة تلقائية، إرفاق ملف، رسالة نجاح
       ===================================================== */
    function prefillForms() {
        const user = getUser();
        if (!user) return;
        document.querySelectorAll(".js-form").forEach(form => {
            const email = form.querySelector('input[type="email"]');
            if (email && !email.value) email.value = user.email;
            const name = form.querySelector('[data-prefill="name"]');
            if (name && !name.value && user.provider !== "google") name.value = user.name;
        });
    }
    prefillForms();

    // اختيار نوع الطلب تلقائياً من الرابط (مثال: contact.html?type=small-order)
    const typeParam = new URLSearchParams(window.location.search).get("type");
    if (typeParam) {
        const select = document.getElementById("inquiry-type");
        if (select && select.querySelector('option[value="' + CSS.escape(typeParam) + '"]')) {
            select.value = typeParam;
        }
    }

    // حقل إرفاق الملف: عرض الاسم والتحقق من الحجم (10MB كحد أقصى)
    const MAX_FILE = 10 * 1024 * 1024;
    document.querySelectorAll(".file-drop input[type='file']").forEach(input => {
        const wrap = input.closest(".file-drop");
        const nameEl = wrap.querySelector(".file-name");
        input.addEventListener("change", function () {
            const file = input.files && input.files[0];
            if (!file) { wrap.classList.remove("has-file"); nameEl.textContent = ""; return; }
            if (file.size > MAX_FILE) {
                input.value = "";
                wrap.classList.remove("has-file");
                nameEl.textContent = "";
                showToast("حجم الملف أكبر من 10 ميغابايت.");
                return;
            }
            wrap.classList.add("has-file");
            nameEl.textContent = file.name;
        });
    });

    // الإرسال (محاكاة محلية — يمكن ربطه لاحقاً بخادم أو خدمة نماذج)
    document.querySelectorAll(".js-form").forEach(form => {
        const success = form.querySelector(".form-success");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.disabled = true;
            btn.textContent = "جارٍ الإرسال...";
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = original;
                form.reset();
                form.querySelectorAll(".file-drop").forEach(w => {
                    w.classList.remove("has-file");
                    const n = w.querySelector(".file-name");
                    if (n) n.textContent = "";
                });
                if (success) {
                    success.textContent = form.dataset.success || "تم الإرسال بنجاح.";
                    success.classList.add("show");
                    success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
                }
                prefillForms();
            }, 700);
        });
    });

    /* ---------- سنة حقوق النشر ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});
