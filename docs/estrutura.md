# 🧩 Estrutura do Projeto

O projeto está organizado em camadas para manter o código limpo, organizado e fácil de manter.
Abaixo está o que cada pasta representa:

## 📁 entities
Contém as entidades do sistema, que representam as tabelas do banco de dados.
Cada classe dessa pasta usa anotações da JPA, como `@Entity` e `@Table`, e define os atributos e relacionamentos do banco.

## 📁 dto
Guarda os objetos de transferência de dados (Data Transfer Objects).
Essas classes servem para enviar e receber informações entre o backend e o frontend, sem expor diretamente as entidades do banco.

## 📁 controllers
Contém as classes responsáveis pelos endpoints da API.
Elas recebem as requisições HTTP, chamam os serviços necessários e retornam as respostas.
Usam anotações como `@RestController`, `@GetMapping`, `@PostMapping`, etc.

## 📁 services
Aqui fica a lógica de negócio do sistema.
Os serviços tratam os dados recebidos dos controladores, aplicam regras e interagem com o repositório para acessar o banco de dados.

## 📁 repository
Contém as interfaces que fazem a comunicação com o banco de dados.
Normalmente estendem `JpaRepository` e são usadas pelos serviços para salvar, buscar, atualizar e deletar dados.