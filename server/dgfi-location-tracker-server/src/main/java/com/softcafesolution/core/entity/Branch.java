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
@Table(name="T_BRANCH")
public class Branch extends BaseEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_TBLBRN")
    @SequenceGenerator(sequenceName = "SEQ_TBLBRN", allocationSize = 1, name = "SEQ_TBLBRN")
	@Column(name="id_branch_key")
	private Long branchId;
	
	@Column(name="BANK_CODE",length = 18)
	private String bankCode;
	
	@Column(name="BANK_NAME",length = 128)
	private String bankName;
	
	@Column(name="DISTRICT_CODE",length = 18)
	private String distCode;
	
	@Column(name="DISTRICT_NAME",length = 96)
	private String distName;
	
	@Column(name="BRANCH_CODE",length = 18)
	private String branchCode;
	
	@Column(name="TX_BRANCH_NAME",length = 128)
	private String branchName;
	
	@Column(name="ROUTING_NO",length = 64)
	private String routingNo;
	
	@Column(name="dtt_entry_date")
	private Date entryDate;
	
	@Column(name="DESCRIPTION",length = 128)
	private String description;

	public Long getBranchId() {
		return branchId;
	}

	public void setBranchId(Long branchId) {
		this.branchId = branchId;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getDistCode() {
		return distCode;
	}

	public void setDistCode(String distCode) {
		this.distCode = distCode;
	}

	public String getDistName() {
		return distName;
	}

	public void setDistName(String distName) {
		this.distName = distName;
	}

	public String getBranchCode() {
		return branchCode;
	}

	public void setBranchCode(String branchCode) {
		this.branchCode = branchCode;
	}

	public String getBranchName() {
		return branchName;
	}

	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}

	public String getRoutingNo() {
		return routingNo;
	}

	public void setRoutingNo(String routingNo) {
		this.routingNo = routingNo;
	}

	public Date getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(Date entryDate) {
		this.entryDate = entryDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	

}
