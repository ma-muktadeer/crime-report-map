package com.softcafesolution.core.repo;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafesolution.core.entity.RoleGroup;


public interface RoleGroupRepo extends JpaRepository<RoleGroup, Long> {

	@Query("SELECT T FROM RoleGroup T WHERE T.roleGroupId in :roleGroupIdList and active = 1")
	List<RoleGroup> findByRoleGroupIds(@Param("roleGroupIdList")Set<Long> roleGroupIdList);
	
	@Query("SELECT T FROM RoleGroup T WHERE T.roleGroupId not in :roleGroupIdList and active = 1")
	List<RoleGroup> findByRoleGroupIdsNotIn(@Param("roleGroupIdList")Set<Long> roleGroupIdList);

	List<RoleGroup> findByActive(int i);
}
