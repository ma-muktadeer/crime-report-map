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
@Table(
		name = "T_APP_PERMISSION"
)
public class AppPermission {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "APP_PERMISSION_SEQ")
	@SequenceGenerator(sequenceName = "APP_PERMISSION_SEQ", allocationSize = 1, name = "APP_PERMISSION_SEQ") 
																												
	@Column(name = "id_permission_key")
	private Long permissionId;

	@Column(name = "tx_group", updatable = false, length = 64)
	private String group;

	@Column(name = "tx_sub_group", updatable = false, length = 64)
	private String subGroup;

	@Column(name = "tx_permission_name", unique = true, updatable = false, length = 64)
	private String permissionName;

	@Column(name = "tx_display_name", unique = true, nullable = false, length = 64)
	private String displayName;

	@Column(name = "tx_desc", length = 128)
	private String desc;
	
	@Column(name = "int_active")
	private int active;

	// APPROVED

	@Transient
	String genericMapStatus;

	@Transient
	private List<Role> roleList;

	@Transient
	private List<Role> unassignRoleList;

	public Long getPermissionId() {
		return permissionId;
	}

	public void setPermissionId(Long permissionId) {
		this.permissionId = permissionId;
	}

//	public int getActive() {
//		return active;
//	}
//
//	public void setActive(int active) {
//		this.active = active;
//	}

	public String getPermissionName() {
		return permissionName;
	}

	public void setPermissionName(String permissionName) {
		this.permissionName = permissionName;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public List<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getSubGroup() {
		return subGroup;
	}

	public void setSubGroup(String subGroup) {
		this.subGroup = subGroup;
	}

	public List<Role> getUnassignRoleList() {
		return unassignRoleList;
	}

	public void setUnassignRoleList(List<Role> unassignRoleList) {
		this.unassignRoleList = unassignRoleList;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getGenericMapStatus() {
		return genericMapStatus;
	}

	public void setGenericMapStatus(String genericMapStatus) {
		this.genericMapStatus = genericMapStatus;
	}

	public int getActive() {
		return active;
	}

	public void setActive(int active) {
		this.active = active;
	}

}
