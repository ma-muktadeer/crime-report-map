package com.softcafesolution.dgfi.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "T_LOCATION")
public class Location {
	@Id
	@Column(name = "id_location_key")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idLocationKey;

	@Column(name = "id_location_ver", nullable = false)
	private Long idLocationVer;

	@Column(name = "is_active", nullable = false)
	private int isActive = 1;

	@Column(name = "dtt_create", nullable = false)
	private LocalDateTime createDateTime;

	@Column(name = "tx_loc_name", nullable = false, length = 64)
	private String locationName;
	
	@Column(name = "tx_loc_name_bn", nullable = false, columnDefinition = "NVARCHAR(100)")
	private String locationNameBn;

	@Column(name = "tx_loc_type", nullable = false, length = 64)
	private String locationType;//Division,Country,District

	@Column(name = "id_parent_key")
	private Long parentKey;

	@Column(name = "tx_parent_name", length = 64)
	private String parentName;

	@Column(name = "tx_currency", length = 8)
	private String currency;

	@Column(name = "tx_corrency_code", length = 16)
	private String currencyCode;

	@Column(name = "dec_latitude", precision = 15, scale = 10)
	private BigDecimal latitude;

	@Column(name = "dec_longitude", precision = 15, scale = 10)
	private BigDecimal longitude;

	@Column(name = "tx_desc", length = 128)
	private String description;

	@Column(name = "tx_short_name", length = 16)
	private String shortName;


	public Long getIdLocationKey() {
		return idLocationKey;
	}

	public void setIdLocationKey(Long idLocationKey) {
		this.idLocationKey = idLocationKey;
	}

	public Long getIdLocationVer() {
		return idLocationVer;
	}

	public void setIdLocationVer(Long idLocationVer) {
		this.idLocationVer = idLocationVer;
	}

	public int getIsActive() {
		return isActive;
	}

	public void setIsActive(int isActive) {
		this.isActive = isActive;
	}

	public LocalDateTime getCreateDateTime() {
		return createDateTime;
	}

	public void setCreateDateTime(LocalDateTime createDateTime) {
		this.createDateTime = createDateTime;
	}

	public String getLocationName() {
		return locationName;
	}

	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}

	public String getLocationType() {
		return locationType;
	}

	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}

	public Long getParentKey() {
		return parentKey;
	}

	public void setParentKey(Long parentKey) {
		this.parentKey = parentKey;
	}

	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getCurrencyCode() {
		return currencyCode;
	}

	public void setCurrencyCode(String currencyCode) {
		this.currencyCode = currencyCode;
	}

	public BigDecimal getLatitude() {
		return latitude;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	public BigDecimal getLongitude() {
		return longitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getLocationNameBn() {
		return locationNameBn;
	}

	public void setLocationNameBn(String locationNameBn) {
		this.locationNameBn = locationNameBn;
	}

	

}