package com.softcafesolution.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "T_MAIL_CONFIG")
public class MailConfig extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_MAIL_CONFIG") //for oracle
    @SequenceGenerator(sequenceName = "SEQ_MAIL_CONFIG", allocationSize = 1, name = "SEQ_MAIL_CONFIG") //for oracle
	@Column(name = "mail_config_key")
	private Integer mailConfigId;
	
	@Column(name = "host_name", length = 32)
	private String hostName;
	
	@Column(name = "port")
	private int port;
	
	@Column(name = "username", length = 64)
	private String username;
	
	@Column(name = "password", length = 64)
	private String password;
	
	@Column(name = "ssl")
	private boolean ssl;
	
	@Column(name = "tsl")
	private boolean tsl;
	
	
	@Column(name = "bounce_address", length = 64)
	private String bounceAddress;
	
	
	@Column(name = "authenticate")
	private boolean authenticate;
	
	@Column(name = "tx_from", length = 64)
	private String from;
	
	@Column(name = "from_name", length = 64)
	private String fromName;
	
	
}
