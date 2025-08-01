package com.softcafesolution.core.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.Address;
import com.softcafesolution.core.entity.GenericMap;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.enums.AddrFor;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.AddressRepo;

@Service(value = "addressService")
public class AddressService extends AbstractMessageService<List<Address>>{
	private static final Logger log = LoggerFactory.getLogger(AddressService.class);
	
	@Autowired	
	AddressRepo addressRepo;
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<Address> objList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<Address> objList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<Address> objList = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<Address> objList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	private List<Address> select(Message<List<GenericMap>> message, String action) {
		return null;
	}
	
	public List<Address> select(Long refId, AddrFor addFor) {
		return addressRepo.findByAddrRefIdAndAddrForAndActive(refId, addFor.toString(), 1);
	}

	private List<Address> delete(Message<List<GenericMap>> message, String action) {
		// TODO Auto-generated method stub
		return null;
	}

	private List<Address> update(Message<List<GenericMap>> message, String action) {
		// TODO Auto-generated method stub
		return null;
	}

	private List<Address> insert(Message<List<GenericMap>> message, String action) {
		// TODO Auto-generated method stub
		return null;
	}
	
	/*
	 * public Address singleAddr(List<Address> addrList, AddrType addrType) {
	 * if(addrList == null) { return null; }
	 * 
	 * Optional<Address> address =addrList.parallelStream().filter(addr ->
	 * addr.getAddrType().equals(addrType.toString())).findFirst();
	 * if(address.isPresent()) { Address addr = fillAddrName(address.get()); return
	 * addr; } else { return null; } }
	 */
	
	/*
	 * public static Address fillAddrName(Address addr) { if(addr == null) { return
	 * null; } addr.setCountryName(LocationUtils.getNameFromId(addr.getCountryId(),
	 * LocUnit.COUNTRY));
	 * addr.setPoliceStationName(LocationUtils.getNameFromId(addr.getPoliceStationId
	 * (), LocUnit.POLICE_STATION));
	 * addr.setDistrictName(LocationUtils.getNameFromId(addr.getDistrictId(),
	 * LocUnit.DISTRICT));
	 * addr.setDivisionName(LocationUtils.getNameFromId(addr.getDivisionId(),
	 * LocUnit.DIVISION)); return addr; }
	 */

	

}
