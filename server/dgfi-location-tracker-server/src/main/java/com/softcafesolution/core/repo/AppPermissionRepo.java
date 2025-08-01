package com.softcafesolution.core.repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafesolution.core.entity.AppPermission;


public interface AppPermissionRepo extends JpaRepository<AppPermission, Long>{
	
	List<AppPermission> findByActive(int active, Sort sort);
	
	AppPermission findByPermissionName(String permissionName);
	
	
	@Query("SELECT T FROM AppPermission T WHERE T.permissionId in :permissionIdList and active = 1")
	List<AppPermission> findByPermissionIds(@Param("permissionIdList")Set<Long> permissionIdList);
	
	@Query("SELECT T FROM AppPermission T WHERE T.permissionId not in :permissionIdList and active = 1")
	List<AppPermission> findByPermissionIdsNotIn(@Param("permissionIdList")Set<Long> permissionIdList);

	@Query("SELECT AP FROM AppPermission AP WHERE AP.permissionId IN" +
			"  (" +
			" SELECT DISTINCT M.fromId FROM GenericMap M" +
			" WHERE M.toId IN :roleIds" +
			" AND M.toTypeName = 'ROLE'" +
			" AND M.fromTypeName = 'APP_PERMISSION'" +
			" AND M.active = 1" +
			" )" +
			" AND AP.active = 1 ")
	List<AppPermission> findByRoleIds(List<Long> roleIds);
}
