package com.softcafesolution.dgfi.model;

public class ChartMetaDeta {
	
	private String name;
	private Long count;
	
	public ChartMetaDeta(Long count, String name) {
		this.name = name;
		this.count = count;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	public Long getCount() {
		return count;
	}
	public void setCount(Long count) {
		this.count = count;
	}
	
	

}
