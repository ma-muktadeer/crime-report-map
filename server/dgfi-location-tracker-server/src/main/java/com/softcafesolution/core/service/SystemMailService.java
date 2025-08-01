package com.softcafesolution.core.service;

import org.apache.commons.mail.DefaultAuthenticator;
import org.apache.commons.mail.Email;
import org.apache.commons.mail.SimpleEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service(value = "systemMailService")
public class SystemMailService{
	private static final Logger log = LoggerFactory.getLogger(SystemMailService.class);
	
	
	public static boolean sendAppSecurityCode(String body, String subject, String to) {

		try {
			Email email = new SimpleEmail();
			email.setHostName("smtp.googlemail.com");
			email.setSmtpPort(465);
			email.setAuthenticator(new DefaultAuthenticator("noreply.softcafe@gmail.com", "softc@fe.ltd"));
			email.setSSLOnConnect(true);
			email.setFrom("noreply.softcafe@gmail.com");
			email.setSubject(subject);
			email.setMsg(body);
			email.addTo(to);
			email.send();
			log.info("Sending security mail to [{}] successful" , to);
			return true;
		} catch (Exception e) {
			log.error("Error sending mail {}", e);
		}
		return false;
	
		
	}

}
