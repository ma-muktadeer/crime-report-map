package com.softcafesolution;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.service.UserService;

import jakarta.el.ELException;

@Component
public class InitValue implements CommandLineRunner {
    private static final Logger log = LogManager.getLogger();

    @Autowired
    private UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (userService.isEmptyUser()) {
                User usr = new User();
                usr.setCreatorId(1L);
                usr.setEmail("kamrul@softcafe.com");
                usr.setLoginName("softcafe");
                usr.setPhoneNumber("01737575077");
                usr.setFirstName("Softcafe");
                usr.setPassword(passwordEncoder.encode("123"));
                usr.setLogingMethod("DB");
                usr.setActive(1);
                usr.setAllowLogin(1);
                usr.setUserModId(1L);
               
                userService.saveInitialValue(usr);
            }

        } catch (Exception e) {
            log.info("getting error to save initioal vaule=[{}]", e.getMessage());
            throw new ELException(e.getMessage());
        }
    }

}