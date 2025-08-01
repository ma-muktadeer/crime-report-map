package com.softcafesolution.core.repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.softcafesolution.core.entity.Role;


public interface RoleRepo extends JpaRepository<Role, Long>, JpaSpecificationExecutor<Role>{
	
	@Query("SELECT T FROM Role T WHERE T.roleId in :roleIdList and active = 1")
	List<Role> findByRoleIds(@Param("roleIdList")Set<Long> roleIdList);
	
	@Query("SELECT T FROM Role T WHERE T.roleId not in :roleIdList and active = 1")
	List<Role> findByRoleIdsNotIn(@Param("roleIdList")Set<Long> roleIdList);
	
	
	@Query(value=" select r.* from t_role r "
			+ " where r.id_role_key in("
			+ "	select lng_to_id from t_generic_map "
			+ "	where tx_from_type_name = 'ROLE_GROUP' and tx_to_type_name = 'ROLE' "
			+ "	and is_active = 1"
			+ "	and lng_from_id in("
			+ "	select lng_to_id from t_generic_map"
			+ "		where tx_from_type_name = 'USER' and tx_to_type_name = 'ROLE_GROUP' "
			+ "		and is_active = 1"
			+ "		and lng_from_id = :userId"
			+ " "
			+ "	)"
			+ ")"
			+ " and r.is_active = 1 ", nativeQuery = true)
	List<Role> selectUserAssignedRoleByRoleGroup(@Param("userId") Long userId);
	
	
	@Query(value=" select r.* from t_role r "
			+ " join T_GENERIC_MAP m on m.tx_to_type_name = 'ROLE' and m.lng_to_id = r.id_role_key and r.is_active = 1 "
			+ " join t_app_permission p on m.tx_from_type_name = 'APP_PERMISSION' and m.lng_from_id = p.id_permission_key and p.is_active = 1 "
			+ " where p.id_permission_key = :permissionId "
			+ " and m.is_active = 1   "
			+ " and r.is_active = 1   "
			+ " and p.is_active = 1   "
			+ " and m.tx_status in ('APPROVED', 'PEND_DEASSINED')", nativeQuery = true)
	List<Role> getPermissionList(@Param("permissionId") Long permissionId);
	
	
	Role findByRoleName(String roleName);
	

	List<Role> findByActive(int active);
	
	



}
