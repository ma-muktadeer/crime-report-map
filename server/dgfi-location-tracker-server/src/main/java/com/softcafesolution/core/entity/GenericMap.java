package com.softcafesolution.core.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name="T_GENERIC_MAP")
public class GenericMap extends BaseEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_GENMAP") //for oracle
    @SequenceGenerator(sequenceName = "SEQ_GENMAP", allocationSize = 1, name = "SEQ_GENMAP") //for oracle
	@Column(name ="id_generic_map_key")
	private Long genericMapId;
	
	
	@Column(name ="tx_from_type_name", length = 64)
	private String fromTypeName;
	
	@Column(name ="lng_from_id")
	private Long fromId;
	
	@Column(name ="tx_to_type_name", length = 64)
	private String toTypeName;
	
	@Column(name ="lng_to_id")
	private Long toId;
	
	
	// -------------- end table column-------------------
	
	@Transient
	private List<GenericMap> genericMapList;

	public Long getGenericMapId() {
		return genericMapId;
	}

	public void setGenericMapId(Long genericMapId) {
		this.genericMapId = genericMapId;
	}


	public String getFromTypeName() {
		return fromTypeName;
	}

	public void setFromTypeName(String fromTypeName) {
		this.fromTypeName = fromTypeName;
	}

	public Long getFromId() {
		return fromId;
	}

	public void setFromId(Long fromId) {
		this.fromId = fromId;
	}

	public String getToTypeName() {
		return toTypeName;
	}

	public void setToTypeName(String toTypeName) {
		this.toTypeName = toTypeName;
	}

	public Long getToId() {
		return toId;
	}

	public void setToId(Long toId) {
		this.toId = toId;
	}

	public List<GenericMap> getGenericMapList() {
		return genericMapList;
	}

	public void setGenericMapList(List<GenericMap> genericMapList) {
		this.genericMapList = genericMapList;
	}

	
}
