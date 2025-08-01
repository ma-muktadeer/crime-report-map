package com.softcafesolution.dgfi.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "vw_crime_info")
public class VwCrimeInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_crime_key")
	private Long crimeId;
	
	@Column(name="tx_type")
	private String type;
	
	@Column(name="tx_party_name", columnDefinition = "NVARCHAR(100)")
	private String partyName;
	
	@Column(name = "id_parliamentary_seat_key")
	private Long parliamentarySeatId;
	
	@Column(name="dt_occurse_date")
	private Date occurseDate;
	
	@Column(name = "id_political_party_key")
	private Long politicalPartyId;
	
	@Column(name = "tx_political_party_name",columnDefinition = "NVARCHAR(100)")
	private String politicalPartyName;
	
	@Column(name = "tx_location_name", columnDefinition = "NVARCHAR(100)")
	private String locationName;
	
	@Column(name = "int_presence_number")
	private Long presenceNumber;
	
	
	@Column(name="id_district_key")
	private Long districtId;

	@Column(name="lng_injured_Number")
	private Long injuredNumber;
	
	@Column(name="lng_deaths_Number" )
	private Long deathsNumber;
	
	@Column(name="tx_social_organization_name" ,  columnDefinition = "NVARCHAR(100)")
	private String  socialOrganizationName;	

	@Column(name = "id_Type_of_crime_key")
	private Long typeOfCrimeId;

	@Column(name = "entry_time")
	private Date entryTime;
	

	@Column(name = "time")
	private String time;


	@Column(name = "id_division_key")
	private Long divisionId;

	@Column(name = "id_upazila_key")
	private Long upazilaId;
//	
//	@Column(name = "tx_guest_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String guestName;
//
//	@Column(name = "tx_guest_identity", columnDefinition = "NVARCHAR(MAX)", length = 80)
//	private String guestIdentity;
//
//	@Column(name = "tx_victim_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String victimName;
//
//	@Column(name = "tx_victim_identity", columnDefinition = "NVARCHAR(MAX)", length = 80)
//	private String victimIdentity;
//
//	@Column(name = "tx_victim_political_party_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String victimPoliticalPartyName;

//	@Column(name = "tx_victim_religious", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String victimReligious;

//	@Column(name = "tx_criminal_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String criminalName;
//
//	@Column(name = "tx_criminal_identity", columnDefinition = "NVARCHAR(MAX)", length = 80)
//	private String criminalIdentity;
//
//	@Column(name = "tx_criminal_political_party_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String criminalPoliticalPartyName;

	@Column(name = "tx_organization_name", columnDefinition = "NVARCHAR(MAX)", length = 168)
	private String organizationName;

	@Column(name = "tx_over_view", columnDefinition = "NVARCHAR(MAX)", length = 200)
	private String overView;

	@Column(name = "tx_division_name", columnDefinition = "NVARCHAR(MAX)", length = 64)
	private String divisionName;
	
	@Column(name = "tx_district_name", columnDefinition = "NVARCHAR(MAX)", length = 64)
	private String districtName;
	
	@Column(name = "tx_upazila", columnDefinition = "NVARCHAR(MAX)", length = 64)
	private String upazilaName;
	
	@Column(name = "div_latitude", precision = 15, scale = 10)
	private BigDecimal divLatitude;

	@Column(name = "div_longitude", precision = 15, scale = 10)
	private BigDecimal divLongitude;
	
	@Column(name = "dis_latitude", precision = 15, scale = 10)
	private BigDecimal disLatitude;

	@Column(name = "dis_longitude", precision = 15, scale = 10)
	private BigDecimal disLongitude;
	
	@Column(name = "tx_crime_type")
	private String crimeType;
	
	@Column(name = "tx_criminal_details")
	private String criminalDetails;
	
	@Column(name = "tx_victim_details")
	private String victimDetails;
	
	@Column(name = "tx_guest_details")
	private String guestDetails;
	
	@Column(name = "tx_defendant_details")
	private String defendantDetails;
	
	@Column(name = "tx_date_time")
	private String stDateTime;
	
	@Column(name = "tx_plaintiff_details")
	private String plaintiffDetails;
	
	@Column(name = "tx_sponsor_details")
	private String sponsorDetails;
	
	@Column(name = "tx_legal_admin_action")
	private String legalAdminAction;
	
	@Column(name = "tx_casualties")
	private String casualties;
	
	
	@Column(name = "tx_parliamentary_seat_name")
	private String parliamentarySeatName;
	
	@Transient
	private Integer pageNumber = 1;

	@Transient
	private Integer pageSize = 20;
	
	@Transient
	private Date fromDate;
	
	@Transient
	private Date toDate;
	
	@Transient
	private List<Long> typeOfCrimeIdList = new ArrayList<>();
	
	@Transient
	private List<MapMetaData> mapCoreData = new ArrayList<>();
	
	@Transient
	private List<VwCrimeInfo> mapDetailsData = new ArrayList<>();
	
	@Transient
	private Map<String, String> tabularHeader = new HashMap<String, String>();

	public Long getCrimeId() {
		return crimeId;
	}

	public void setCrimeId(Long crimeId) {
		this.crimeId = crimeId;
	}

	public Long getTypeOfCrimeId() {
		return typeOfCrimeId;
	}

	public void setTypeOfCrimeId(Long typeOfCrimeId) {
		this.typeOfCrimeId = typeOfCrimeId;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public Long getDistrictId() {
		return districtId;
	}

	public void setDistrictId(Long districtId) {
		this.districtId = districtId;
	}

	public Long getDivisionId() {
		return divisionId;
	}

	public void setDivisionId(Long divisionId) {
		this.divisionId = divisionId;
	}

	public Long getUpazilaId() {
		return upazilaId;
	}

	public void setUpazilaId(Long upazilaId) {
		this.upazilaId = upazilaId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPartyName() {
		return partyName;
	}

	public void setPartyName(String partyName) {
		this.partyName = partyName;
	}

	public Long getParliamentarySeatId() {
		return parliamentarySeatId;
	}

	public void setParliamentarySeatId(Long parliamentarySeatId) {
		this.parliamentarySeatId = parliamentarySeatId;
	}

	public Long getPoliticalPartyId() {
		return politicalPartyId;
	}

	public void setPoliticalPartyId(Long politicalPartyId) {
		this.politicalPartyId = politicalPartyId;
	}

	public String getPoliticalPartyName() {
		return politicalPartyName;
	}

	public void setPoliticalPartyName(String politicalPartyName) {
		this.politicalPartyName = politicalPartyName;
	}

	public String getLocationName() {
		return locationName;
	}

	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}

	public Long getPresenceNumber() {
		return presenceNumber;
	}

	public void setPresenceNumber(Long presenceNumber) {
		this.presenceNumber = presenceNumber;
	}

	public String getStDateTime() {
		return stDateTime;
	}

	public void setStDateTime(String stDateTime) {
		this.stDateTime = stDateTime;
	}

	public Long getInjuredNumber() {
		return injuredNumber;
	}

	public void setInjuredNumber(Long injuredNumber) {
		this.injuredNumber = injuredNumber;
	}

	public Long getDeathsNumber() {
		return deathsNumber;
	}

	public void setDeathsNumber(Long deathsNumber) {
		this.deathsNumber = deathsNumber;
	}

	public String getSocialOrganizationName() {
		return socialOrganizationName;
	}

	public void setSocialOrganizationName(String socialOrganizationName) {
		this.socialOrganizationName = socialOrganizationName;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getOverView() {
		return overView;
	}

	public void setOverView(String overView) {
		this.overView = overView;
	}

	public String getDivisionName() {
		return divisionName;
	}

	public void setDivisionName(String divisionName) {
		this.divisionName = divisionName;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	public String getUpazilaName() {
		return upazilaName;
	}

	public void setUpazilaName(String upazilaName) {
		this.upazilaName = upazilaName;
	}

	
	public BigDecimal getDivLatitude() {
		return divLatitude;
	}

	public void setDivLatitude(BigDecimal divLatitude) {
		this.divLatitude = divLatitude;
	}

	public BigDecimal getDivLongitude() {
		return divLongitude;
	}

	public void setDivLongitude(BigDecimal divLongitude) {
		this.divLongitude = divLongitude;
	}

	public BigDecimal getDisLatitude() {
		return disLatitude;
	}

	public void setDisLatitude(BigDecimal disLatitude) {
		this.disLatitude = disLatitude;
	}

	public BigDecimal getDisLongitude() {
		return disLongitude;
	}

	public void setDisLongitude(BigDecimal disLongitude) {
		this.disLongitude = disLongitude;
	}

	public Integer getPageNumber() {
		return pageNumber;
	}

	public void setPageNumber(Integer pageNumber) {
		this.pageNumber = pageNumber;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Date getEntryTime() {
		return entryTime;
	}

	public void setEntryTime(Date entryTime) {
		this.entryTime = entryTime;
	}

	public Date getFromDate() {
		return fromDate;
	}

	public void setFromDate(Date fromDate) {
		this.fromDate = fromDate;
	}

	public Date getToDate() {
		return toDate;
	}

	public void setToDate(Date toDate) {
		this.toDate = toDate;
	}

	public List<Long> getTypeOfCrimeIdList() {
		return typeOfCrimeIdList;
	}

	public void setTypeOfCrimeIdList(List<Long> typeOfCrimeIdList) {
		this.typeOfCrimeIdList = typeOfCrimeIdList;
	}

	public String getCrimeType() {
		return crimeType;
	}

	public void setCrimeType(String crimeType) {
		this.crimeType = crimeType;
	}

	public Date getOccurseDate() {
		return occurseDate;
	}

	public void setOccurseDate(Date occurseDate) {
		this.occurseDate = occurseDate;
	}

	public List<MapMetaData> getMapCoreData() {
		return mapCoreData;
	}

	public void setMapCoreData(List<MapMetaData> mapCoreData) {
		this.mapCoreData = mapCoreData;
	}

	public List<VwCrimeInfo> getMapDetailsData() {
		return mapDetailsData;
	}

	public void setMapDetailsData(List<VwCrimeInfo> mapDetailsData) {
		this.mapDetailsData = mapDetailsData;
	}

	public Map<String, String> getTabularHeader() {
		return tabularHeader;
	}

	public void setTabularHeader(Map<String, String> tabularHeader) {
		this.tabularHeader = tabularHeader;
	}

	public String getCriminalDetails() {
		return criminalDetails;
	}

	public void setCriminalDetails(String criminalDetails) {
		this.criminalDetails = criminalDetails;
	}

	public String getVictimDetails() {
		return victimDetails;
	}

	public void setVictimDetails(String victimDetails) {
		this.victimDetails = victimDetails;
	}

	public String getGuestDetails() {
		return guestDetails;
	}

	public void setGuestDetails(String guestDetails) {
		this.guestDetails = guestDetails;
	}

	public String getDefendantDetails() {
		return defendantDetails;
	}

	public void setDefendantDetails(String defendantDetails) {
		this.defendantDetails = defendantDetails;
	}

	public String getPlaintiffDetails() {
		return plaintiffDetails;
	}

	public void setPlaintiffDetails(String plaintiffDetails) {
		this.plaintiffDetails = plaintiffDetails;
	}

	public String getSponsorDetails() {
		return sponsorDetails;
	}

	public void setSponsorDetails(String sponsorDetails) {
		this.sponsorDetails = sponsorDetails;
	}

	public String getLegalAdminAction() {
		return legalAdminAction;
	}

	public void setLegalAdminAction(String legalAdminAction) {
		this.legalAdminAction = legalAdminAction;
	}

	public String getCasualties() {
		return casualties;
	}

	public void setCasualties(String casualties) {
		this.casualties = casualties;
	}

	public String getParliamentarySeatName() {
		return parliamentarySeatName;
	}

	public void setParliamentarySeatName(String parliamentarySeatName) {
		this.parliamentarySeatName = parliamentarySeatName;
	}
	
	
	

}
