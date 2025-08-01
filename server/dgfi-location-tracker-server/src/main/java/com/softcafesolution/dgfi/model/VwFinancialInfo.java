package com.softcafesolution.dgfi.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "VW_FININCIAL_DATA")
public class VwFinancialInfo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_financial_key")
	private Long finincialId;

	@Column(name = "is_active")
	protected int active;
	
	@Column(name="dec_price")
	private Double decPrice;
	
	@Column(name = "st_date")
	protected String stDate;
	
	@Column(name = "dtt_date")
	protected Date dttDate;
	
	@Column(name = "tx_type")
	protected String txType;

	@Column(name = "id_product_name") 
	protected Long idProductName;

	@Column(name = "id_unit_name")
	protected Long idUnitName;

	@Column(name = "dec_quantity")
	protected Double decQuantity;
	
	@Column(name = "tx_unit")
	protected String txUnit;

	@Column(name = "tx_product_name")
	private String txProductName;

	@Column(name = "tx_product_unit_name")
	private String txProductUnitName;

	public Long getFinincialId() {
		return finincialId;
	}

	public void setFinincialId(Long finincialId) {
		this.finincialId = finincialId;
	}

	public Double getDecPrice() {
		return decPrice;
	}

	public void setDecPrice(Double decPrice) {
		this.decPrice = decPrice;
	}

	
	public String getStDate() {
		return stDate;
	}

	public void setStDate(String stDate) {
		this.stDate = stDate;
	}

	public Date getDttDate() {
		return dttDate;
	}

	public void setDttDate(Date dttDate) {
		this.dttDate = dttDate;
	}

	public String getTxType() {
		return txType;
	}

	public void setTxType(String txType) {
		this.txType = txType;
	}

	public Long getIdProductName() {
		return idProductName;
	}

	public void setIdProductName(Long idProductName) {
		this.idProductName = idProductName;
	}

	public Long getIdUnitName() {
		return idUnitName;
	}

	public void setIdUnitName(Long idUnitName) {
		this.idUnitName = idUnitName;
	}

	public Double getDecQuantity() {
		return decQuantity;
	}

	public void setDecQuantity(Double decQuantity) {
		this.decQuantity = decQuantity;
	}

	public String getTxUnit() {
		return txUnit;
	}

	public void setTxUnit(String txUnit) {
		this.txUnit = txUnit;
	}

	public String getTxProductName() {
		return txProductName;
	}

	public void setTxProductName(String txProductName) {
		this.txProductName = txProductName;
	}

	public String getTxProductUnitName() {
		return txProductUnitName;
	}

	public void setTxProductUnitName(String txProductUnitName) {
		this.txProductUnitName = txProductUnitName;
	}

	

}
