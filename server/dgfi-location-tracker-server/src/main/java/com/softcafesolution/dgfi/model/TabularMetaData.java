package com.softcafesolution.dgfi.model;

import java.util.List;
import java.util.Map;

public class TabularMetaData {
	private String title;
	private List<VwCrimeInfo> tabularData;
	private Map<String, String> header;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public List<VwCrimeInfo> getTabularData() {
		return tabularData;
	}
	public void setTabularData(List<VwCrimeInfo> tabularData) {
		this.tabularData = tabularData;
	}
	public Map<String, String> getHeader() {
		return header;
	}
	public void setHeader(Map<String, String> header) {
		this.header = header;
	}
	
	
}
