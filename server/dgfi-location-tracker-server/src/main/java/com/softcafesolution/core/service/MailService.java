package com.softcafesolution.core.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;


@Service(value = "mailService")
public class MailService {
	private static final Logger log = LogManager.getLogger(MailService.class);
	
	@Autowired
	MailConfig mailConfig;
	
	@PostConstruct
	public void init() {
		log.info("PORT [{}]", mailConfig.getPort());
		log.info("Mail Config [{}] ", mailConfig.toString());
	}
	public  boolean send(String subject, String body, String to) throws Exception{
		log.info("Sending mail to:port [{}]:[{}]:[{}]", to, mailConfig.getHostName(),  mailConfig.getPort());
		return MailSender.sendHtmlMail(subject, body, mailConfig, to);
	}
	
	
}
