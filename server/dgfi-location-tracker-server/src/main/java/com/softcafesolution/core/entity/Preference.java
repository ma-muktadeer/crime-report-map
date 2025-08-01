package com.softcafesolution.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name ="T_PREFERENCE")
public class Preference extends BaseEntity{
	
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PREFERENCE_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "PREFERENCE_SEQ", allocationSize = 1, name = "PREFERENCE_SEQ") //for oracle
	@Column(name ="id_pref_key")
	private Long prefId;
	
	
	@Column(name ="tx_pref_group", length = 64)
	private String prefGroup;
	@Column(name ="tx_pref_name", length = 64)
	private String prefName;
	@Column(name ="tx_pref_value", length = 64)
	private String prefValue;
	@Column(name ="tx_pref_desc", length = 64)
	private String prefDesc;
	public Long getPrefId() {
		return prefId;
	}
	public void setPrefId(Long prefId) {
		this.prefId = prefId;
	}
	
	public String getPrefGroup() {
		return prefGroup;
	}
	public void setPrefGroup(String prefGroup) {
		this.prefGroup = prefGroup;
	}
	public String getPrefName() {
		return prefName;
	}
	public void setPrefName(String prefName) {
		this.prefName = prefName;
	}
	public String getPrefValue() {
		return prefValue;
	}
	public void setPrefValue(String prefValue) {
		this.prefValue = prefValue;
	}
	public String getPrefDesc() {
		return prefDesc;
	}
	public void setPrefDesc(String prefDesc) {
		this.prefDesc = prefDesc;
	}
	
	
	

}
