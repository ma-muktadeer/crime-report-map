package com.softcafesolution.core.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

@MappedSuperclass
class BaseSoftcafe{

	@Column(name = "is_active", nullable = false)
	protected int active = 1;
	
//	@Version
	@Column(name = "item_version", nullable = false)
	protected int version = 0;
	
	@Column(name = "user_mod_key", nullable = false)
	protected Long userModId;

    @Column(name = "creator_key", updatable = false, nullable = false)
	protected Long creatorId;

	@Column(name = "checker_key")
	protected Long checkerId;

	@Column(name = "checker_time")
	protected Date checkerTime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "mod_time", nullable = false)
	@LastModifiedDate
	protected Date modTime = new Date();
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "entry_time" , nullable = true, updatable = false)
	@CreatedDate
	protected Date entryTime = new Date();

    @Column(name = "tx_status", length = 32)
	private String status;
	
	
	@Transient
	protected Date fromDate;
	
	@Transient
	protected Date toDate;
	


    @PrePersist
	void prePersist() {
		this.active= 1;
		this.version = 0;
	}
	
	@PreUpdate
	void preUpdate() {
		this.version = this.version + 1;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public Long getUserModId() {
		return userModId;
	}

	public void setUserModId(Long userModId) {
		this.userModId = userModId;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	public Long getCheckerId() {
		return checkerId;
	}

	public void setCheckerId(Long checkerId) {
		this.checkerId = checkerId;
	}

	public Date getCheckerTime() {
		return checkerTime;
	}

	public void setCheckerTime(Date checkerTime) {
		this.checkerTime = checkerTime;
	}

	public Date getModTime() {
		return modTime;
	}

	public void setModTime(Date modTime) {
		this.modTime = modTime;
	}

	public Date getEntryTime() {
		return entryTime;
	}

	public void setEntryTime(Date entryTime) {
		this.entryTime = entryTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}
}
