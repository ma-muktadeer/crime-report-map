package com.softcafesolution.dgfi.security;

import static java.util.stream.Collectors.joining;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.softcafesolution.core.entity.Role;
import com.softcafesolution.dgfi.utils.SecurityUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ClaimsBuilder;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtService {

	private final static Logger log = LogManager.getLogger();

	public static final String SECRET = "357638792F42VW5OM8EISDTUERISJFORVOUGFGHJUIGJHKSHUESJKDASJAIEKHWKAEXWAHKEDW34567898765432345T";

	public String extractUsername(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		return claimsResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
//		return Jwts.parserBuilder().setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
		Claims claims = null;
		try {
			claims = Jwts
					.parser()
					.verifyWith(getSignKey())
					.build()
					.parseSignedClaims(token)
					.getPayload();

		} catch (ExpiredJwtException e) {
			log.error("Token expired: {}", e.getMessage());
			throw new JwtException("Token expired.");
		} catch (io.jsonwebtoken.security.SignatureException e) {
			log.error("Invalid token signature: {}", e.getMessage());
			throw new JwtException("Invalid token.");
		} catch (MalformedJwtException e) {
			log.error("Malformed token: {}", e.getMessage());
			throw new JwtException("Invalid token.");
		} catch (Exception e) {
			log.error("Token parsing error: {}", e.getMessage());
			throw new JwtException("Invalid token.");
		}
		return claims;
	}

	private Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	public Boolean validateToken(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

	public String createToken(String username, Date issueAt, Date expAt, List<Role> roles) {

//		List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
//		String d = roles.stream().map(i -> i.getRoleName()).collect(Collectors.joining(","));
//		grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList(d);

//		return Jwts.builder().setId("softcafeJWT").setSubject(username)
//				.claim("authorities", grantedAuthorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
//				.setIssuedAt(issueAt)
//				.setExpiration(expAt)
//				.signWith(getSignKey(), SignatureAlgorithm.HS256)
//				.compact();

		String d = roles.stream().map(Role::getRoleName).collect(Collectors.joining(","));
		Collection<? extends GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(d);
		ClaimsBuilder claimsBuilder = Jwts.claims().subject(username);
		if (!authorities.isEmpty()) {
			claimsBuilder.add("authorities",
					authorities.stream().map(GrantedAuthority::getAuthority)
							.collect(joining(",")));
		}
		HttpServletRequest request = null;
		ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        request = requestAttributes.getRequest();
        claimsBuilder.add("device", SecurityUtils.generateDeviceFingerprint(request));
        Claims claims = claimsBuilder.build();
		return Jwts.builder()
				.claims(claims)
				.issuedAt(issueAt)
				.expiration(expAt)
				.signWith(getSignKey())
				.compact();
	}

	private SecretKey getSignKey() {
//		byte[] keyBytes = Decoders.BASE64.decode(SECRET);
//		return Keys.hmacShaKeyFor(keyBytes);
		String secret = Base64.getEncoder().encodeToString(SECRET.getBytes());
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
}
