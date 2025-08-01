package com.softcafesolution.mdm;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Date;
import java.util.UUID;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.repo.UserRepo;
import com.softcafesolution.core.utils.EncryptDecryptHelper;

@SpringBootTest
class UserTests {
	
	private static final Logger log = LogManager.getLogger();

	@Autowired
	UserRepo userRepo;
	
	public static void main(String[] args) {
		System.out.println(UUID.randomUUID().toString());
	}
	
	
	@Test
	void createUser() {
		try {
			User user = userRepo.findByLoginNameAndActive("softcafe", 1);
			if(user == null) {
				user = new User();
				user.setLoginName("softcafe");
				user.setPassword("123");
				user.setActive(1);
				user.setAllowLogin(1);
				user.setCreatorId(1l);
				user.setUserModId(1l);
				user.setModTime(new Date());
				user.setEntryTime(new Date());
//				user.setCustomerId(9l);
				
				userRepo.save(user);
				
				assertEquals(user.getUserId(), 1);
			}
		} catch (Exception e) {
			log.error("{}", e);
		}
		
	}



}
