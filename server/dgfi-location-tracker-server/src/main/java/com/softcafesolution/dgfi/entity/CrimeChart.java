package com.softcafesolution.dgfi.entity;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import com.softcafesolution.core.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;

@Entity
@Table(name = "T_CRIME")
public class CrimeChart extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_crime_key")
	private Long crimeId;
	
	@Column(name ="id_Type_of_crime_key")
	private Long typeOfCrimeId;
	
	@Column(name="time")
	private String time;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="dt_occurse_date", nullable = false, updatable = false)
	private Date occurseDate;
	
	@Column(name="tx_type", length = 56)
	private String type;
	
	@Column(name="tx_party_name", columnDefinition = "NVARCHAR(100)")
	private String partyName;
	
	@Column(name = "id_parliamentary_seat_key")
	private Long parliamentarySeatId;
	
	@Column(name = "id_political_party_key")
	private Long politicalPartyId;
	
	@Column(name = "tx_politicalParty_name",columnDefinition = "NVARCHAR(100)")
	private String politicalPartyName;
	
	@Column(name = "tx_location_name", columnDefinition = "NVARCHAR(100)")
	private String locationName;
	
	@Column(name = "int_presence_number")
	private Long presenceNumber;
	
	
	@Column(name="id_district_key")
	private Long districtId;
	
	@Column(name="id_division_key")
	private Long divisionId;
	
	@Column(name="id_upazila_key")
	private Long upazilaId;

	@Column(name="lng_injured_Number")
	private Long injuredNumber;
	
	@Column(name="lng_deaths_Number" )
	private Long deathsNumber;
	
//	@Column(name="tx_victim_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String victimName;
	
//	@Column(name="tx_victim_identity", columnDefinition = "NVARCHAR(MAX)", length = 80)
//	private String victimIdentity;
	
//	@Column(name="tx_victim_political_party_name" , columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String victimPoliticalPartyName;
	
	@Column(name="tx_social_organization_name" ,  columnDefinition = "NVARCHAR(100)")
	private String  socialOrganizationName;
	
	
//	@Column(name="tx_criminal_name", columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String criminalName;
	
//	@Column(name="tx_criminal_identity", columnDefinition = "NVARCHAR(MAX)", length = 80)
//	private String criminalIdentity;
	
//	@Column(name="tx_criminal_political_party_name" ,  columnDefinition = "NVARCHAR(MAX)", length = 100)
//	private String criminalPoliticalPartyName;
	
	@Column(name="tx_organization_name" ,  columnDefinition = "NVARCHAR(168)")
	private String organizationName;
	
	@Column(name="tx_victim_religious" ,  columnDefinition = "NVARCHAR(168)")
	private String victimReligious;
	
	@Column(name="tx_over_view" ,  columnDefinition = "NVARCHAR(200)")
	private String overView;
	
	@Column(name="tx_legal_admin_action" ,  columnDefinition = "NVARCHAR(200)")
	private String legalAdministrativeAction;

	@Transient
	private MultipartFile [] files;
	
	@Transient
	private Long parentKey;
	
	@Transient
	private Long idLocationKey;
	@Transient
	private String districtName;
	@Transient
	private String locationNameBn;
	
	@Transient
	private String locationType;
	
	@Transient
	private List<Person> persons;
	
	@Transient
	private Map<String, String> imageInfo;
	
	
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

	
	public Long getUpazilaId() {
		return upazilaId;
	}

	public void setUpazilaId(Long upazilaId) {
		this.upazilaId = upazilaId;
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

	public MultipartFile[] getFiles() {
		return files;
	}

	public void setFiles(MultipartFile[] files) {
		this.files = files;
	}

	public Long getParentKey() {
		return parentKey;
	}

	public void setParentKey(Long parentKey) {
		this.parentKey = parentKey;
	}

	public String getLocationType() {
		return locationType;
	}

	public void setLocationType(String locationType) {
		this.locationType = locationType;
	}

	public Long getDivisionId() {
		return divisionId;
	}

	public void setDivisionId(Long divisionId) {
		this.divisionId = divisionId;
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

	public List<Person> getPersons() {
		return persons;
	}

	public void setPersons(List<Person> persons) {
		this.persons = persons;
	}

	public Date getOccurseDate() {
		return occurseDate;
	}

	public void setOccurseDate(Date occurseDate) {
		this.occurseDate = occurseDate;
	}

	public String getVictimReligious() {
		return victimReligious;
	}

	public void setVictimReligious(String victimReligious) {
		this.victimReligious = victimReligious;
	}

	public String getLegalAdministrativeAction() {
		return legalAdministrativeAction;
	}

	public void setLegalAdministrativeAction(String legalAdministrativeAction) {
		this.legalAdministrativeAction = legalAdministrativeAction;
	}

	public Map<String, String> getImageInfo() {
		return imageInfo;
	}

	public void setImageInfo(Map<String, String> imageInfo) {
		this.imageInfo = imageInfo;
	}

	public Long getIdLocationKey() {
		return idLocationKey;
	}

	public void setIdLocationKey(Long idLocationKey) {
		this.idLocationKey = idLocationKey;
	}

	public String getDistrictName() {
		return districtName;
	}

	public void setDistrictName(String districtName) {
		this.districtName = districtName;
	}

	public String getLocationNameBn() {
		return locationNameBn;
	}

	public void setLocationNameBn(String locationNameBn) {
		this.locationNameBn = locationNameBn;
	}

	
	
	
	

}
