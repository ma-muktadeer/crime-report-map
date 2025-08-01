package com.softcafesolution.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafesolution.core.entity.DocumentsInfo;

public interface DocumentsInfoRepo extends JpaRepository<DocumentsInfo, Long>{

	DocumentsInfo findByDocRefId(Long crimeId);

	DocumentsInfo findByDocRefIdAndActive(Long crimeId, int i);

}
