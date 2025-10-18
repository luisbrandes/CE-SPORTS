// ========================================
// 🌐 CE Sports - Script Unificado (v2.2)
// Compatível com todas as páginas (adm, aluno e visitante)
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

  // ----- LOGIN E REDIRECIONAMENTO -----
  window.loginAs = function (role) {
    localStorage.role = role;
    localStorage.greeting =
      "Bem-vindo, " + (role === "Administrador" ? "Administrador!" : "Aluno!");
    if (role === "Administrador") {
      location.href = "../adm-pages/index-adm.html";
    } else if (role === "Aluno") {
      location.href = "../aluno-pages/index-aluno.html";
    } else {
      location.href = "../index.html";
    }
  };

  // Login rápido (detecta se o email contém "adm")
  window.doQuickLogin = function (email) {
    const role =
      email && email.toLowerCase().includes("adm")
        ? "Administrador"
        : "Aluno";
    loginAs(role);
  };

  // Logout
  window.logout = function () {
    localStorage.role = "Visitante";
    localStorage.greeting = "";
    location.href = "../index.html";
  };

  // Restringe acesso às páginas certas
  window.ensureRole = function (allowed) {
    if (typeof allowed === "string") allowed = [allowed];
    const role = localStorage.role || "Visitante";
    if (!allowed.includes(role)) {
      if (role === "Visitante") location.href = "../index.html";
      else if (role === "Administrador")
        location.href = "../adm-pages/index-adm.html";
      else location.href = "../aluno-pages/index-aluno.html";
    }
  };

  // Inicialização ao carregar
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme();

    // Atualiza mensagem de boas-vindas
    const greeting = localStorage.greeting || "";
    document
      .querySelectorAll(".greeting")
      .forEach((el) => (el.textContent = greeting));

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
// 👤 FUNÇÕES DE LOGIN RÁPIDO
// =========================
function loginAluno() {
  window.location.href = "../aluno-pages/index-aluno.html";
}

function loginAdmin() {
  window.location.href = "../adm-pages/index-adm.html";
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

function logout() {
  // Aqui você pode adicionar lógica adicional se necessário
  // como limpar localStorage, sessionStorage, etc.

  // Redireciona para a página inicial
  window.location.href = '../index.html';
}

// Simulação das ações dos botões
document.querySelectorAll('.btn-editar').forEach(btn => {
  btn.addEventListener('click', () => alert('Função de edição em desenvolvimento!'));
});

document.querySelectorAll('.btn-deletar').forEach(btn => {
  btn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja excluir este projeto esportivo?')) {
      btn.closest('.card-campeonato').remove();
    }
  });
});


// Interação com as estrelas
const estrelasContainers = document.querySelectorAll('.estrelas');

estrelasContainers.forEach(container => {
  const estrelas = container.querySelectorAll('span');

  estrelas.forEach((estrela, index) => {
    estrela.addEventListener('mouseover', () => {
      estrelas.forEach((e, i) => e.classList.toggle('hover', i <= index));
    });

    estrela.addEventListener('mouseleave', () => {
      estrelas.forEach(e => e.classList.remove('hover'));
    });

    estrela.addEventListener('click', () => {
      container.dataset.avaliacao = index + 1;
      estrelas.forEach((e, i) => e.classList.toggle('selecionada', i <= index));
    });
  });
});

// Botão de enviar
document.querySelectorAll('.btn-avaliar').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card-proposta');
    const avaliacao = card.querySelector('.estrelas').dataset.avaliacao;
    if (avaliacao === "0") {
      alert("Por favor, selecione uma avaliação antes de enviar!");
    } else {
      alert(`Avaliação enviada com sucesso! ⭐ ${avaliacao}/5`);
    }
  });
});

 // Simulação das ações do administrador
    document.querySelectorAll('.btn-aprovar').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card-avaliar');
        card.classList.add('aprovado');
        alert('✅ Projeto aprovado com sucesso!');
      });
    });

    document.querySelectorAll('.btn-recusar').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card-avaliar');
        card.classList.add('recusado');
        alert('❌ Projeto recusado.');
      });
    });

