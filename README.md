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
| **Miguel** | Gestão de campeonatos e resultados |
| **Rúbia** | Projetos esportivos e gerenciamento de treinos |
| **Mariana** |  Comunicação e conteúdo (notícias e notificações)|
| **Ísis** | Interação do aluno e engajamento |

---

## 👤 Atores do Sistema

| Ator | Descrição |
|------|------------|
| **Aluno** | Membro da comunidade acadêmica que acompanha campeonatos, projetos e treinos, podendo manifestar interesse em iniciativas esportivas. |
| **Administrador** | Responsável por cadastrar, editar e gerenciar informações esportivas (campeonatos, projetos, treinos, notícias). |
| **Visitante** | Usuário que acessa o sistema sem login, com permissão apenas de visualização. |

---

## ⚙️ Requisitos Funcionais

| Código | Ator | Descrição |
|---------|------|-----------|
| **REQ001** | Aluno | Visualizar tabelas, resultados e classificações dos campeonatos internos. |
| **REQ002** | Aluno | Consultar horários e locais de treinos dos projetos esportivos. |
| **REQ003** | Aluno | Receber notificações e atualizações sobre eventos esportivos. |
| **REQ004** | Administrador | Cadastrar e editar informações sobre campeonatos, treinos e equipes. |
| **REQ005** | Visitante | Acessar informações públicas sobre campeonatos e projetos esportivos. |
| **REQ006** | Aluno | Demonstrar interesse em iniciativas esportivas cadastradas no sistema. |
| **REQ007** | Aluno / Administrador | Logar no sistema para autenticação e identificação. |
| **REQ008** | Visitante | Utilizar o sistema sem realizar login. |

---

## 🧩 Regras de Negócio

| Código | Nome | Descrição |
|---------|------|-----------|
| **RN001** | Veracidade das informações | Todas as informações cadastradas devem ser verificadas e aprovadas pelo administrador. |
| **RN002** | Participação em projetos | Apenas alunos regularmente matriculados podem se inscrever em projetos esportivos. |
| **RN003** | Atualização de resultados | Resultados de jogos só podem ser atualizados após confirmação oficial da administração. |
| **RN004** | Interesse esportivo válido | Apenas alunos autenticados podem manifestar interesse em iniciativas esportivas. |
| **RN005** | Acesso limitado ao visitante | Visitantes podem apenas visualizar informações públicas, sem realizar interações. |
| **RN006** | Atualização de projetos | Apenas administradores podem alterar informações sobre projetos esportivos. |
| **RN007** | Logar no sistema | O login deve ser realizado apenas por alunos ou discentes vinculados ao CEFET-MG. |
| **RN008** | Exibição de modo de acesso | Ao entrar no site, deve ser oferecida a opção entre logar ou entrar como visitante. |

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

---

## 🚀 Planejamento de Implementação (3 Sprints)

| Sprint | Casos de Uso Planejados | Objetivo Geral |
|---------|--------------------------|----------------|
| **Sprint 1 – Estrutura base e páginas públicas** | CSU01, CSU04, CSU06, CSU13, CSU14, CSU15 | Criar a base do sistema, autenticação, páginas iniciais e navegação pública. |
| **Sprint 2 – Funcionalidades administrativas e de conteúdo** | CSU02, CSU03, CSU05, CSU08, CSU09 | Implementar as funções administrativas, cadastro e envio de notificações. |
| **Sprint 3 – Integração e funcionalidades completas** | CSU07, CSU10, CSU11, CSU12 | Finalizar funcionalidades restantes, integrar módulos e revisar o sistema. |

---

## 🌿 Estrutura de Branches

Cada integrante deve criar **sua própria branch** com o nome no formato:
