package com.softcafesolution.dgfi.entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.softcafesolution.core.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name="T_FININCIAL_DATA")
public class Finincial extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_financial_key")
	private Long finincialId;
	
	@Column(name="dec_price")
	private Double price;
	
	@Column(name = "dtt_date")
	protected Date dttDate;
	
	@Column(name = "tx_type", length = 20)
	protected String type;

	@Column(name = "id_product_name") // sConfig table configId
	protected Long idProductName;

	@Column(name = "id_unit_name") // sConfig table configId
	protected Long idUnitName;

	@Column(name = "dec_quantity")
	protected Double quantity;
	
	@Column(name = "tx_unit", length = 20)
	protected String unit;
	
	@Transient
	private List<Long> idProductNameList = new ArrayList<>();

	@Transient
	private String compareBy;
	@Transient
	private String chartType;

	public Long getFinincialId() {
		return finincialId;
	}

	public void setFinincialId(Long finincialId) {
		this.finincialId = finincialId;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Date getDttDate() {
		return dttDate;
	}

	public void setDttDate(Date dttDate) {
		this.dttDate = dttDate;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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

	public Double getQuantity() {
		return quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public List<Long> getIdProductNameList() {
		return idProductNameList;
	}

	public void setIdProductNameList(List<Long> idProductNameList) {
		this.idProductNameList = idProductNameList;
	}

	public String getCompareBy() {
		return compareBy;
	}

	public void setCompareBy(String compareBy) {
		this.compareBy = compareBy;
	}

	public String getChartType() {
		return chartType;
	}

	public void setChartType(String chartType) {
		this.chartType = chartType;
	}
	
	
	

}
