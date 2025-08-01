package com.softcafesolution.core.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;

import java.util.Date;
import java.util.List;


@Entity
//@Table(name="T_USER", uniqueConstraints = @UniqueConstraint(columnNames = { "tx_login_name", "customer_key" }, name = "unique_login_name"))
@Table(name="T_USER")
@DynamicUpdate
public class User extends BaseEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_USER") //for oracle
    @SequenceGenerator(sequenceName = "SEQ_USER", allocationSize = 1, name = "SEQ_USER") //for oracle
	@Column(name = "id_user_key")
	private Long userId;
	
	@Column(name = "tx_first_name", length = 64)
	private String firstName;
	
	@Column(name = "tx_middle_name", length = 64)
	private String middleName;
	
	@Column(name = "tx_last_name", length = 64)
	private String lastName;
	
	@Column(name = "tx_full_name", length = 258)
	private String fullName;
	
	@Column(name = "dtt_dob")
	private Date dob;
	
	@Column(name = "tx_country", length = 64)
	private String country;
	
	@Column(name = "tx_phone_number", length = 16)
	private String phoneNumber;
	
	@Column(name = "tx_email", length = 64)
	private String email;
	
	@Column(name = "tx_login_name", length = 32)
	private String loginName;

	@Column(name = "tx_password", length = 64)
	private String password;
	
	@Column(name = "tx_remarks", length = 64)
	private String remarks;
	
	
	
	@Column(name = "tx_gender", length = 8)
	private String gender;
	
	@Column(name = "tx_religion", length = 32)
	private String religion;
	
	@Column(name = "int_allow_login")
	private int allowLogin;
	
	@Column(name = "int_pass_expired")
	private Integer passExpired;
	
	@Column(name = "int_two_factor_auth")
	private Integer twoFactorAuth;// two factor authentication
	
	@Column(name = "tx_verify_code", length = 64)
	private String verificationCode;

	
	
	@Column(name = "tx_new_pass", length = 64)
	private String newPass; // use when change password
	
	@Column(name = "tx_tmp_pass", length = 64)
	private String tmpPass;// use when forgot password
	
	@Column(name = "id_legal_entity_key")
	private Integer branchId;
	
	@Column(name = "tx_branch", length = 64)
	private String branch;
	
	@Column(name = "tx_designation", length = 64)
	private String designation;
	
	@Column(name = "tx_nid", length = 64)
	private String nid;

	@Column(name = "tx_login_method", length = 64)
	private String logingMethod = "LDAP";
	
	@Column(name = "tx_user_status", length = 64)
	private String userStatus;
	
	@Column(name = "tx_employee_id", length = 64)
	private String employeeId;

	@Column(name = "dt_inactive_date")
	private Date inactiveDate;
	
	@Transient
	private String defaultAdPass;

	@Transient
	private String branchName;
	
	@Transient
	private List<Long> departmentIdList;

	@Transient
	private List<User> userList;
	
	@Transient
	private List<Role> roleList;// role assign for this user
	@Transient
	private List<AppPermission> permissionList;// role assign for this user

	@Transient
	private List<Role> unassignRoleList;// role than are not assign for this user
	//@Transient
	//private List<AppPermission> appPermissionList;// AppPermission assign for this user
	
	@Transient
	private List<RoleGroup> roleGroupList;// role assign for this user
	
	@Transient
	private List<RoleGroup> unassignRoleGroupList;// role than are not assign for this user

	public List<RoleGroup> getRoleGroupList() {
		return roleGroupList;
	}
	public void setRoleGroupList(List<RoleGroup> roleGroupList) {
		this.roleGroupList = roleGroupList;
	}
	public List<RoleGroup> getUnassignRoleGroupList() {
		return unassignRoleGroupList;
	}
	public void setUnassignRoleGroupList(List<RoleGroup> unassignRoleGroupList) {
		this.unassignRoleGroupList = unassignRoleGroupList;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getMiddleName() {
		return middleName;
	}
	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public Date getDob() {
		return dob;
	}
	public void setDob(Date dob) {
		this.dob = dob;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getReligion() {
		return religion;
	}
	public void setReligion(String religion) {
		this.religion = religion;
	}
	public Integer getAllowLogin() {
		return allowLogin;
	}
	public void setAllowLogin(Integer allowLogin) {
		this.allowLogin = allowLogin;
	}
	public Integer getPassExpired() {
		return passExpired;
	}
	public void setPassExpired(Integer passExpired) {
		this.passExpired = passExpired;
	}
	public Integer getTwoFactorAuth() {
		return twoFactorAuth;
	}
	public void setTwoFactorAuth(Integer twoFactorAuth) {
		this.twoFactorAuth = twoFactorAuth;
	}
	public String getVerificationCode() {
		return verificationCode;
	}
	public void setVerificationCode(String verificationCode) {
		this.verificationCode = verificationCode;
	}
	public String getNewPass() {
		return newPass;
	}
	public void setNewPass(String newPass) {
		this.newPass = newPass;
	}
	public String getTmpPass() {
		return tmpPass;
	}
	public void setTmpPass(String tmpPass) {
		this.tmpPass = tmpPass;
	}
	public List<User> getUserList() {
		return userList;
	}
	public void setUserList(List<User> userList) {
		this.userList = userList;
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
	
	public Integer getBranchId() {
		return branchId;
	}
	public void setBranchId(Integer branchId) {
		this.branchId = branchId;
	}
	public String getLogingMethod() {
		return logingMethod;
	}
	public void setLogingMethod(String logingMethod) {
		this.logingMethod = logingMethod;
	}
	public String getDefaultAdPass() {
		return defaultAdPass;
	}
	public void setDefaultAdPass(String defaultAdPass) {
		this.defaultAdPass = defaultAdPass;
	}
	public String getBranchName() {
		return branchName;
	}
	public void setBranchName(String branchName) {
		this.branchName = branchName;
	}
	public List<Long> getDepartmentIdList() {
		return departmentIdList;
	}
	public void setDepartmentIdList(List<Long> departmentIdList) {
		this.departmentIdList = departmentIdList;
	}
	public void setAllowLogin(int allowLogin) {
		this.allowLogin = allowLogin;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	public void setInactiveDate(Date inactiveDate) {
		this.inactiveDate = inactiveDate;
	}

	public Date getInactiveDate() {
		return inactiveDate;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getDesignation() {
		return designation;
	}

	public void setDesignation(String designation) {
		this.designation = designation;
	}

	public String getNid() {
		return nid;
	}

	public void setNid(String nid) {
		this.nid = nid;
	}

	public List<AppPermission> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<AppPermission> permissionList) {
		this.permissionList = permissionList;
	}
	public String getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}
	
}

