package com.softcafesolution.dgfi.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.softcafesolution.core.entity.DocumentsInfo.DocType;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.DocumentsInfoRepo;
import com.softcafesolution.core.service.DocumentsInfoService;
import com.softcafesolution.core.service.UserService;
import com.softcafesolution.core.utils.Str;
import com.softcafesolution.dgfi.entity.CrimeChart;
import com.softcafesolution.dgfi.entity.Location;
import com.softcafesolution.dgfi.entity.Person;
import com.softcafesolution.dgfi.model.PernamentSeat;
import com.softcafesolution.dgfi.model.VwCrimeInfo;
import com.softcafesolution.dgfi.repo.CrimeChartRepo;
import com.softcafesolution.dgfi.repo.PersonRepo;
import com.softcafesolution.dgfi.utils.FileUtils;

import jakarta.transaction.Transactional;

@Service
public class CrimeChartService extends AbstractMessageService<CrimeChart> {
	private static final Logger log = LoggerFactory.getLogger(UserService.class);

	@Value("${crime.chart.file.path:D:\\dgfi\\file}")
	private String path;

	@Autowired
	private CrimeChartRepo crimeChartRepo;

	@Autowired
	PersonRepo personRepo;

	@Autowired
	private DocumentsInfoService documentsInfoService;
	
	@Autowired
	DocumentsInfoRepo  documentsInfoRepo;

	@Autowired
	private LocationService locationService;

	@Autowired
	private PersonService personService;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("action comes for=> {}", actionType);

			if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<CrimeChart> userList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<Location> userList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.SELECT_BY_ID.toString())) {
				CrimeChart crimeSingle = getCrimeById(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crimeSingle);
			}
			else if (actionType.equals(ActionType.LOAD_EXTRA.toString())) {
				List<PernamentSeat> crimeSingle = loadExtra(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crimeSingle);
			}
			else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<PernamentSeat> crimeSingle = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crimeSingle);
			}
			else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				List<PernamentSeat> crimeSingle = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crimeSingle);
			}
			
			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	private List<PernamentSeat> save(Message<List<CrimeChart>> requestMessage, String actionType) {
		CrimeChart cr = requestMessage.getPayload().getFirst();
		Location lc = setLocationValue(cr);
		lc.setCreateDateTime(LocalDateTime.now());
		lc.setIdLocationVer(1L);
		lc.setLocationName("Unnamed Locatio");
		locationService.saveLocation(lc);
		
		return loadExtra(requestMessage, actionType);
	}
	
	private Location setLocationValue(CrimeChart cr) {
		Location lc = new Location();
		lc.setParentKey(cr.getParentKey());
		lc.setIdLocationKey(cr.getIdLocationKey());
		lc.setLocationType(cr.getLocationType());
		lc.setLocationNameBn(cr.getLocationNameBn());
		return lc;
	}

	private List<PernamentSeat> delete(Message<List<CrimeChart>> requestMessage, String actionType) {
		CrimeChart cr = requestMessage.getPayload().getFirst();
		
		locationService.deleteLocation(cr.getIdLocationKey());
		
		return loadExtra(requestMessage, actionType);
	}

	private List<PernamentSeat> loadExtra(Message<List<CrimeChart>> requestMessage, String actionType) {
		CrimeChart cr = requestMessage.getPayload().getFirst();
		return locationService.getAllPoliticalSeats();
//		return crimeChartRepo.getAllPoliticalSeats();
	}

	private List<Location> select(Message<List<CrimeChart>> requestMessage, String actionType) {
		CrimeChart cr = requestMessage.getPayload().getFirst();
		List<Location> list = locationService.findLocation(cr.getParentKey(), cr.getLocationType());
		return list;
	}

	private List<CrimeChart> insert(Message requestMessage, String actionType) throws Exception {
		CrimeChart cc = ((List<CrimeChart>) requestMessage.getPayload()).get(0);

//		crimeChartRepo.save(cc);

		return crimeChartRepo.findAll();
	}

	private CrimeChart getCrimeById(Message<List<CrimeChart>> requestMessage, String actionType) throws Exception {
		CrimeChart request = requestMessage.getPayload().getFirst();
		Long crimeId = request.getCrimeId();

		if (crimeId == null) {
			throw new IllegalArgumentException("Crime ID cannot be null");
		}

		CrimeChart crimeInfo = crimeChartRepo.findById(crimeId).get();

		List<Person> persons = personRepo.findByCrimeId(crimeId);

		crimeInfo.setPersons(persons);
		
		//find document
		crimeInfo.setImageInfo(documentsInfoService.findFile(crimeId));
		return crimeInfo;
	}

	@Transactional
	public ResponseEntity<?> saveCriminal(CrimeChart criminalData, Long userId) throws Exception {
		MultipartFile[] files = criminalData.getFiles();
		criminalData = saveOrUpdate(criminalData, userId);

		if (files != null && files.length > 0) {

			for (int i = 0; i < files.length; i++) {
				MultipartFile mFile = files[i];
				String filePath = FileUtils.saveFile2Dir(mFile, path);
				log.info("saving document info to the db. path {}", filePath);

				documentsInfoService.saveDocument(criminalData.getCrimeId(), filePath, Str.CRIME_CHART,
						mFile.getOriginalFilename(), DocType.IMAGE);
			}

		}
		return ResponseEntity.ok("Save done.");
	}

	private CrimeChart saveOrUpdate(CrimeChart criminalData, Long userId) {
		criminalData.setUserModId(userId);

		if (criminalData.getCrimeId() != null) {

			CrimeChart existing = crimeChartRepo.findById(criminalData.getCrimeId()).orElseThrow(
					() -> new RuntimeException("CrimeChart not found with id: " + criminalData.getCrimeId()));

			existing.setTypeOfCrimeId(criminalData.getTypeOfCrimeId());
			existing.setTime(criminalData.getTime());
			existing.setType(criminalData.getType());
			existing.setPartyName(criminalData.getPartyName());
			existing.setParliamentarySeatId(criminalData.getParliamentarySeatId());
			existing.setPoliticalPartyId(criminalData.getPoliticalPartyId());
			existing.setPoliticalPartyName(criminalData.getPoliticalPartyName());
			existing.setLocationName(criminalData.getLocationName());
			existing.setPresenceNumber(criminalData.getPresenceNumber());
			existing.setDistrictId(criminalData.getDistrictId());
			existing.setDivisionId(criminalData.getDivisionId());
			existing.setUpazilaId(criminalData.getUpazilaId());
			existing.setInjuredNumber(criminalData.getInjuredNumber());
			existing.setDeathsNumber(criminalData.getDeathsNumber());
			existing.setSocialOrganizationName(criminalData.getSocialOrganizationName());
			existing.setOrganizationName(criminalData.getOrganizationName());
			existing.setOverView(criminalData.getOverView());
			existing.setVictimReligious(criminalData.getVictimReligious());
			existing.setLegalAdministrativeAction(criminalData.getLegalAdministrativeAction());

			existing.setModTime(new Date());
			existing.setUserModId(userId);

			CrimeChart updated = crimeChartRepo.save(existing);

			personService.updatePersons(criminalData.getPersons(), updated.getCrimeId());
			return updated;
		} else {

			criminalData.setCreatorId(userId);
			criminalData.setEntryTime(new Date());
			CrimeChart saved = crimeChartRepo.save(criminalData);

			if (saved.getCrimeId() == null) {
				throw new RuntimeException("Save not successful.");
			}

			personService.savePersons(criminalData.getPersons(), saved.getCrimeId());
			return saved;
		}
	}

	public void deleteCrime(VwCrimeInfo vwCrimeInfo) {
		log.info("deleting crime informarion for crimeId: {}", vwCrimeInfo.getCrimeId());
		CrimeChart cr = crimeChartRepo.findById(vwCrimeInfo.getCrimeId()).orElse(null);
		if(cr == null) {
			throw new RuntimeException("Crime information not found.");
		}
		cr.setActive(0);
		crimeChartRepo.save(cr);
	}

//	private CrimeChart save(CrimeChart criminalData, Long userId) {
//		// TODO need to create save logic and save value
//		criminalData.setCreatorId(userId);
//		criminalData.setEntryTime(new Date());
//		criminalData.setUserModId(userId);
//		CrimeChart crm = crimeChartRepo.save(criminalData);
//		if(crm.getCrimeId() == null) {
//			throw new RuntimeException("Save not successful.");
//		}
//		personService.savePersons(criminalData.getPersons(), crm.getCrimeId());
//		return crm;
//	}

}
