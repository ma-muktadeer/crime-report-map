package com.softcafesolution.dgfi.repo;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafesolution.dgfi.model.ChartMetaDeta;
import com.softcafesolution.dgfi.model.MapMetaData;
import com.softcafesolution.dgfi.model.ReportChartMetaData;
import com.softcafesolution.dgfi.model.VwCrimeInfo;

public interface VwCrimeInfoRepo extends JpaRepository<VwCrimeInfo, Long> {

	@Query(value = "SELECT * " 
			+ "FROM vw_crime_info " 
			+ "WHERE "
			+ "    (:fromDate IS NULL OR dt_occurse_date >= :fromDate)"
			+ "    AND (:toDate IS NULL OR dt_occurse_date <= :toDate)"
			+ "    AND (:typeOfCrimeId IS NULL OR id_Type_of_crime_key = :typeOfCrimeId)"
			+ "    AND (:divisionId IS NULL OR id_division_key = :divisionId)"
			+ "    AND (:districtId IS NULL OR id_district_key = :districtId)"
			+ "    AND (:upazilaId IS NULL OR id_upazila_key = :upazilaId)"
			+ "	   AND (:type IS NULL OR tx_type = :type)"
			+ "    AND (:organizationName IS NULL OR tx_organization_name LIKE '%' + :organizationName + '%')"
			+ "	   ORDER BY id_crime_key DESC", nativeQuery = true)
//	"
//	+ "    AND (:politicalAffiliation IS NULL OR PoliticalAffiliation LIKE '%' + :politicalAffiliation + '%')
	Page<VwCrimeInfo> findAllCrime(Date fromDate, Date toDate, Long typeOfCrimeId, Long divisionId, Long districtId,
			Long upazilaId, String organizationName, String type, Pageable pageable);

	@Query(value = """
			SELECT new com.softcafesolution.dgfi.model.ChartMetaDeta(count(1), crimeType)
			 FROM VwCrimeInfo
			 WHERE (:typeOfCrimeId IS NULL OR typeOfCrimeId IN :typeOfCrimeId)
			 AND ((:fromDate IS NULL AND :toDate IS NULL) OR occurseDate >= :fromDate AND occurseDate <= :toDate)
			 AND (:divisionId IS NULL OR divisionId = :divisionId)
			 AND (:districtId IS NULL OR districtId = :districtId)
			 AND (:type IS NULL OR type = :type)
			 GROUP BY crimeType
			""")
	List<ChartMetaDeta> searchTimelyChart(@Param("typeOfCrimeId") List<Long> typeOfCrimeId,
			@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, @Param("divisionId") Long divisionId,
			@Param("districtId") Long districtId, @Param("type") String type);

	@Query(value = """
			SELECT
			    COUNT(*) AS number,
			    crimeType AS crimeType,
			    FORMAT(occurseDate, 'yyyy-MM') AS dateString
			FROM VwCrimeInfo
			WHERE (:typeOfCrimeId IS NULL OR typeOfCrimeId IN :typeOfCrimeId)
			AND ((:fromDate IS NULL AND :toDate IS NULL) OR occurseDate >= :fromDate AND occurseDate <= :toDate)
			AND (:divisionId IS NULL OR divisionId = :divisionId)
			AND (:districtId IS NULL OR districtId = :districtId)
			AND (:type IS NULL OR type = :type)
			GROUP BY FORMAT(occurseDate, 'yyyy-MM'), crimeType
			ORDER BY FORMAT(occurseDate, 'yyyy-MM')
			""")
	List<ReportChartMetaData> getMonthlyCrimeStats(@Param("typeOfCrimeId") List<Long> typeOfCrimeId,
			@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, @Param("divisionId") Long divisionId,
			@Param("districtId") Long districtId, @Param("type") String type);

	@Query(value = """
			SELECT
			    COUNT(*) AS number,
			    crimeType AS crimeType,
			    FORMAT(occurseDate, 'yyyy') AS dateString
			FROM VwCrimeInfo
			WHERE (:typeOfCrimeId IS NULL OR typeOfCrimeId IN :typeOfCrimeId)
			AND ((:fromDate IS NULL AND :toDate IS NULL) OR occurseDate >= :fromDate AND occurseDate <= :toDate)
			AND (:divisionId IS NULL OR divisionId = :divisionId)
			AND (:districtId IS NULL OR districtId = :districtId)
			GROUP BY FORMAT(occurseDate, 'yyyy'), crimeType
			ORDER BY FORMAT(occurseDate, 'yyyy')
			""")
	List<ReportChartMetaData> getYearlyCrimeStats(@Param("typeOfCrimeId") List<Long> typeOfCrimeId,
			@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, @Param("divisionId") Long divisionId,
			@Param("districtId") Long districtId);

	@Query(value = """
			SELECT CR.districtName AS distict,
				COUNT(*) as countNumber,
				CR.disLongitude as lng,
				CR.disLatitude as lat
			FROM VwCrimeInfo CR
			WHERE CR.districtName IS NOT NULL
				AND (:fromDate IS NULL OR CR.occurseDate >= :fromDate)
				AND (:toDate IS NULL OR CR.occurseDate <= :toDate)
				AND (:typeOfCrimeIdList IS NULL OR typeOfCrimeId IN :typeOfCrimeIdList)
				AND (:divisionId IS NULL OR CR.divisionId = :divisionId)
				AND (:districtId IS NULL OR CR.districtId = :districtId)
				AND (:upazilaId IS NULL OR CR.upazilaId = :upazilaId)
				AND (:type IS NULL OR CR.type = :type)
				AND (:organizationName IS NULL OR CR.organizationName LIKE CONCAT('%', :organizationName, '%'))
			GROUP BY CR.districtName, CR.disLongitude, CR.disLatitude
			""")
	List<MapMetaData> findMapMetaData(Date fromDate, Date toDate, List<Long> typeOfCrimeIdList, Long divisionId,
			Long districtId, Long upazilaId, String organizationName, String type);

	@Query(value = """
			SELECT V FROM VwCrimeInfo V
			WHERE (:fromDate IS NULL OR V.occurseDate >= :fromDate)
			AND (:toDate IS NULL OR V.occurseDate <= :toDate)
			AND (:typeOfCrimeIdList IS NULL OR V.typeOfCrimeId IN :typeOfCrimeIdList)
			AND (:divisionId IS NULL OR V.divisionId = :divisionId)
			AND (:districtId IS NULL OR V.districtId = :districtId)
			AND (:upazilaId IS NULL OR V.upazilaId = :upazilaId)
			AND (:type IS NULL OR V.type = :type)
			AND (:organizationName IS NULL OR V.organizationName LIKE CONCAT('%', :organizationName, '%'))
			ORDER BY occurseDate DESC
			""")
	List<VwCrimeInfo> findAllByDateBetweenAndType(Date fromDate, Date toDate, List<Long> typeOfCrimeIdList,
			Long divisionId, Long districtId, Long upazilaId, String organizationName, String type);

//	AND (:socialOrganizationName IS NULL OR V.socialOrganizationName LIKE CONCAT('%', :socialOrganizationName, '%'))
	@Query(value = """
			SELECT V FROM VwCrimeInfo V
			WHERE V.typeOfCrimeId = :configId
			AND (:fromDate IS NULL OR V.occurseDate >= :fromDate)
			AND (:toDate IS NULL OR V.occurseDate <= :toDate)
			AND (:divisionId IS NULL OR V.divisionId = :divisionId)
			AND (:districtId IS NULL OR V.districtId = :districtId)
			AND (:upazilaId IS NULL OR V.upazilaId = :upazilaId)
			AND (:politicalPartyName IS NULL OR V.politicalPartyName LIKE CONCAT('%', :politicalPartyName, '%'))
			AND(:politicalPartyId IS NULL OR V.politicalPartyId = :politicalPartyId)
			ORDER BY occurseDate DESC
			""")
	List<VwCrimeInfo> findAllByTypeOfCrimeId(Long configId, Date fromDate, Date toDate, Long divisionId,
			Long districtId, Long upazilaId, String politicalPartyName, Long politicalPartyId);

}
