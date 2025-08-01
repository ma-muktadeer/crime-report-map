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
@Table(name = "t_role_group")
public class RoleGroup extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ROLEGROUP_SEQ") //for oracle
    @SequenceGenerator(sequenceName = "ROLEGROUP_SEQ", allocationSize = 1, name = "ROLEGROUP_SEQ") //for oracle
	@Column(name ="id_role_group_key")
	private Long roleGroupId;
	
	@Column(name = "tx_group_name", length = 64)
	private String roleGroupName;
	
	@Transient
	private List<Role> roleList;// role assign for this user
	@Transient
	private List<Role> unassignRoleList;// role than are not assign for this user
	

	public Long getRoleGroupId() {
		return roleGroupId;
	}

	public void setRoleGroupId(Long roleGroupId) {
		this.roleGroupId = roleGroupId;
	}

	

	public String getRoleGroupName() {
		return roleGroupName;
	}

	public void setRoleGroupName(String roleGroupName) {
		this.roleGroupName = roleGroupName;
	}

	public List<Role> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<Role> roleList) {
		this.roleList = roleList;
	}

	public List<Role> getUnassignRoleList() {
		return unassignRoleList;
	}

	public void setUnassignRoleList(List<Role> unassignRoleList) {
		this.unassignRoleList = unassignRoleList;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	
	
	

}
