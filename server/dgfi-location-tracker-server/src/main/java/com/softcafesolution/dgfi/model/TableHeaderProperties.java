package com.softcafesolution.dgfi.model;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "tabular")
public class TableHeaderProperties {

	private Default Default = new Default();
    private Table table = new Table();

    public Default getDefault() {
		return Default;
	}

	public void setDefault(Default default1) {
		Default = default1;
	}

	public Table getTable() {
        return table;
    }

    public void setTable(Table table) {
        this.table = table;
    }

    public static class Default {
        private Map<String, String> header = new HashMap<>();

        public Map<String, String> getHeader() {
            return header;
        }

        public void setHeader(Map<String, String> header) {
            this.header = header;
        }
    }

    public static class Table {
        private Map<Long, Map<String, String>> header = new HashMap<>();

        public Map<Long, Map<String, String>> getHeader() {
            return header;
        }

        public void setHeader(Map<Long, Map<String, String>> header) {
            this.header = header;
        }
    }
}
