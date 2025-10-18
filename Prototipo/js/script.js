// ========================================
// 🌐 CE Sports - Script Unificado (v2.4)
// ========================================

(function () {
  // ----- CONFIGURAÇÕES INICIAIS -----
  if (!localStorage.theme) localStorage.theme = "light";
  if (!localStorage.role) localStorage.role = "Visitante";

  // Aplica o tema salvo
  function applyTheme() {
    const theme = localStorage.theme || "light";
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("themeToggleBtn");
    if (btn) btn.textContent = theme === "dark" ? "🌙" : "🌞";
  }

  // Alterna entre claro e escuro
  window.toggleTheme = function () {
    localStorage.theme = localStorage.theme === "dark" ? "light" : "dark";
    applyTheme();
  };

  // Redireciona para página de login com tipo específico
  window.redirectToLogin = function (type) {
    localStorage.setItem('loginType', type);
    window.location.href = 'login.html';
  };

  // Processa o login após autenticação
  window.handleLogin = function (email, password) {
    const loginType = localStorage.getItem('loginType') || 'aluno';
    
    // Simulação de autenticação
    if (email && password) {
      if (loginType === 'admin') {
        loginAs('Administrador');
      } else {
        loginAs('Aluno');
      }
      return true;
    }
    return false;
  };

  // ----- LOGIN E REDIRECIONAMENTO -----
  window.loginAs = function (role) {
    localStorage.role = role;
    localStorage.greeting = "Bem-vindo, " + (role === "Administrador" ? "Administrador!" : "Aluno!");
    localStorage.removeItem('loginType'); // Limpa o tipo após login
    
    if (role === "Administrador") {
      window.location.href = "adm-pages/index-adm.html";
    } else if (role === "Aluno") {
      window.location.href = "aluno-pages/index-aluno.html";
    } else {
      window.location.href = "index.html";
    }
  };

  // Logout
  window.logout = function () {
    localStorage.role = "Visitante";
    localStorage.greeting = "";
    window.location.href = "index.html";
  };

  // Restringe acesso às páginas certas
  window.ensureRole = function (allowed) {
    if (typeof allowed === "string") allowed = [allowed];
    const role = localStorage.role || "Visitante";
    if (!allowed.includes(role)) {
      if (role === "Visitante") window.location.href = "index.html";
      else if (role === "Administrador") window.location.href = "adm-pages/index-adm.html";
      else window.location.href = "aluno-pages/index-aluno.html";
    }
  };

  // Inicialização ao carregar
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme();

    // Atualiza mensagem de boas-vindas
    const greeting = localStorage.greeting || "";
    document.querySelectorAll(".greeting").forEach((el) => (el.textContent = greeting));

    // Atualiza o papel no header
    const badge = document.getElementById("roleBadge");
    if (badge) badge.textContent = localStorage.role || "Visitante";
  });
})();

// =========================
// 📱 MENU MOBILE
// =========================
const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");
if (menuToggle && navbar) {
  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("show");
  });
}

// =========================
// 🔐 MODAL DE LOGIN
// =========================
const btnLogin = document.getElementById("btnLogin");
const loginModal = document.getElementById("loginModal");
const modalClose = document.getElementById("modalClose");

if (btnLogin && loginModal) {
  btnLogin.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });
}

if (modalClose && loginModal) {
  modalClose.addEventListener("click", () => {
    loginModal.style.display = "none";
  });
}

if (loginModal) {
  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
  });
}

// =========================
// ✨ ANIMAÇÕES FADE-IN
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-in");
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    fadeEls.forEach((el) => observer.observe(el));
  }
});