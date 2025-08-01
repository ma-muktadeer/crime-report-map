package com.softcafesolution.dgfi.security;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.repo.UserRepo;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private static final Logger log = LogManager.getLogger();

	@Autowired
	UserRepo userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		log.info("Authenticating user [{}]", username);
		User user = userRepo.findByLoginNameAndActive(username, 1);
		UserBuilder builder = null;
		if (user != null) {

			User client = user;
			builder = org.springframework.security.core.userdetails.User.withUsername(username);
			builder.password(new BCryptPasswordEncoder().encode(user.getPassword()));
			builder.authorities(new SimpleGrantedAuthority("ROLE_USER"));
//			builder.authorities(new ArrayList<>());
			if (client.getAllowLogin() != null && client.getAllowLogin() != 1) {
				log.info("Client is locked [{}]", username);
				builder.disabled(true);
			}

		} else {
			throw new UsernameNotFoundException("Authentication failed");
		}

		return builder.build();
	}

}
