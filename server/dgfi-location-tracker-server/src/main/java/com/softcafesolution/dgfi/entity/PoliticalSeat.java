package com.softcafesolution.dgfi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class PoliticalSeat {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_political_seat_key")
	private Long politicalSeat;
	
	@Column(name="id_location_key")
	private Long locationId;
	
	@Column(name="tx_name_bn", columnDefinition = "NVARCHAR(100)", length = 100)
	private String nameBn;

	@Column(name="tx_name_en", length = 100)
	private String nameEn;
	
	@Column(name="tx_type", length = 56)
	private String type;

	public Long getPoliticalSeat() {
		return politicalSeat;
	}

	public void setPoliticalSeat(Long politicalSeat) {
		this.politicalSeat = politicalSeat;
	}

	public Long getLocationId() {
		return locationId;
	}

	public void setLocationId(Long locationId) {
		this.locationId = locationId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getNameBn() {
		return nameBn;
	}

	public void setNameBn(String nameBn) {
		this.nameBn = nameBn;
	}

	public String getNameEn() {
		return nameEn;
	}

	public void setNameEn(String nameEn) {
		this.nameEn = nameEn;
	}
	
	

}
