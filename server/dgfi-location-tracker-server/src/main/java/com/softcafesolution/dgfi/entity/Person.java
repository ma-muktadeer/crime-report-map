package com.softcafesolution.dgfi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "T_PERSON")
public class Person {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_person_key")
	private Long personId;
	
	@Column(name="id_crime_key", nullable = false)
	private Long crimeId;

	@Column(name="tx_name", columnDefinition = "NVARCHAR(MAX)", length = 60)
	private String name;
	
	@Column(name="tx_introduction", columnDefinition = "NVARCHAR(MAX)", length = 156)
	private String introduction;
	
	@Column(name="tx_political_party_name",  columnDefinition = "NVARCHAR(MAX)", length = 100)
	private String politicalPartyName;
	
	@Column(name="tx_person_type",  columnDefinition = "NVARCHAR(MAX)", length = 10)
	private String type;


	public Long getPersonId() {
		return personId;
	}

	public void setPersonId(Long personId) {
		this.personId = personId;
	}

	public Long getCrimeId() {
		return crimeId;
	}

	public void setCrimeId(Long crimeId) {
		this.crimeId = crimeId;
	}

	public String getIntroduction() {
		return introduction;
	}

	public void setIntroduction(String introduction) {
		this.introduction = introduction;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPoliticalPartyName() {
		return politicalPartyName;
	}

	public void setPoliticalPartyName(String politicalPartyName) {
		this.politicalPartyName = politicalPartyName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	
	
}
