package com.softcafesolution.core.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.GenericMap;
import com.softcafesolution.core.entity.Role;
import com.softcafesolution.core.entity.RoleGroup;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.enums.AppConstants;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.GenericMapRepo;
import com.softcafesolution.core.repo.RoleGroupRepo;
import com.softcafesolution.core.repo.RoleRepo;


@Service
public class RoleGroupService extends AbstractMessageService<List<RoleGroup>> {
	private static final Logger log = LogManager.getLogger(RoleGroupService.class);

	private static final String ROLE = "ROLE";
	private static final String ROLE_GROUP = "ROLE_GROUP";

	@Autowired
	RoleGroupRepo roleGroupRepo;

	@Autowired
	private RoleService roleService;
	
	@Autowired
	private GenericMapRepo gm;

	@Autowired
	private RoleRepo roleRepo;

	@Autowired
	private GenericMapRepo genericMapRepo;

	@Autowired
	SharedGenericMapService sharedGenericMapService;

	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("Handle request for user:action=>[{}]:[{}]", header.getUserId(), actionType);

			if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				RoleGroup obj = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} 
			else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<RoleGroup> obj = findAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				List<RoleGroup> obj = findAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.ACTION_APPROVE.toString())) {
				RoleGroup obj = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			}
			else if (actionType.equals(ActionType.SELECT_ROLE_GROUP_LIST.toString())) {
				RoleGroup obj = selectRoleGroupList(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, obj);
			} else if (actionType.equals(ActionType.MANAGE_ROLE_GROUP.toString())) {
				RoleGroup userLIst = manageRoleGroup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}

			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex);
		}

		return msgResponse;
	}

	private RoleGroup approve(Message<List<RoleGroup>> message, String action) {
		RoleGroup rg = message.getPayload().get(0);
		
		RoleGroup db = roleGroupRepo.findById(rg.getRoleGroupId()).get();
		
		db.setModTime(new Date());
		db.setUserModId(Long.valueOf(message.getHeader().getUserId()));
		//db.setApproveById(Long.valueOf(message.getHeader().getUserId()));
		//db.setApproveTime(new Date());
		//db.setStatus(AppStatus.APPROVED);
		
		return roleGroupRepo.save(db);
	}

	private RoleGroup manageRoleGroup(Message<List<RoleGroup>> message, String action) {
		RoleGroup rg = message.getPayload().get(0);
		List<Role> roleList = rg.getRoleList();
		List<Role> unassignRoleList = rg.getUnassignRoleList();

		sharedGenericMapService.unmapAllByFrom(rg.getRoleGroupId(), ROLE_GROUP, ROLE,
				Long.valueOf(message.getHeader().getUserId()));

		for (Role role : roleList) {
			// check this role already assign or not.
			// if assign just skip
			// or insert
			GenericMap map = genericMapRepo.findByFromIdAndFromTypeNameAndToIdAndToTypeName(rg.getRoleGroupId(),
					ROLE_GROUP, role.getRoleId(), ROLE);
			if (map == null) {
				map = new GenericMap();
				map.setFromId(rg.getRoleGroupId());
				map.setToId(role.getRoleId());
				map.setFromTypeName(ROLE_GROUP);
				map.setToTypeName(ROLE);
				map.setActive(1);
				map.setVersion(0);
				genericMapRepo.save(map);
			} else if (map.getActive() == 0) {
				map.setVersion(map.getVersion() + 1);
				map.setActive(1);
				genericMapRepo.save(map);
			}
		}
		return rg;
	}

	private RoleGroup selectRoleGroupList(Message<List<RoleGroup>> message, String action) {
		RoleGroup st = message.getPayload().get(0);

		List<Role> roleList = roleService.selectAssignedRole(st.getRoleGroupId(), ROLE_GROUP);
		st.setRoleList(roleList);

		List<Role> unassignRoleList = roleService.selectUnassignRoleList(roleList);
		st.setUnassignRoleList(unassignRoleList);

		return st;
	}

	private List<RoleGroup> findAll(Message<List<RoleGroup>> message, String action) throws Exception {
		RoleGroup st = message.getPayload().get(0);
		return roleGroupRepo.findAll();
	}

	private RoleGroup save(Message<List<RoleGroup>> message, String action) throws Exception {
		RoleGroup st = message.getPayload().get(0);
		if (st.getRoleGroupId() == null) {
			st.setActive(1);
			st.setEntryTime(new Date());
			st.setCreatorId(Long.valueOf(message.getHeader().getUserId()));
			return roleGroupRepo.save(st);
		} else {
			st.setRoleGroupName(st.getRoleGroupName());
			st.setModTime(new Date());
			st.setUserModId(Long.valueOf(message.getHeader().getUserId()));
			return roleGroupRepo.save(st);
		}

	}
	
	public List<RoleGroup> selectUserRoleGroup(User user) {

		// first select map roleush
		// than select role

		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(user.getUserId(), AppConstants.STR_USER, ROLE_GROUP, 1);
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());

			return roleGroupRepo.findByRoleGroupIds(toIdList);
		}
		return Collections.emptyList();
	}
	
	public List<RoleGroup> selectUnassignRoleGroupList(List<RoleGroup> assignRoleList) {
		
		if(null == assignRoleList || assignRoleList.size() == 0) {
			return roleGroupRepo.findByActive(1);
		}

		Set<Long> toIdList = assignRoleList.parallelStream().mapToLong(i -> i.getRoleGroupId()).boxed()
				.collect(Collectors.toSet());

		return roleGroupRepo.findByRoleGroupIdsNotIn(toIdList);
		

	}

}
