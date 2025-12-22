package org.ce.sports.Api.config;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // Liberação para preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth, docs e H2
                        .requestMatchers(
                                "/api/auth/**",
                                "/h2-console/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // --------------------------
                        // NOTIFICAÇÕES
                        // --------------------------
                        .requestMatchers(HttpMethod.GET, "/api/notificacoes/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/notificacoes/**").authenticated()

                        // --------------------------
                        // NOTÍCIAS
                        // --------------------------
                        .requestMatchers(HttpMethod.GET, "/api/noticias/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/noticias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/noticias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/noticias/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/noticias/**").hasRole("ADMIN")

                        // --------------------------
                        // PROJETOS
                        // --------------------------
                        .requestMatchers(HttpMethod.GET, "/api/projetos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/projetos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/projetos/*/inscrever").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/projetos/*/cancelar").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/projetos/**").hasRole("ADMIN")

                        // --------------------------
                        // PROPOSTAS
                        // --------------------------
                        .requestMatchers(HttpMethod.POST, "/api/propostas").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/propostas").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/propostas/minhas").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/propostas/*/avaliar").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/propostas/**").authenticated()

                        // --------------------------
                        // TREINOS
                        // --------------------------
                        .requestMatchers(HttpMethod.GET, "/api/treinos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/treinos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/treinos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/treinos/**").hasRole("ADMIN")

                        // ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // ALUNO
                        .requestMatchers("/api/aluno/**")
                        .hasAnyRole("USER", "ALUNO", "ADMIN")

                        // Qualquer outra
                        .anyRequest().authenticated()
                )

                // Necessário para H2
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // Logout
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/api/auth/logout", "POST"))
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true)
                        .permitAll()
                );

        return http.build();
    }

    // ========================================
    // USER DETAILS
    // ========================================
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .map(user -> org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getSenha())
                        .roles(user.getRole().name().replace("ROLE_", ""))
                        .build())
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

}
