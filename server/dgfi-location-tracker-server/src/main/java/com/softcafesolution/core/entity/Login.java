package com.softcafesolution.core.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;


@Entity
@Table(name = "T_LOGIN")
public class Login {
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LOGIN_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "LOGIN_SEQ", allocationSize = 1, name = "LOGIN_SEQ") //for oracle
	@Column(name = "id_login_key")
	private Integer loginId;
	
	@Column(name = "id_user_key")
	private Long userId;
	
	@Column(name = "dtt_login_time")
	private Date loginTime;
	
	@Column(name = "dtt_logout_time")
	private Date logoutTime;
	
	@Column(name = "dtt_mod_time")
	private Date modTime;
	
	@Column(name = "tx_id_addr", length = 32)
	private String ipAddr;
	
	@Column(name = "tx_gateway", length = 32)
	private String gateway;
	
	@Column(name = "int_login")
	private Integer login;
	
	//if login success for a attempt
	@Column(name = "int_attempt_status")
	private Integer attemptStatus;
	
	//when success then mark all fail attempt as resolved=1
	@Column(name = "int_fail_resolved")
	private Integer failResolved;
	
	//when success then mark all fail attempt as resolved=1
	@Column(name = "tx_login_name", length = 64)
	private String loginName;
	
	
	
	
	public Integer getLoginId() {
		return loginId;
	}
	public void setLoginId(Integer loginId) {
		this.loginId = loginId;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Date getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}
	public Date getLogoutTime() {
		return logoutTime;
	}
	public void setLogoutTime(Date logoutTime) {
		this.logoutTime = logoutTime;
	}
	public String getIpAddr() {
		return ipAddr;
	}
	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}
	public String getGateway() {
		return gateway;
	}
	public void setGateway(String gateway) {
		this.gateway = gateway;
	}
	public Integer getLogin() {
		return login;
	}
	public void setLogin(Integer login) {
		this.login = login;
	}
	public Integer getAttemptStatus() {
		return attemptStatus;
	}
	public void setAttemptStatus(Integer attemptStatus) {
		this.attemptStatus = attemptStatus;
	}
	public Integer getFailResolved() {
		return failResolved;
	}
	public void setFailResolved(Integer failResolved) {
		this.failResolved = failResolved;
	}
	
	
	
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public Date getModTime() {
		return modTime;
	}
	public void setModTime(Date modTime) {
		this.modTime = modTime;
	}
	
	
}
