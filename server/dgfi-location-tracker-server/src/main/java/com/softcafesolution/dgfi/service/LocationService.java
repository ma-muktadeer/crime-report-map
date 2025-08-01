package com.softcafesolution.dgfi.service;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.dgfi.entity.Location;
import com.softcafesolution.dgfi.model.PernamentSeat;
import com.softcafesolution.dgfi.repo.LocationRepo;

@Service
public class LocationService {
	private final static Logger log = LogManager.getLogger();
	
	@Autowired
	private LocationRepo locationRepo;

	public List<Location> findLocation(Long parantKey, String locationType) {
		log.info("finding all Division for parentKey:locationType [{}:{}]", parantKey, locationType);
		return locationRepo.findAllByLocationTypeAndParentKeyAndIsActive(locationType, parantKey, 1);
	}

	public void saveLocation(Location lc) {
		locationRepo.save(lc);
	}

	public void deleteLocation(Long idLocationKey) {
		Location lc = locationRepo.findByIdLocationKeyAndIsActive(idLocationKey, 1);
		
		if(lc != null) {
			lc.setIsActive(0);
			locationRepo.save(lc);
		}
	}

	public List<PernamentSeat> getAllPoliticalSeats() {
		// TODO Auto-generated method stub
		return locationRepo.loadAllSeats();
	}
	
	

}
