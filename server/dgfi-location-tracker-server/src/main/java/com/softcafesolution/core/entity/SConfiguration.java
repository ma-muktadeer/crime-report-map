package com.softcafesolution.core.entity;

import java.util.Date;

import org.hibernate.annotations.DynamicUpdate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name="T_CONFIGURATION")
@DynamicUpdate
public class SConfiguration extends BaseEntity{
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_config_key")
	private Long configId;
		
	
	@Column(name = "tx_config_group", length = 32)
	private String configGroup;
	@Column(name = "tx_config_sub_group", length = 32)
	private String configSubGroup;
	@Column(name = "tx_config_name", length = 32)
	private String configName;
	@Column(name = "tx_value1", columnDefinition = "NVARCHAR(MAX)", length = 200)
	private String value1;
	@Column(name = "tx_value2", length = 64)
	private String value2;
	@Column(name = "tx_value3", length = 32)
	private String value3;
	@Column(name = "tx_value4", length = 32)
	private String value4;
	@Column(name = "tx_value5", length = 32)
	private String value5;
	

	@Column(name = "tx_comments", length = 64)
	private String comments;

	@Column(name = "tx_notes", length = 64)
	private String notes;
	
	@Column(name = "id_approved_by_id")
	protected Long approveById;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "dtt_approve")
	protected Date approveTime;

	public Long getConfigId() {
		return configId;
	}

	public void setConfigId(Long configId) {
		this.configId = configId;
	}

	public String getConfigGroup() {
		return configGroup;
	}

	public void setConfigGroup(String configGroup) {
		this.configGroup = configGroup;
	}

	public String getConfigSubGroup() {
		return configSubGroup;
	}

	public void setConfigSubGroup(String configSubGroup) {
		this.configSubGroup = configSubGroup;
	}

	public String getConfigName() {
		return configName;
	}

	public void setConfigName(String configName) {
		this.configName = configName;
	}

	public String getValue1() {
		return value1;
	}

	public void setValue1(String value1) {
		this.value1 = value1;
	}

	public String getValue2() {
		return value2;
	}

	public void setValue2(String value2) {
		this.value2 = value2;
	}

	public String getValue3() {
		return value3;
	}

	public void setValue3(String value3) {
		this.value3 = value3;
	}

	public String getValue4() {
		return value4;
	}

	public void setValue4(String value4) {
		this.value4 = value4;
	}

	public String getValue5() {
		return value5;
	}

	public void setValue5(String value5) {
		this.value5 = value5;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Long getApproveById() {
		return approveById;
	}

	public void setApproveById(Long approveById) {
		this.approveById = approveById;
	}

	public Date getApproveTime() {
		return approveTime;
	}

	public void setApproveTime(Date approveTime) {
		this.approveTime = approveTime;
	}
}
