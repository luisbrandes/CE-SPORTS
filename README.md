# 🏫 CE Sports  
**Sistema de Acompanhamento Esportivo do CEFET-MG**

---

## 🧠 Descrição do Projeto
O **CE Sports** é uma plataforma web criada para o **CEFET-MG (Campus Belo Horizonte)** com o objetivo de **centralizar e digitalizar as informações esportivas da instituição**.  
O sistema permite que **alunos, administradores e visitantes** acompanhem **campeonatos, projetos esportivos, horários de treinos, notícias e estatísticas**, além de possibilitar **interações ativas**, como **propor, avaliar e participar de projetos**.

---

## 👥 Equipe de Desenvolvimento
| Ordem | Nome | Função / Foco |
|:------|:------|:---------------|
| 1 | **Luís** | Líder de projeto — autenticação, segurança e integração |
| 2 | **Miguel** | Campeonatos, resultados e estatísticas |
| 3 | **Rúbia** | Projetos esportivos e treinos |
| 4 | **Mariana** | Comunicação e conteúdo (notícias, notificações e avaliações) |
| 5 | **Ísis** | Interação do aluno, interesse e aprovação de projetos |

---

## 👤 Atores do Sistema
| Ator | Definição |
|:------|:-----------|
| **Aluno** | Usuário principal, com acesso a projetos, campeonatos e treinos, podendo propor e avaliar atividades esportivas. |
| **Administrador** | Gerencia todas as informações do sistema, aprova projetos e envia notificações. |
| **Visitante** | Acessa o sistema sem login, visualizando informações públicas. |

---

## ⚙️ Requisitos Funcionais
| Id | Ator | Descrição |
|:----|:------|:------------|
| **REQ001** | Aluno | Visualizar horários e locais de treinos. |
| **REQ002** | Aluno | Visualizar tabelas e classificações. |
| **REQ003** | Aluno | Pesquisar eventos esportivos. |
| **REQ004** | Aluno | Manifestar interesse em iniciativas esportivas. |
| **REQ005** | Aluno | Inscrever e monitorar time em campeonatos. |
| **REQ006** | Aluno | Propor novo projeto esportivo. |
| **REQ007** | Aluno | Avaliar projetos existentes. |
| **REQ008** | Aluno | Visualizar estatísticas do time. |
| **REQ009** | Administrador | Cadastrar e editar campeonatos, treinos e equipes. |
| **REQ010** | Administrador | Criar e remover projetos esportivos. |
| **REQ011** | Administrador | Enviar notificações aos usuários. |
| **REQ012** | Administrador | Avaliar e aprovar projetos propostos. |
| **REQ013** | Visitante | Visualizar campeonatos e notícias. |
| **REQ014** | Aluno / Administrador | Logar no sistema. |
| **REQ015** | Visitante | Entrar como visitante sem login. |

---

## 🧩 Regras de Negócio
| Id | Nome | Descrição |
|:----|:-------|:------------|
| **RN001** | Veracidade das informações | Todos os dados devem ser aprovados por um administrador. |
| **RN002** | Participação em projetos | Apenas alunos matriculados podem se inscrever ou propor projetos. |
| **RN003** | Atualização de resultados | Resultados só podem ser alterados após validação administrativa. |
| **RN004** | Interesse esportivo válido | Apenas alunos autenticados podem demonstrar interesse. |
| **RN005** | Acesso limitado ao visitante | Visitantes apenas visualizam informações. |
| **RN006** | Aprovação de novos projetos | Projetos enviados por alunos devem ser avaliados e aprovados. |
| **RN007** | Login institucional | Apenas usuários vinculados ao CEFET-MG podem logar. |
| **RN008** | Escolha de modo de acesso | O sistema deve oferecer login ou acesso visitante na página inicial. |

---

## 📋 Casos de Uso
| Id | Nome | Ator Principal |
|:----|:------|:----------------|
| **CSU01** | Visualizar horários e locais de treinos | Aluno |
| **CSU02** | Atualizar informações esportivas | Administrador |
| **CSU03** | Criação de projeto esportivo | Administrador |
| **CSU04** | Visualizar classificação de equipes | Aluno |
| **CSU05** | Enviar notificações aos usuários | Administrador |
| **CSU06** | Pesquisar eventos esportivos | Aluno / Visitante |
| **CSU07** | Inscrição e monitoramento de time | Aluno |
| **CSU08** | Ver informações de participação | Aluno |
| **CSU09** | Cadastrar novo campeonato | Administrador |
| **CSU10** | Editar dados de treino | Administrador |
| **CSU11** | Consultar histórico de jogos | Visitante |
| **CSU12** | Remover projeto esportivo | Administrador |
| **CSU13** | Manifestar interesse em iniciativa esportiva | Aluno |
| **CSU14** | Visualizar notícias esportivas | Visitante |
| **CSU15** | Logar no sistema | Aluno / Administrador |
| **CSU16** | Entrar como visitante | Visitante |
| **CSU17** | Visualizar estatísticas do time | Aluno |
| **CSU18** | Propor projeto esportivo | Aluno |
| **CSU19** | Avaliar e aprovar projetos esportivos | Administrador |
| **CSU20** | Avaliar projetos | Aluno |
| **CSU21** | Cadastrar noticias esportivas | Aluno / Administrador |

---

## 🧱 Planejamento (3 Sprints)  
> Todos os integrantes participam de todas as sprints, com ao menos um caso de uso por etapa.  
> Todos os 20 casos de uso estão distribuídos de forma equilibrada.

---

### 🟩 **Sprint 1 — Estrutura base e páginas públicas**
**Objetivo:** Criar layout inicial, login, páginas públicas e navegação geral.

| Caso de Uso | Desenvolvedor | Função |
|:-------------|:---------------|:--------|
| **CSU15** | **Luís** | Logar no sistema (autenticação com Spring Security) |
| **CSU16** | **Luís** | Entrar como visitante |
| **CSU04** | **Miguel** | Visualizar classificação de equipes |
| **CSU11** | **Miguel** | Consultar histórico de jogos |
| **CSU01** | **Rúbia** | Visualizar horários e locais de treinos |
| **CSU21** | **Mariana** |  Cadastrar noticias esportivas | Aluno / Administrador |
| **CSU14** | **Mariana** | Visualizar notícias esportivas |
| **CSU06** | **Ísis** | Pesquisar eventos esportivos |
| **CSU13** | **Ísis** | Manifestar interesse em iniciativas esportivas |

---

### 🟨 **Sprint 2 — Funcionalidades administrativas e de conteúdo**
**Objetivo:** Implementar CRUDs e funcionalidades internas (admin e aluno autenticado).

| Caso de Uso | Desenvolvedor | Função |
|:-------------|:---------------|:--------|
| **CSU02** | **Luís** | Atualizar informações esportivas |
| **CSU09** | **Miguel** | Cadastrar novo campeonato |
| **CSU03** | **Rúbia** | Criação de projeto esportivo |
| **CSU10** | **Rúbia** | Editar dados de treino |
| **CSU05** | **Mariana** | Enviar notificações aos usuários |
| **CSU12** | **Mariana** | Remover projeto esportivo |
| **CSU19** | **Ísis** | Avaliar e aprovar projetos esportivos |

---

### 🟦 **Sprint 3 — Integração, estatísticas e interatividade completa**
**Objetivo:** Integrar módulos, finalizar funções e implementar estatísticas e propostas.

| Caso de Uso | Desenvolvedor | Função |
|:-------------|:---------------|:--------|
| **CSU07** | **Luís** | Inscrição e monitoramento de time |
| **CSU18** | **Rúbia** | Propor projeto esportivo |
| **CSU17** | **Miguel** | Visualizar estatísticas do time |
| **CSU20** | **Mariana** | Avaliar projetos |
| **CSU08** | **Ísis** | Ver informações de participação |

---

## ⚖️ Resumo de Casos de Uso por Integrante
| Integrante | Casos de Uso | Total | Foco |
|:-------------|:-------------|:-------|:--------|
| **Luís** | CSU15, CSU16, CSU02, CSU07 | **4** | Login, segurança e controle geral |
| **Miguel** | CSU04, CSU11, CSU09, CSU17 | **4** | Campeonatos, resultados e estatísticas |
| **Rúbia** | CSU01, CSU03, CSU10, CSU18 | **4** | Projetos esportivos e treinos |
| **Mariana** | CSU14, CSU05, CSU12, CSU20 | **4** | Conteúdo, comunicação e avaliações |
| **Ísis** | CSU06, CSU13, CSU08, CSU19 | **4** | Interação do aluno e aprovação de projetos |


---

## 🌿 Estrutura de Branches
Cada integrante deve criar **sua própria branch** no formato:

