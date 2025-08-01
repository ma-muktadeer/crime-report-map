package com.softcafesolution.core.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafesolution.core.entity.Branch;

public interface BranchRepo extends JpaRepository<Branch, Long> {
	
	Branch findByBankCodeAndBranchCode(String bankCode,String branchCode);
	
	List<Branch> findByBankCode(String bankCode);
	
	
	

}
