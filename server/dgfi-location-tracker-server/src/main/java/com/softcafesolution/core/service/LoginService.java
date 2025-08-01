package com.softcafesolution.core.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.Login;
import com.softcafesolution.core.repo.LoginRepo;

@Service
public class LoginService {
	
	@Autowired
	LoginRepo loginRepo;

	public void markResolvedAttempt(String loginName) {
		List<Login> logins =new ArrayList<Login>();
		logins = loginRepo.findByLoginNameAndFailResolved(loginName, 0);
		
		/*logins.forEach( i -> {
			i.setFailResolved(1);
		});*/
		
		for(Login i:logins) {
			i.setFailResolved(1);
		}
		
		loginRepo.saveAll(logins);
		//loginRepo.resolvedFailAttempt(new Date(), loginName);
	}
}
