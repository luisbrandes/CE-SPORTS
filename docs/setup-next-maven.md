# ⚙️ Setup Next.js + Spring Boot com Maven

## 🎯 Objetivo
Integrar o **Next.js** (frontend) com o **Spring Boot** (backend), permitindo que o Maven faça o build automático do front e sirva os arquivos estáticos no mesmo servidor.

---

## 📁 Estrutura

```yaml
CE-SPORTS/
├── Api/ → backend Spring Boot
└── web/ → frontend Next.js
```

---

## 🧩 Passos

### 1 Criar o projeto Next.js
Na raiz:

```bash
npx create-next-app@latest web

```
Nome em minúsculas (web).

### 2 Configurar o Next.js

Edite o next.config.js:

```ts
const nextConfig = {
  output: 'export',
  distDir: 'out',
};
export default nextConfig;

```

### 3 Ajustar o Maven (Api/pom.xml)

Adicione os plugins abaixo para:
- Rodar npm run build no /web
- Copiar o resultado para src/main/resources/static

```xml
<plugin>
  <groupId>org.codehaus.mojo</groupId>
  <artifactId>exec-maven-plugin</artifactId>
  <version>3.5.0</version>
  <executions>
    <execution>
      <id>build-nextjs</id>
      <phase>generate-resources</phase>
      <goals><goal>exec</goal></goals>
      <configuration>
        <workingDirectory>${project.basedir}/../web</workingDirectory>
        <executable>C:\Program Files\nodejs\npm.cmd</executable>
        <arguments>
          <argument>run</argument>
          <argument>build</argument>
        </arguments>
      </configuration>
    </execution>
  </executions>
</plugin>

<plugin>
  <artifactId>maven-resources-plugin</artifactId>
  <version>3.3.1</version>
  <executions>
    <execution>
      <id>copy-next-build</id>
      <phase>prepare-package</phase>
      <goals><goal>copy-resources</goal></goals>
      <configuration>
        <outputDirectory>${project.basedir}/src/main/resources/static</outputDirectory>
        <resources>
          <resource>
            <directory>${project.basedir}/../web/out</directory>
          </resource>
        </resources>
      </configuration>
    </execution>
  </executions>
</plugin>

```

### 4 Rodar o build completo

Na pasta Api:
```bash
mvn clean package
```

Isso gera o build do Next e empacota no JAR final do Spring.
💡 Se estiver usando o IntelliJ IDEA, basta clicar duas vezes na tarefa package (em Maven → Lifecycle → package) que o processo será executado automaticamente.

### 5 Rodar a aplicação

```bash
mvn spring-boot:run
```

Isso inicia o servidor Spring Boot e carrega o frontend buildado.
💡 No IntelliJ IDEA, você também pode apenas clicar em ▶️ “Run” na classe CeSportsApplication (ou usar Shift + F10) para iniciar o projeto.