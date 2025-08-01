package com.softcafesolution.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import com.softcafesolution.core.entity.Preference;

public interface PreferenceRepo extends JpaRepository<Preference, Long>, JpaSpecificationExecutor<Preference>, QueryByExampleExecutor<Preference>{
	
}