//package com.softcafe.core.util;
//
//import java.io.File;
//import java.util.List;
//import java.util.Map;
//
//import org.apache.commons.lang3.StringUtils;
//import org.apache.commons.mail.DefaultAuthenticator;
//import org.apache.commons.mail.Email;
//import org.apache.commons.mail.EmailAttachment;
//import org.apache.commons.mail.HtmlEmail;
//import org.apache.commons.mail.MultiPartEmail;
//import org.apache.commons.mail.SimpleEmail;
//
//import com.softcafe.core.service.MailConfig;
//
//
///**
// * Some common mail sending method with apache common mail
// * @author Kamruzzaman
// */
//public final class MailSender {
//
//	private static final String COMMA = ",";
//
//	/**
//	 * 
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean send(final String subject, final String body, final MailConfig mailConfig, final String  recipients)
//			throws Exception {
//
//		Email email = new SimpleEmail();
//		
//
//		buildEmailConfig(email, mailConfig);
//
//		buildEmail(email, subject, body,  recipients);
//		
//		email.send();
//		return true;
//	}
//
//	
//
//	/**
//	 * Send attachment with file name from attachment file name
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachmentList
//	 * @param  recipients
//	 *            : Email String array
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean sendHtmlMailWithAttachment(final String subject, final String body,
//			final MailConfig mailConfig, final List<File> attachmentList, final String  recipients) throws Exception {
//
//		HtmlEmail email = new HtmlEmail();
//
//		buildEmailConfig(email, mailConfig);
//
//		buildEmail(email, subject, body,  recipients);
//
//		buildAttachment(attachmentList, email);
//
//		email.send();
//		return true;
//
//	}
//	
//
//	/**
//	 * attachment file name and actual attachment name may explicitely defined
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachment
//	 * @param attachmentName
//	 * @param recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean sendHtmlMailWithAttachment(final String subject, final String body,
//			final MailConfig mailConfig, final File attachment, final String attachmentName, final String  recipients) throws Exception {
//		return sendHtmlMailWithAttachment(subject, body, mailConfig, buildAttachment(attachment, attachmentName),  recipients);
//	}
//	/**
//	 * attachment file name and actual attachment name may explicitely defined
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachment
//	 * @param attachmentName
//	 * @param recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean sendHtmlMailWithAttachment(final String subject, final String body,
//			final MailConfig mailConfig, final File attachment, final String  recipients) throws Exception {
//		return sendHtmlMailWithAttachment(subject, body, mailConfig, buildAttachment(attachment, attachment.getName()),  recipients);
//	}
//	/**
//	 * 
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachmentMail
//	 * @param recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean sendHtmlMailWithAttachment(final String subject, final String body,
//			final MailConfig mailConfig, final EmailAttachment attachmentMail, final String  recipients) throws Exception {
//
//		HtmlEmail email = new HtmlEmail();
//
//		buildEmailConfig(email, mailConfig);
//
//		buildEmail(email, subject, body,  recipients);
//		
//		email.attach(attachmentMail);
//
//		email.send();
//		return true;
//
//	}
//
//	/**
//	 * 
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param  recipients
//	 *            : Email String array
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean sendHtmlMail(final String subject, final String body, MailConfig mailConfig,
//			final String  recipients) throws Exception {
//
//		HtmlEmail email = new HtmlEmail();
//
//		buildEmailConfig(email, mailConfig);
//
//		buildEmail(email, subject, body,  recipients);
//		email.send();
//		return true;
//
//	}
//
//
//
//	/**
//	 * 
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachmentList
//	 * @param  recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean send(final String subject, final String body, final MailConfig mailConfig,
//			final List<File> attachmentList, final String  recipients) throws Exception {
//
//		MultiPartEmail email = new MultiPartEmail();
//		buildEmailConfig(email, mailConfig);
//		buildEmail(email, subject, body,  recipients);
//
//		buildAttachment(attachmentList, email);
//
//		email.send();
//		return true;
//	}
//	
//	public static boolean send(final String subject, final String body, final MailConfig mailConfig,
//			final File attachment, final String  recipients) throws Exception {
//
//		MultiPartEmail email = new MultiPartEmail();
//		buildEmailConfig(email, mailConfig);
//		buildEmail(email, subject, body,  recipients);
//
//		buildAttachment(attachment, email);
//
//		email.send();
//		return true;
//	}
//	
//	public static boolean send(final String subject, final String body, final MailConfig mailConfig,
//			final File attachment, final String  recipients, String cc) throws Exception {
//
//		MultiPartEmail email = new MultiPartEmail();
//		buildEmailConfig(email, mailConfig);
//		buildEmail(email, subject, body,  recipients, cc);
//
//		buildAttachment(attachment, email);
//
//		email.send();
//		return true;
//	}
//	
//	/**
//	 * attachment name come from map key
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachmentList
//	 * @param  recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean send(final String subject, final String body, final MailConfig mailConfig,
//			final Map<String, File> attachmentMap, final String  recipients) throws Exception {
//
//		MultiPartEmail email = new MultiPartEmail();
//		buildEmailConfig(email, mailConfig);
//		buildEmail(email, subject, body,  recipients);
//
//		buildAttachment(attachmentMap, email);
//
//		email.send();
//		return true;
//	}
//	
//	/**
//	 * Send Html mail with attachment. attachment name will come from Map key
//	 * @param subject
//	 * @param body
//	 * @param mailConfig
//	 * @param attachmentMap
//	 * @param recipients
//	 * @return
//	 * @throws Exception
//	 */
//	public static boolean sendHtmlMailWithAttachment(final String subject, final String body, final MailConfig mailConfig,
//			final Map<String, File> attachmentMap, final String  recipients) throws Exception {
//
//		HtmlEmail email = new HtmlEmail();
//		buildEmailConfig(email, mailConfig);
//		buildEmail(email, subject, body,  recipients);
//
//		buildAttachment(attachmentMap, email);
//
//		email.send();
//		return true;
//	}
//
//	private static void buildAttachment(final List<File> attachmentList, MultiPartEmail email) throws Exception {
//		for (File file : attachmentList) {
//			email.attach(buildAttachment(file));
//		}
//	}
//	private static void buildAttachment(final File attachment, MultiPartEmail email) throws Exception {
//		email.attach(buildAttachment(attachment));
//	}
//	private static void buildAttachment(final Map<String, File> attachmentMap, MultiPartEmail email) throws Exception {
//		for (Map.Entry<String, File> entry : attachmentMap.entrySet()) {
//			email.attach(buildAttachment(entry.getValue(), entry.getKey()));
//		}
//	}
//	
//	private static EmailAttachment buildAttachment(final File attachment) throws Exception {
//		EmailAttachment attachmentMail = new EmailAttachment();
//		attachmentMail.setPath(attachment.getPath());
//		attachmentMail.setDisposition(EmailAttachment.ATTACHMENT);
//		attachmentMail.setName(attachment.getName());
//		return attachmentMail;
//	}
//	
//	
//	private static EmailAttachment buildAttachment(final File attachment, String fileName) throws Exception {
//		EmailAttachment attachmentMail = new EmailAttachment();
//		attachmentMail.setPath(attachment.getPath());
//		attachmentMail.setDisposition(EmailAttachment.ATTACHMENT);
//		attachmentMail.setName(fileName);
//		return attachmentMail;
//	}
//
//	private static void buildEmailConfig(final Email email, final MailConfig mailConfig) throws Exception {
//		email.setHostName(mailConfig.getHostName());
//		email.setSmtpPort(mailConfig.getPort());
//		if(mailConfig.isAuthenticate()){
//			email.setAuthenticator(new DefaultAuthenticator(mailConfig.getUsername(), mailConfig.getPassword()));
//		}	
//		email.setSSLOnConnect(mailConfig.isSsl());
//		if(mailConfig.getProps() != null && mailConfig.getProps().size() > 0){
//			for(Map.Entry<String, Object> entry : mailConfig.getProps().entrySet()){
//				email.getMailSession().getProperties().put(entry.getKey(), entry.getValue());
//			}
//		}
//		
//		if(mailConfig.getBounceAddress() != null && mailConfig.getBounceAddress().length() > 0){
//			email.setBounceAddress(mailConfig.getBounceAddress());
//		}
//		email.setStartTLSEnabled(mailConfig.isTsl());
//		email.setFrom(mailConfig.getFrom());
//	}
//
//	private static void buildEmail(Email email, final String subject, final String body, String  recipients)throws Exception {
//		email.setSubject(subject);
//		email.setMsg(body);
//		email.addTo(recipients.split(COMMA));
//	}
//	
//	private static void buildEmail(Email email, final String subject, final String body, String  recipients, String cc)throws Exception {
//		email.setSubject(subject);
//		email.setMsg(body);
//		email.addTo(recipients.split(COMMA));
//		if(!StringUtils.isBlank(cc)) {
//			email.addCc(cc.split(COMMA));
//		}
//	}
//
//}
