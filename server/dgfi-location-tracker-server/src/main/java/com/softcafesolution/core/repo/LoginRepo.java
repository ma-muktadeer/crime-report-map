package com.softcafesolution.core.repo;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafesolution.core.entity.Login;

import jakarta.transaction.Transactional;

@Transactional
public interface LoginRepo extends JpaRepository<Login, Long>{

	List<Login> findByLoginNameAndFailResolved(String loginName, int failResolved);
	
	
	@Transactional
	@Modifying
	@Query(value="  update Login l "
			+ "  set l.failResolved = 1 , "
			+ "  l.modTime = :modTime  "
			+ "  where l.failResolved = 0 "
			+ "  and l.loginName = :loginName  ")
	void resolvedFailAttempt(@Param("modTime") Date modTime, @Param("loginName") String loginName);

	
	List<Login> findByFailResolvedAndLoginName(int failResolved, String loginName);
	
}
