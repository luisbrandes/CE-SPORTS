package org.ce.sports.Api.config;

import jakarta.annotation.PostConstruct;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;

@Component
@RequiredArgsConstructor
@Slf4j
public class StartupDatabaseMigration {

    private final DataSource dataSource;

    @PostConstruct
    @Transactional
    public void ensureColumns() {
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            try (ResultSet rs = meta.getColumns(null, null, "PROJETOS_ESPORTIVOS", "%")) {
                boolean hasVagasPreenchidas = false;
                boolean hasVagasTotais = false;
                while (rs.next()) {
                    String colName = rs.getString("COLUMN_NAME");
                    if (colName != null) {
                        String upper = colName.toUpperCase();
                        if (upper.equals("VAGAS_PREENCHIDAS")) hasVagasPreenchidas = true;
                        if (upper.equals("VAGAS_TOTAIS")) hasVagasTotais = true;
                    }
                }

                try (Statement stmt = conn.createStatement()) {
                    if (!hasVagasPreenchidas) {
                        log.info("Coluna 'vagas_preenchidas' não encontrada — adicionando coluna ao banco.");
                        stmt.execute("ALTER TABLE projetos_esportivos ADD COLUMN vagas_preenchidas INT DEFAULT 0");
                    }
                    if (!hasVagasTotais) {
                        log.info("Coluna 'vagas_totais' não encontrada — adicionando coluna ao banco.");
                        stmt.execute("ALTER TABLE projetos_esportivos ADD COLUMN vagas_totais INT DEFAULT 0");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Erro ao garantir colunas da tabela projetos_esportivos", e);
        }
    }
}
