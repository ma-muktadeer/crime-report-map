package com.softcafesolution.core.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import java.util.List;

@Entity
@Table(name ="T_ROLE")
public class Role extends BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLE_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "ROLE_SEQ", allocationSize = 1, name = "ROLE_SEQ") //for oracle
	@Column(name ="id_role_key")
	private Long roleId;

	
	@Column(name ="tx_role_group", length = 64)
	private String roleGroup;
	
	@Column(name ="tx_role_type", length = 64)
	private String roleType;
	
	@Column(name ="tx_role_name", length = 64)
	private String roleName;
	
	@Column(name ="tx_display_name", length = 64)
	private String displayName;
	
	@Column(name ="tx_desc", length = 64)
	private String desc;
	
	
	
	
	//------------- END TABLE COLUNM----------------------------
	@Transient
	private boolean assign;
	
	@Transient
	List<AppPermission> permissionList;
	
	@Transient
	List<AppPermission> unassignedPermissionList;
	
	@Transient
	String genericMapStatus;
	
	@Transient
	private List<AppPermission> appPermissionList;// AppPermission assign for this user
	
	

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}


	public String getRoleName() {
		return roleName;
	}


	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}


	public String getRoleType() {
		return roleType;
	}


	public void setRoleType(String roleType) {
		this.roleType = roleType;
	}


	public String getRoleGroup() {
		return roleGroup;
	}


	public void setRoleGroup(String roleGroup) {
		this.roleGroup = roleGroup;
	}

	

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public boolean isAssign() {
		return assign;
	}


	public void setAssign(boolean assign) {
		this.assign = assign;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}


	public String getGenericMapStatus() {
		return genericMapStatus;
	}

	public void setGenericMapStatus(String genericMapStatus) {
		this.genericMapStatus = genericMapStatus;
	}


	public List<AppPermission> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<AppPermission> permissionList) {
		this.permissionList = permissionList;
	}

	public List<AppPermission> getUnassignedPermissionList() {
		return unassignedPermissionList;
	}

	public void setUnassignedPermissionList(List<AppPermission> unassignedPermissionList) {
		this.unassignedPermissionList = unassignedPermissionList;
	}

	public List<AppPermission> getAppPermissionList() {
		return appPermissionList;
	}

	public void setAppPermissionList(List<AppPermission> appPermissionList) {
		this.appPermissionList = appPermissionList;
	}


	
}
