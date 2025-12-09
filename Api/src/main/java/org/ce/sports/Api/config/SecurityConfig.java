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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // Liberação geral para OPTIONS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Login, console e documentação
                        .requestMatchers("/api/auth/**", "/h2-console/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()

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
                        // TREINOS
                        // --------------------------
                        .requestMatchers(HttpMethod.GET, "/api/treinos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/treinos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/treinos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/treinos/**").hasRole("ADMIN")

                        // --------------------------
                        // OUTRAS ROTAS ADMIN
                        // --------------------------
                        .requestMatchers("/api/campeonato/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Rotas de aluno
                        .requestMatchers("/api/aluno/**")
                        .hasAnyRole("USER", "ALUNO", "ADMIN")

                        // Qualquer outra rota → autenticado
                        .anyRequest().authenticated()
                )

                .headers(headers -> headers.frameOptions(frame -> frame.disable()))

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

                        // remove "ROLE_" do banco e mantém só "ADMIN", "USER", etc.
                        .roles(user.getRole().name().replace("ROLE_", ""))
                        .build()
                )
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    // ========================================
    // AUTENTICAÇÃO
    // ========================================
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ========================================
    // CORS
    // ========================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
