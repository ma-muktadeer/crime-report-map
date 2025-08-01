/*package com.softcafe.core.util;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.softcafe.core.enums.LocUnit;
import com.softcafe.core.model.Location;
import com.softcafe.core.service.LocationService;

public class LocationUtils {

	public static List<Location> getCountryList(List<Location> locationUnitList) {

		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.COUNTRY.toString()))
				.collect(Collectors.toList());

	}

	public static List<Location> getDivisionList(List<Location> locationUnitList) {
		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.DIVISION.toString()))
				.collect(Collectors.toList());
	}
	
	public static List<Location> getDivisionList(List<Location> locationUnitList, String countryName) {
		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.DIVISION.toString()))
				.filter(loc -> loc.getParentName().equalsIgnoreCase(countryName))
				.collect(Collectors.toList());
	}
	
	public static List<Location> getDistrictList(List<Location> locationUnitList) {

		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.DISTRICT.toString()))
				.collect(Collectors.toList());

	}
	
	public static List<Location> getDistrictList(List<Location> locationUnitList, String divisionName) {

		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.DISTRICT.toString()))
				.filter(loc -> loc.getParentName().equalsIgnoreCase(divisionName))
				.collect(Collectors.toList());

	}
	
	public static List<Location> getDistrictList(List<Location> locationUnitList, String countryName, String divisionName) {

		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.DISTRICT.toString()))
				.filter(loc -> loc.getParentName().equalsIgnoreCase(divisionName))
				.filter(loc -> loc.getParentName().equalsIgnoreCase(countryName))
				.collect(Collectors.toList());

	}

	

	public static List<Location> getUpazilaList(List<Location> locationUnitList) {

		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.UPAZILA.toString()))
				.collect(Collectors.toList());

	}

	public static List<Location> getPoliceStatiionList(List<Location> locationUnitList) {
		
		return locationUnitList.parallelStream()
				.filter(loc -> loc.getParentName().equalsIgnoreCase(LocUnit.POLICE_STATION.toString()))
				.collect(Collectors.toList());

	}
	
	public static String getNameFromId(Long id, LocUnit locUnit) {
		String name = null;
		if(id == null) {
			return null;
		}
		final long locId = id.longValue();
		Optional<Location> loc = LocationService.gLocationList.parallelStream()
				.filter(l -> l.getLocationId() != null)
				.filter(l -> l.getLocationId().longValue() == locId).findFirst();
		if(loc.isPresent()) {
			return loc.get().getLocationName();
		}
		return name;
	}

}*/
