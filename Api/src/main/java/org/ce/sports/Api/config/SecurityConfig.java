package org.ce.sports.Api.config;

import lombok.RequiredArgsConstructor;
import org.ce.sports.Api.entities.repositories.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                // 🔒 Controle de autorização por endpoint
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",  // rotas públicas (login, registro, verificação)
                                "/h2-console/**",
                                "/swagger-ui/**", "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // somente ADMIN
                        .requestMatchers("/api/aluno/**").hasAnyRole("USER", "ALUNO", "ADMIN")
                        .anyRequest().authenticated()
                )

                // 🧱 Configuração de sessão
                .sessionManagement(session -> session
                        .maximumSessions(1)
                )

                // 🔓 Desativa CSRF (API REST + sessão)
                .csrf(csrf -> csrf.disable())

                // ✅ Libera frames do H2
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

                // 🌐 Configuração CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔚 Logout básico via /logout
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/api/auth/logout", "POST"))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .clearAuthentication(true)
                        .permitAll()
                );

        return http.build();
    }

    // 🧩 Serviço para carregar usuários do banco
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
                .map(user -> org.springframework.security.core.userdetails.User.builder()
                        .username(user.getEmail())
                        .password(user.getSenha())
                        // garante que o prefixo do papel esteja correto (ROLE_ADMIN, ROLE_USER)
                        .authorities(user.getRole().name())
                        .build()
                )
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🌍 CORS: permite comunicação com o frontend (Next.js)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://127.0.0.1:3000"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
