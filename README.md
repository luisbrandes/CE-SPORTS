# 🏫 CE Sports  
**Sistema de Acompanhamento Esportivo do CEFET-MG**

---

## 🎯 Objetivo do Projeto
O **CE Sports** tem como objetivo permitir que alunos e demais integrantes da comunidade do CEFET-MG, campus Belo Horizonte, acompanhem de forma completa e integrada todas as atividades relacionadas à área esportiva da instituição.  
A plataforma oferecerá acesso a informações atualizadas sobre **campeonatos internos**, **projetos esportivos**, **treinos** e **notícias**, incentivando a prática esportiva e a participação da comunidade.

---

## 👥 Equipe de Desenvolvimento

| Integrante | Função / Foco |
|-------------|----------------|
| **Luís** | Líder de projeto — autenticação, integração e controle de acesso |
| **Mariana** | Gestão de campeonatos e resultados |
| **Miguel** | Projetos esportivos e gerenciamento de treinos |
| **Rúbia** | Comunicação e conteúdo (notícias e notificações) |
| **Ísis** | Interação do aluno e engajamento |

---

## 👤 Atores do Sistema

| Ator | Descrição |
|------|------------|
| **Aluno** | Membro da comunidade acadêmica que acompanha campeonatos, projetos e treinos, podendo manifestar interesse em iniciativas esportivas. |
| **Administrador** | Responsável por cadastrar, editar e gerenciar informações esportivas (campeonatos, projetos, treinos, notícias). |
| **Visitante** | Usuário que acessa o sistema sem login, com permissão apenas de visualização. |

---

## 📋 Casos de Uso

| Código | Nome | Ator Principal |
|---------|------|----------------|
| CSU01 | Visualizar horários e locais de treinos | Aluno |
| CSU02 | Atualizar informações esportivas | Administrador |
| CSU03 | Criação de projeto esportivo | Administrador |
| CSU04 | Visualizar classificação de equipes | Aluno |
| CSU05 | Enviar notificações aos usuários | Administrador |
| CSU06 | Pesquisar eventos esportivos | Aluno / Visitante |
| CSU07 | Inscrição e monitoramento de time | Aluno |
| CSU08 | Ver informações de participação | Aluno |
| CSU09 | Cadastrar novo campeonato | Administrador |
| CSU10 | Editar dados de treino | Administrador |
| CSU11 | Consultar histórico de jogos | Visitante |
| CSU12 | Remover projeto esportivo | Administrador |
| CSU13 | Manifestar interesse em iniciativa esportiva | Aluno |
| CSU14 | Visualizar notícias esportivas | Visitante |
| CSU15 | Logar no sistema | Aluno |
| CSU16 | Entrar como visitante | Visitante |

---

## 🚀 Planejamento de Implementação (3 Sprints)

| Sprint | Integrante | Casos de Uso | Objetivo |
|---------|-------------|--------------|-----------|
| **Sprint 1 – Estrutura base e páginas públicas** | **Luís** | CSU15 (Logar no sistema), CSU16 (Entrar como visitante) | Criar sistema de login, autenticação e controle de sessão. |
|  | **Mariana** | CSU04 (Visualizar classificação de equipes) | Exibir classificação de times e resultados iniciais. |
|  | **Miguel** | CSU01 (Visualizar horários e locais de treino) | Criar tela e lógica para exibir treinos e locais. |
|  | **Rúbia** | CSU14 (Visualizar notícias esportivas) | Exibir notícias esportivas no site. |
|  | **Ísis** | CSU13 (Manifestar interesse em iniciativa esportiva) | Implementar formulário e registro de interesse. |

---

| Sprint | Integrante | Casos de Uso | Objetivo |
|---------|-------------|--------------|-----------|
| **Sprint 2 – Funcionalidades administrativas e de conteúdo** | **Luís** | CSU06 (Pesquisar eventos esportivos) | Criar barra de pesquisa e filtragem de eventos. |
|  | **Mariana** | CSU09 (Cadastrar novo campeonato) | CRUD de campeonatos e gerenciamento de dados. |
|  | **Miguel** | CSU03 (Criação de projeto esportivo) | Implementar cadastro de novos projetos esportivos. |
|  | **Rúbia** | CSU05 (Enviar notificações aos usuários) | Permitir envio e controle de notificações. |
|  | **Ísis** | CSU08 (Ver informações de participação) | Exibir status de participação do aluno nos projetos. |

---

| Sprint | Integrante | Casos de Uso | Objetivo |
|---------|-------------|--------------|-----------|
| **Sprint 3 – Integração, histórico e aperfeiçoamentos** | **Luís** | Integração geral e revisão final | Integrar módulos, testar e corrigir falhas gerais. |
|  | **Mariana** | CSU07 (Inscrição e monitoramento de time), CSU11 (Consultar histórico de jogos) | Permitir inscrição e histórico detalhado de jogos. |
|  | **Miguel** | CSU10 (Editar dados de treino), CSU12 (Remover projeto esportivo) | Implementar edição e exclusão de projetos. |
|  | **Rúbia** | CSU02 (Atualizar informações esportivas) | Atualizar e manter dados de campeonatos e treinos. |
|  | **Ísis** | Melhorias de interface e usabilidade | Refinar UX, formulários e notificações. |

---


## 🌿 Estrutura de Branches

Cada integrante deve criar **sua própria branch** com o nome no formato:
