package com.softcafesolution.core.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name="T_CUSTOMER")
public class Customer extends BaseSoftcafe {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_CUSTOMER")
    @SequenceGenerator(sequenceName = "SEQ_CUSTOMER", allocationSize = 1, name = "SEQ_CUSTOMER")
	@Column(name ="customer_key")
	private Long customerId;
	
	
	@Column(name ="customer_name", length = 64, unique = true)
	private Long customerName;
	
	@Column(name ="display_name", length = 64, unique = true)
	private Long displayName;
	
	@Column(name ="enterprice_name", length = 64, unique = true)
	private String enterpriceName;
	
	@Column(name ="application_name", length = 64, unique = true)
	private String applicationName;
	
	@Column(name ="domain_name", length = 64, unique = true)
	private String domainName;
	
	
	@Column(name ="own_email_server")
	private int ownEmailServer;
	
	
	
	@Column(name ="service_account_json")
	@Lob @Basic(fetch=FetchType.LAZY)
	private String serviceAccount;
	
	
	
	
	

}
