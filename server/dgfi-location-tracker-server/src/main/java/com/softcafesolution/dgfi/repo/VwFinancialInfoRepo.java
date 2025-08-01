package com.softcafesolution.dgfi.repo;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.softcafesolution.dgfi.model.VwFinancialInfo;

@Repository
public interface VwFinancialInfoRepo extends JpaRepository<VwFinancialInfo, Long>{
	@Query("SELECT f FROM VwFinancialInfo f")
	Page<VwFinancialInfo> findAll(Pageable pageable);

	@Query(value="""
			SELECT V FROM VwFinancialInfo V
			WHERE (:type IS NULL OR V.txType = :type)
			AND (:dttDate IS NULL OR V.dttDate = :dttDate)
			AND (:idProductName IS NULL OR V.idProductName = :idProductName)
			AND (:idUnitName IS NULL OR V.idUnitName = :idUnitName)
			AND (:decQuantity IS NULL OR V.decQuantity =:decQuantity)
			AND (:txUnit IS NULL OR V.txUnit = :txUnit)
			AND (:decPrice IS NULL OR V.decPrice = :decPrice)
			AND V.active = :active
			""")
	Page<VwFinancialInfo> findAllByTxTypeAndIsActive(String type, Date dttDate, Long idProductName,
			Long idUnitName, Double decQuantity, String txUnit, Double decPrice, int active, Pageable pageable);
}
