package org.ce.sports.Api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Regras de autorização
                .authorizeHttpRequests(auth -> auth
                        // API pública
                        .requestMatchers("/api/auth/**").permitAll()
                        // H2 console
                        .requestMatchers("/h2-console/**").permitAll()
                        // Swagger
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Front-end estático (Next.js empacotado)
                        .requestMatchers("/", "/index.html", "/static/**", "/_next/**", "/favicon.ico").permitAll()
                        // Qualquer outra rota (temporariamente pública)
                        .anyRequest().permitAll()
                )
                // Desativa CSRF (importante para API REST e H2)
                .csrf(csrf -> csrf.disable())
                // Ajustes de headers
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()) // Permite H2 Console
                        .httpStrictTransportSecurity(hsts -> hsts.disable())
                )
                // Configuração de CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permite tanto o Next em dev (porta 3000) quanto o próprio servidor (8080)
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8080"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
