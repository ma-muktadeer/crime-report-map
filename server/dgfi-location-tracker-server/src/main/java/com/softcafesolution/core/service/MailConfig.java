package com.softcafesolution.core.service;

import java.util.Map;

public class MailConfig {
	
	private String hostName;
	private int port;
	private String username;
	private String password;
	private boolean ssl;
	private boolean tsl;
	
	private String bounceAddress;
	
	private boolean authenticate;
	private String from;
	private String fromName;
	
	private Map<String, Object> props;	
		
	
	
	public String getHostName() {
		return hostName;
	}
	public void setHostName(String hostName) {
		this.hostName = hostName;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean isSsl() {
		return ssl;
	}
	public void setSsl(boolean ssl) {
		this.ssl = ssl;
	}
	public boolean isTsl() {
		return tsl;
	}
	public void setTsl(boolean tsl) {
		this.tsl = tsl;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public Map<String, Object> getProps() {
		return props;
	}
	public void setProps(Map<String, Object> props) {
		this.props = props;
	}
	public boolean isAuthenticate() {
		return authenticate;
	}
	public void setAuthenticate(boolean authenticate) {
		this.authenticate = authenticate;
	}
	public String getBounceAddress() {
		return bounceAddress;
	}
	public void setBounceAddress(String bounceAddress) {
		this.bounceAddress = bounceAddress;
	}
	public String getFromName() {
		return fromName;
	}
	public void setFromName(String fromName) {
		this.fromName = fromName;
	}
	@Override
	public String toString() {
		return "MailConfig [hostName=" + hostName + ", port=" + port + ", username=" + username + ", password="
				+ password + ", ssl=" + ssl + ", tsl=" + tsl + ", bounceAddress=" + bounceAddress + ", authenticate="
				+ authenticate + ", from=" + from + ", fromName=" + fromName + ", props=" + props + "]";
	}
	
	
	

}
