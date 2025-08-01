package com.softcafesolution.dgfi.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softcafesolution.dgfi.entity.Location;
import com.softcafesolution.dgfi.model.PernamentSeat;


public interface LocationRepo extends JpaRepository<Location, Long> {
	
	List<Location> findAllByLocationTypeAndParentKeyAndIsActive(String locationType, Long parentKey, int isActive);

	Location findByIdLocationKeyAndIsActive(Long idLocationKey, int i);

	@Query(value="""
			SELECT 
            sl.id_location_key AS idLocationKey,
            ml.id_parent_key AS divisionId,
            ml.id_location_key AS districtId, 
            ml.tx_loc_name_bn AS districtName,
            sl.tx_loc_name_bn AS locationNameBn
        FROM t_location ml
        JOIN t_location sl ON sl.id_parent_key = ml.id_location_key 
            AND sl.tx_loc_type = 'PARLIAMENTARY_SEAT' 
            AND sl.is_active = 1
        WHERE ml.tx_loc_type = 'DISTRICT' 
            AND ml.is_active = 1
        ORDER BY ml.tx_loc_name_bn ASC
			""", nativeQuery = true)
	List<PernamentSeat> loadAllSeats();

}
