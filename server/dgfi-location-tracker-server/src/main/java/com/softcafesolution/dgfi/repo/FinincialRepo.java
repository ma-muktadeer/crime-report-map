package com.softcafesolution.dgfi.repo;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softcafesolution.dgfi.entity.Finincial;
import com.softcafesolution.dgfi.model.EconomicReportMetaData;

public interface FinincialRepo extends JpaRepository<Finincial, Long> {

	List<Finincial> findAllByActive(int i);

	@Query(value = """
			SELECT
			    max(decPrice) AS prize,
			    txProductName AS type,
			    FORMAT(dttDate, 'yyyy-MM') AS dateString
			FROM VwFinancialInfo
			WHERE (:idProductNameList IS NULL OR idProductName IN :idProductNameList)
			AND ((:fromDate IS NULL AND :toDate IS NULL) OR (dttDate >= :fromDate AND dttDate <= :toDate))
			AND (:type IS NULL OR txType = :type)
			GROUP BY FORMAT(dttDate, 'yyyy-MM'), txProductName
			ORDER BY FORMAT(dttDate, 'yyyy-MM')
			""")
	List<EconomicReportMetaData> getMonthlyFinicialStats(List<Long> idProductNameList, Date fromDate, Date toDate,
			String type);

	@Query(value = """
			SELECT
			    max(dec_price) AS prize,
			    tx_product_name AS type,
			    CONCAT(
			      FORMAT(DATEADD(DAY, 1-DATEPART(WEEKDAY, MIN(dtt_date)), MIN(dtt_date)), 'dd'), '-',
			      FORMAT(DATEADD(DAY, 7-DATEPART(WEEKDAY, MIN(dtt_date)), MIN(dtt_date)), 'dd MMM')
			  ) AS dateString
			FROM VW_FININCIAL_DATA
			WHERE
			  (:fromDate IS NULL OR dtt_date >= :fromDate)
			  AND (:toDate IS NULL OR dtt_date <= :toDate)
			  AND (:idProductNameList IS NULL OR id_product_name IN (:idProductNameList))
			  AND (:type IS NULL OR tx_type = :type)
			GROUP BY DATEPART(WEEK, dtt_date), tx_product_name
			ORDER BY DATEPART(WEEK, dtt_date)
			""", nativeQuery = true)
	List<EconomicReportMetaData> getWeeklyFinicialStats(List<Long> idProductNameList, Date fromDate, Date toDate,
			String type);

	@Query(value = """
			SELECT
			    max(decPrice) AS prize,
			    txProductName AS type,
			    FORMAT(dttDate, 'yyyy') AS dateString
			FROM VwFinancialInfo
			WHERE (:idProductNameList IS NULL OR idProductName IN :idProductNameList)
			AND ((:fromDate IS NULL AND :toDate IS NULL) OR dttDate >= :fromDate AND dttDate <= :toDate)
			AND (:type IS NULL OR txType = :type)
			GROUP BY FORMAT(dttDate, 'yyyy'), txProductName
			ORDER BY FORMAT(dttDate, 'yyyy')
			""")
	List<EconomicReportMetaData> getYearlyCrimeStats(List<Long> idProductNameList, Date fromDate, Date toDate,
			String type);

	@Query(value = """
			SELECT
			    MAX(dec_price) AS prize,
			    :type AS type,
			    CONCAT(
			        FORMAT(DATEADD(DAY, 1 - DATEPART(WEEKDAY, MIN(dtt_date)), MIN(dtt_date)), 'dd'), '-',
			        FORMAT(DATEADD(DAY, 7 - DATEPART(WEEKDAY, MIN(dtt_date)), MIN(dtt_date)), 'dd MMM')
			    ) AS dateString
			FROM VW_FININCIAL_DATA
			WHERE
			    (:fromDate IS NULL OR dtt_date >= :fromDate)
			    AND (:toDate IS NULL OR dtt_date <= :toDate)
			    AND (:type IS NULL OR tx_type = :type)
			GROUP BY
			    DATEPART(WEEK, dtt_date)
			ORDER BY
			    DATEPART(WEEK, dtt_date)
			""", nativeQuery = true)
	List<EconomicReportMetaData> getWeeklyEconomics(Date fromDate, Date toDate, String type);

	@Query(value = """
			SELECT
			    SUM(dec_price) AS prize,
			    :type AS type,
			    FORMAT(dtt_date, 'yyyy-MM') AS dateString
			FROM VW_FININCIAL_DATA
			WHERE
			    (:fromDate IS NULL OR dtt_date >= :fromDate)
			    AND (:toDate IS NULL OR dtt_date <= :toDate)
			    AND (:type IS NULL OR tx_type = :type)
			GROUP BY
			    FORMAT(dtt_date, 'yyyy-MM')
			ORDER BY
			    FORMAT(dtt_date, 'yyyy-MM')
			""", nativeQuery = true)
	List<EconomicReportMetaData> getMonthlyEcomics(Date fromDate, Date toDate, String type);
	
	@Query(value = """
			SELECT
			    SUM(dec_price) AS prize,
			    :type AS type,
			    FORMAT(dtt_date, 'yyyy') AS dateString
			FROM VW_FININCIAL_DATA
			WHERE
			    (:fromDate IS NULL OR dtt_date >= :fromDate)
			    AND (:toDate IS NULL OR dtt_date <= :toDate)
			    AND (:type IS NULL OR tx_type = :type)
			GROUP BY
			    FORMAT(dtt_date, 'yyyy')
			ORDER BY
			    FORMAT(dtt_date, 'yyyy')
			""", nativeQuery = true)
	List<EconomicReportMetaData> getYearlyMonthlyEcomics(Date fromDate, Date toDate, String type);

}
