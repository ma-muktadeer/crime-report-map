package com.softcafesolution.core.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.GenericMap;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.GenericMapRepo;


@Service(value ="GenericMapService")
public class GenericMapService extends AbstractMessageService<GenericMap> {
	private static final Logger log = LoggerFactory.getLogger(GenericMapService.class);
	@Autowired GenericMapRepo genericMapRepo;
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	

}
