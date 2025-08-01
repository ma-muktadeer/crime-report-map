package com.softcafesolution.core.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.SConfiguration;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.SConfigurationRepo;

import io.jsonwebtoken.lang.Collections;

@Service
public class SConfigurationService extends AbstractMessageService<List<SConfiguration>> {
	private static final Logger log = LoggerFactory.getLogger(SConfigurationService.class);

	private static final String NEW = "NEW";
	private static final String MODIFIED = "MODIFIED";
	private static final String APPROVED = "APPROVED";
	private static final String PEND_DELETE = "PEND_DELETE";
	private static final String APPROVED_PEND_DELETE = "APPROVED_PEND_DELETE";

	@Autowired
	private SConfigurationRepo config;

	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<SConfiguration> userLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_SELECT_1.toString())) {
				List<SConfiguration> obj = select1(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2_EXPLOSIVE_TYPE.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_2_ROUND_TYPE.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_3.toString())) {
				SConfiguration obj = select3(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SELECT_APPROVE.toString())) {
				List<SConfiguration> obj = selectApprove(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<SConfiguration> obj = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<SConfiguration> obj = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<SConfiguration> obj = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				List<SConfiguration> obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.SELECT_2_TYPE_OF_AMMUNITION_SAFETY_DISTANCE.toString())) {
				List<SConfiguration> obj = select2(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.APPROVE.toString())) {
				SConfiguration obj = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.LOAD_PRODUCTS_NAME.toString())) {
				List<SConfiguration> obj = loadProductsName(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private List<SConfiguration> delete(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().getFirst();
		sc.setActive(0);
		sc.setModTime(new Date());
		sc.setUserModId(Long.valueOf(requestMessage.getHeader().getUserId()));
		config.save(sc);
		return select2(sc);
	}

	private List<SConfiguration> loadProductsName(Message<List<SConfiguration>> requestMessage, String actionType) {
		SConfiguration sc = requestMessage.getPayload().getFirst();
		return config.findAllByConfigGroupAndConfigSubGroupAndActive(sc.getConfigGroup(), sc.getConfigSubGroup(), 1);
	}

	private List<SConfiguration> selectApprove(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);
		List<SConfiguration> sc = config.findByConfigGroupAndConfigSubGroupAndValue5AndActive(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), sConfig.getValue5(), 1);
		return sc;
	}

	private SConfiguration approve(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);

		SConfiguration d = config.findById(sConfig.getConfigId()).get();

		d.setValue5(APPROVED);

		return config.save(d);
	}

	private List<SConfiguration> save(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);

		if (sConfig.getConfigId() == null) {
			sConfig.setActive(1);
			sConfig.setEntryTime(new Date());
			sConfig.setCreatorId(Long.valueOf(msg.getHeader().getUserId()));
			sConfig.setValue5(NEW);
			return insert(msg, actionType);
		} else {
			return update(msg, actionType);
		}

	}

	private List<SConfiguration> insert(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);
		SConfiguration duplicate = config.duplicate(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				sConfig.getValue1());
		if (duplicate != null) {
			throw new Exception("Duplicate configuration [" + sConfig.getValue1() + "]");
		}
		Long userId = Long.valueOf(msg.getHeader().getUserId());
		sConfig.setCreatorId(userId);
		sConfig.setUserModId(userId);
		config.save(sConfig);

		return select2(sConfig);
	}

	private List<SConfiguration> update(Message<List<SConfiguration>> msg, String actionType) throws Exception {
		SConfiguration sConfig = msg.getPayload().get(0);
		Optional<SConfiguration> present = config.findById(sConfig.getConfigId());
		if (!present.isPresent()) {
			throw new Exception("configuration not present [" + sConfig.getConfigName() + "]");
		}

		SConfiguration duplicate = config.duplicate(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				sConfig.getValue1());
		if (duplicate != null && duplicate.getConfigId().longValue() != sConfig.getConfigId().longValue()) {
			throw new Exception("Duplicate configuration [" + sConfig.getValue1() + "]");
		}
		sConfig.setModTime(new Date());
		sConfig.setUserModId(Long.valueOf(msg.getHeader().getUserId()));
		sConfig.setValue5(MODIFIED);
		config.save(sConfig);
		return select2(msg, actionType);
	}

	private List<SConfiguration> select(Message<List<SConfiguration>> msg, String actionType) {
		return config.findAll();
	}

	private List<SConfiguration> select1(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select1(sConfig);
	}

	public List<SConfiguration> select1(SConfiguration sConfig) {
		return config.findByConfigGroupAndActive(sConfig.getConfigGroup(), 1);
	}

	private List<SConfiguration> select2(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select2(sConfig);
	}

	public List<SConfiguration> select2(SConfiguration sConfig) {
		return config.findByConfigGroupAndConfigSubGroupAndActive(sConfig.getConfigGroup(), sConfig.getConfigSubGroup(),
				1);
	}

	public List<SConfiguration> selectConfigByIdsAndGroupAndSubgroup(List<Long> configIds, String group, String subGroup) {
		return config.findByConfigIdsAndConfigGroupAndConfigSubGroupAndActive(configIds, group,subGroup, 1);
	}
	
	private SConfiguration select3(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select3(sConfig);
	}

	public SConfiguration select3(SConfiguration sConfig) {
		return config.findByConfigGroupAndConfigSubGroupAndConfigNameAndActive(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), sConfig.getConfigName(), 1);
	}

	public SConfiguration select3(String groupName, String subGroupName, String configName) {
		return config.findByConfigGroupAndConfigSubGroupAndConfigNameAndActive(groupName, subGroupName, configName, 1);
	}

	private List<SConfiguration> select4(Message<List<SConfiguration>> msg, String actionType) {
		SConfiguration sConfig = msg.getPayload().get(0);
		return select4(sConfig);
	}

	public List<SConfiguration> select4(SConfiguration sConfig) {
		return config.findByConfigGroupAndConfigSubGroupAndConfigNameAndActiveOrderByValue1Asc(sConfig.getConfigGroup(),
				sConfig.getConfigSubGroup(), sConfig.getConfigName(), 1);
	}

}
