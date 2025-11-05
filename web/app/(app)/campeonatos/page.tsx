import React, { useState } from 'react';

const Campeonatos: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const redirectToLogin = (type: string) => {
    if (type === 'aluno') {
      window.location.href = '/login/aluno';
    } else {
      window.location.href = '/login/admin';
    }
  };

  return (
    <div>
      <header>
        <div className="logo">CE Sports</div>
        <span className="menu-toggle" id="menuToggle">☰</span>
        <nav id="navbar">
          <a href="index.html">Home</a>
          <a href="projetos.html">Projetos</a>
          <a href="noticias.html">Notícias</a>
          <button className="btn-login" id="btnLogin" onClick={() => setModalOpen(true)}>Login</button>
        </nav>
      </header>

      <main className="main-content fade-in">
        <button className="btn-voltar" onClick={() => window.location.href = 'index.html'}>← Voltar à Home</button>
        <h1 className="page-title">Campeonatos em Andamento</h1>

        <section className="preview-cards">
          <div className="preview-card">
            <h3>Copa Caloura 2025</h3>
            <p>Campeonato entre turmas de primeiro ano. Próxima partida: Informática x Eletrotécnica.</p>
            <button className="btn-outline">Ver Detalhes</button>
          </div>
          <div className="preview-card">
            <h3>Interturmas 2025</h3>
            <p>Times de todos os cursos disputando o título de melhor equipe do campus.</p>
            <button className="btn-outline">Ver Detalhes</button>
          </div>
        </section>

        <h2 className="page-subtitle">Tabela de Classificação - Copa Caloura</h2>
        <table className="tabela-classificacao">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Equipe</th>
              <th>Pontos</th>
              <th>Vitórias</th>
              <th>Derrotas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1º</td>
              <td>Informática</td>
              <td>12</td>
              <td>4</td>
              <td>0</td>
            </tr>
            <tr>
              <td>2º</td>
              <td>Eletrotécnica</td>
              <td>9</td>
              <td>3</td>
              <td>1</td>
            </tr>
            <tr>
              <td>3º</td>
              <td>Mecânica</td>
              <td>6</td>
              <td>2</td>
              <td>2</td>
            </tr>
            <tr>
              <td>4º</td>
              <td>Edificações</td>
              <td>3</td>
              <td>1</td>
              <td>3</td>
            </tr>
          </tbody>
        </table>
      </main>

      {modalOpen && (
        <div className="modal" id="loginModal">
          <div className="modal-content">
            <button className="modal-close" id="modalClose" onClick={() => setModalOpen(false)}>×</button>
            <h2>Login</h2>
            <p>Escolha seu tipo de acesso:</p>
            <button className="btn-aluno" onClick={() => redirectToLogin('aluno')}>Aluno</button>
            <button className="btn-admin" onClick={() => redirectToLogin('admin')}>Administrador</button>
          </div>
        </div>
      )}

      <footer>
        &copy; 2025 CE Sports — CEFET-MG | Todos os direitos reservados
      </footer>
    </div>
  );
};

export default Campeonatos;
