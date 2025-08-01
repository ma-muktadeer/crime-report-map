package com.softcafesolution.core.repo;

import java.util.LinkedList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafesolution.core.entity.SConfiguration;


public interface SConfigurationRepo extends JpaRepository<SConfiguration, Long>, JpaSpecificationExecutor<SConfiguration>{
	@Query(value="SELECT  U FROM SConfiguration U where active = 1")
	LinkedList<SConfiguration> findAll();
	@Query(value="SELECT  U FROM SConfiguration U "
			+ "where active = 1 "
			+ " and configGroup = :configGroup "
			+ " and configSubGroup = :configSubGroup "
			+ " and value1 = :value1 "
			+ " and value1 is not null ")
	public SConfiguration duplicate(@Param("configGroup") String configGroup, @Param("configSubGroup") String configSubGroup, @Param("value1") String value1);
	public List<SConfiguration> findByConfigGroupAndActive(String configGroup, int active);
	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndActive(String configGroup, String configSubGroup, int active);
	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndValue5AndActive(String configGroup, String configSubGroup,String value5, int active);

	public SConfiguration findByConfigGroupAndConfigSubGroupAndConfigNameAndActive(String configGroup, String configSubGroup, String configName, int active);
	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndConfigNameAndActiveOrderByValue1Asc(String configGroup, String configSubGroup, String configName, int active);

	List<SConfiguration> findAllByConfigGroupAndConfigSubGroupAndActive(String configGroup, String configSubGroup, int i);
	
	@Query(value="""
			SELECT U FROM SConfiguration U
			WHERE
				(:configIds IS NULL OR configId IN :configIds)
				AND configGroup = :group
				AND configSubGroup = :subGroup
				AND active = :i
			""")
	List<SConfiguration> findByConfigIdsAndConfigGroupAndConfigSubGroupAndActive(List<Long> configIds, String group,
			String subGroup, int i);
}
