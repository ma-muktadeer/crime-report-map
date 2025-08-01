package com.softcafesolution.dgfi.security;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.SessionCookieConfig;
import jakarta.servlet.SessionTrackingMode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	private static final Logger log = LogManager.getLogger();

	@Value("${public.base.url:/public/**}")
	private String publicBaseUrl;

	@Value("${application.ul.domain:http://localhost:4321}")
	private List<String> applicationDomain;

	@Value("${security.csp.report-only:true}")
	private boolean cspReportOnly;

	@Value("${security.hsts.enabled:false}")
	private boolean hstsEnabled;

	@Value("${security.script-inline-allowed:true}")
	private boolean scriptInlineAllowed;

	@Autowired
	JwtAuthFilter jwtAuthFilter;

	@Bean
	UserDetailsService userDetailsService() {
		return new CustomUserDetailsService();
	}

//	@Bean
//	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//
//		return http.csrf(csrf -> {
//			csrf.disable();
//		}).authorizeHttpRequests(auth -> {
//			auth.requestMatchers(publicBaseUrl, "/actuator/**", "/ws/**").permitAll().anyRequest().authenticated();
//		}).sessionManagement(session -> {
//			session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED);
//		}).authenticationProvider(authenticationProvider())
//		.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
//
//		.build();
//
//	}

	@Bean
	SecurityFilterChain springWebFilterChain(HttpSecurity http) throws Exception {
//		if (env.acceptsProfiles(Profiles.of("prod"))) {
//			http.requiresChannel(rc -> rc.anyRequest().requiresSecure()
//			);
//		}
		return http.headers(this::headersFilter).httpBasic(AbstractHttpConfigurer::disable)
				.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
						.ignoringRequestMatchers("/**"))
				.authenticationProvider(authenticationProvider())
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
				.sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(e -> accessDeniedHandler())
				.authorizeHttpRequests(r -> r.requestMatchers("/", "/index.html", "/assets/**", "/media/**", "/*.js",
						"/*.css", "/favicon.ico", "/{path:[^\\.]*}", "/{path:[^\\.]*}/**", "/public/**", "/actuator/**", "/ws/**").permitAll()
//						.requestMatchers("/secure/admin/**").hasAuthority("ADMIN")
						.requestMatchers("/secure/**").authenticated().anyRequest().denyAll())
				.cors(cors -> cors.configurationSource(request -> corsRequestFilter()))
//				.requiresChannel(channel -> channel
//						.requestMatchers(new RequestHeaderRequestMatcher("X-Forwarded-Proto", "http")).requiresSecure()
//				)
				.build();
	}

	/*
	 * @Bean CorsConfigurationSource corsConfigurationSource() { CorsConfiguration
	 * configuration = new CorsConfiguration(); // This Origin header you can see
	 * that in Network tab configuration.setAllowedOrigins(Arrays.asList("*"));
	 * configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH",
	 * "DELETE", "OPTIONS")); configuration.setAllowCredentials(true);
	 * configuration.setAllowedHeaders(Arrays.asList("Authorization",
	 * "content-type", "x-auth-token"));
	 * configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
	 * UrlBasedCorsConfigurationSource source = new
	 * UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**",
	 * configuration); return source; }
	 */

	private void headersFilter(HeadersConfigurer<HttpSecurity> header) {
		header.contentTypeOptions(withDefaults()).frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
				.xssProtection(HeadersConfigurer.XXssConfig::disable)
//				.contentSecurityPolicy(csp -> {
//					HttpServletRequest request = getCurrentHttpRequest();
//					String nonce = generateNonce();
//					if(request != null) {
//						request.setAttribute("cspNonce", nonce);
//					}
//					String cspPolicy = "default-src 'self';" + "script-src 'self' 'strict-dynamic' 'nonce-" + nonce
//							+ "'" + (scriptInlineAllowed ? " 'unsafe-inline';" : ";") + "style-src 'self'"
//							+ (scriptInlineAllowed ? " 'unsafe-inline';" : ";") + "img-src 'self' data:;"
//							+ "font-src 'self';" + "connect-src 'self';" + "object-src 'none';" + "media-src 'self';"
//							+ "frame-src 'self';" + "base-uri 'self';" + "form-action 'self';"
//							+ "upgrade-insecure-requests;" + "block-all-mixed-content;"
//							+ "report-uri /csp-violation-report-endpoint;";
//					if (cspReportOnly) {
//						csp.policyDirectives(cspPolicy).reportOnly();
//					} else {
//						csp.policyDirectives(cspPolicy);
//					}
//				})
				.httpStrictTransportSecurity(hsts -> {
					if (hstsEnabled) {
						hsts.maxAgeInSeconds(31536000).includeSubDomains(true).preload(true);
					} else {
						hsts.disable();
					}
				}).addHeaderWriter(new StaticHeadersWriter("Cross-Origin-Opener-Policy", "same-origin"))
				.permissionsPolicyHeader(permissions -> permissions
						.policy("geolocation=(), microphone=(), camera=(), fullscreen=(self), vibrate=()"));
	}

	private CorsConfiguration corsRequestFilter() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(applicationDomain);
		config.setAllowedMethods(List.of("GET", "POST"));
//        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "appName", "Cache-Control"));
		config.addAllowedHeader("*");
		config.setExposedHeaders(List.of("Authorization", "Content-Type", "Content-Disposition"));
//		config.setExposedHeaders(List.of("Authorization", "Content-Type", "Content-Disposition"));
		config.setAllowCredentials(true); // Set to false if credentials are not needed
		config.setMaxAge(3600L);
		return config;
	}

	@Bean
	public CorsConfigurationSource corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = corsRequestFilter();
		source.registerCorsConfiguration("/**", config);
//        return new CorsFilter(source);
		return source;
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;

	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	AccessDeniedHandler accessDeniedHandler() {
		return new CustomAccessDeniedHandler();
	}

	@Bean
	ServletContextInitializer servletContextInitializer() {
		return new ServletContextInitializer() {
			@Override
			public void onStartup(ServletContext servletContext) throws ServletException {
				servletContext.setSessionTrackingModes(Collections.singleton(SessionTrackingMode.COOKIE));
				SessionCookieConfig sessionCookieConfig = servletContext.getSessionCookieConfig();
				sessionCookieConfig.setHttpOnly(true);
				sessionCookieConfig.setSecure(true);
				sessionCookieConfig.setMaxAge(360000);

				log.info("Server info [{}]", servletContext.getServerInfo());
				log.info("Context path [{}]", servletContext.getContextPath());
				log.info("Major/Minor version [{}]:[{}]", servletContext.getEffectiveMajorVersion(),
						servletContext.getEffectiveMinorVersion());
				log.info("session timeout minute [{}]", servletContext.getSessionTimeout());

			}
		};
	}
}

class CustomAccessDeniedHandler implements AccessDeniedHandler {
	private static final Logger log = LogManager.getLogger();

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException exc)
			throws IOException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(","));

		log.info("Access denied for the user with role [{}]:[{}]:[{}]:[{}]", auth.getPrincipal(),
				request.getRequestURI(), request.getRequestedSessionId(), roles);
		response.setStatus(HttpStatus.FORBIDDEN.value());
		response.getWriter().write("Access Denied");
	}
}
