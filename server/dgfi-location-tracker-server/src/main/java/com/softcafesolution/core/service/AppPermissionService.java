package com.softcafesolution.core.service;


import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.AppPermission;
import com.softcafesolution.core.entity.Role;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.AppPermissionRepo;
import com.softcafesolution.core.repo.GenericMapRepo;
import com.softcafesolution.core.utils.AppUtils;


@Service
public class AppPermissionService extends AbstractMessageService<List<AppPermission>> {

	private static final Logger log = LogManager.getLogger();
	@Autowired
	AppPermissionRepo permissionRepo;

	
	@Autowired
	SharedGenericMapService sharedGenericMapService;
	
	@Autowired
	RoleService roleService;
	
	@Autowired
	private GenericMapRepo genericMapRepo;
	
	
	private static final String APP_PERMISSION = "APP_PERMISSION";
	private static final String ROLE = "ROLE";
//    @Autowired
//    private UserService userService;


	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<AppPermission> objList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<AppPermission> objList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				AppPermission objList = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				List<AppPermission> objList = update(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.SELECT_PERMISSION_ROLE.toString())) {
				AppPermission objList = selectPermissionRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.MANAGE_APP_PERMISSION.toString())) {
				AppPermission objList = managePermissionRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.LOAD_PERMISSION.toString())) {
				List<AppPermission> objList = loadPermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			} 
			else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<AppPermission> objList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
			}
			else if (actionType.equals(ActionType.APPROVE.toString())) {
				AppPermission objList = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, objList);
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
	
	
	
	
	private AppPermission approve(Message<List<AppPermission>> message, String action) {
		AppPermission ap = message.getPayload().get(0);
		AppPermission db = permissionRepo.findById(ap.getPermissionId()).get();
		

		return permissionRepo.save(db);
	}

	private AppPermission save(Message<List<AppPermission>> message, String action) {
		AppPermission st = message.getPayload().get(0);
		
		
		AppPermission db = permissionRepo.findById(st.getPermissionId()).get();
		db.setDisplayName(st.getDisplayName());
		db.setDesc(st.getDesc());
		return permissionRepo.save(db);
	}

	private AppPermission selectPermissionRole(Message<List<AppPermission>> message, String action) {
		AppPermission st = message.getPayload().get(0);

		List<Role> roleList = roleService.selectAssignedRole(st.getPermissionId(), APP_PERMISSION);
		st.setRoleList(roleList);

		List<Role> unassignRoleList = roleService.selectUnassignRoleList(roleList);
		st.setUnassignRoleList(unassignRoleList);
		return st;
	}
	
	private AppPermission managePermissionRole(Message<List<AppPermission>> message, String action) {
		AppPermission rg = message.getPayload().get(0);
		List<Role> roleList = rg.getRoleList();
		Long customerId = message.getHeader().getCustomerId();
		
		sharedGenericMapService.unMapAndMap(rg.getPermissionId(), roleList.stream().mapToLong(Role::getRoleId).boxed().collect(Collectors.toList()), APP_PERMISSION, ROLE, message.getHeader().getUserId());

		return rg;
	}


	private List<AppPermission> loadPermission(Message<List<AppPermission>> message, String action) {
		AppPermission pref = message.getPayload().get(0);
		List<AppPermission> permissions = permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
		
		for(AppPermission p : permissions) {
			p.setRoleList(roleService.getPermissionRole(p.getPermissionId()));
		}
		return permissions;
	}

	private List<AppPermission> delete(Message<List<AppPermission>> message, String action) {
		AppPermission pref = message.getPayload().get(0);
		pref.setActive(0);
		permissionRepo.save(pref);
		return AppUtils.toList(permissionRepo.findAll());
	}

	private List<AppPermission> select(Message<List<AppPermission>> message, String action) throws Exception {
		AppPermission pref = message.getPayload().get(0);
		return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
	}

	private List<AppPermission> insert(Message<List<AppPermission>> message, String action) throws Exception {
		AppPermission pref = message.getPayload().get(0);
		permissionRepo.save(pref);
		return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
	}
	private void insert(AppPermission pref, String action) throws Exception {
		permissionRepo.save(pref);
	}

	public List<AppPermission> insert(List<AppPermission> AppPermissionList, String action) throws Exception {
		AppPermissionList.parallelStream().forEach( map ->{
			try {
				insert(map, action);
			} catch (Exception e) {
				log.error("Error executing action/id [{}]",action);
			}
		});
		return AppUtils.toList(permissionRepo.findAll());
	}


	private List<AppPermission> update(Message<List<AppPermission>> message, String action) throws Exception {
		AppPermission pref = message.getPayload().get(0);
		permissionRepo.save(pref);
		return permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName"));
	}

	public AppPermission mapRoleToPermission(long permissionId, long roleId, long userId) {

//		User user = userService.findUserById(userId);
		log.info("Adding role to permission [{}]:[{}]", permissionId, roleId);
		sharedGenericMapService.mapNew(permissionId, roleId, APP_PERMISSION, ROLE, userId);
//		return permissionRepo.findById(permissionId).get();
        return permissionRepo.findById(permissionId).get();
	}
	
	public AppPermission mapRoleToPermission(long permissionId, String roleId, long userId) {
//		User user = userService.findUserById(userId);

		log.info("Adding role to permission [{}]:[{}]", permissionId, roleId);
		List<Long> ids = Arrays.stream(roleId.split(",")).map(Long::valueOf).collect(Collectors.toList());
		sharedGenericMapService.mapNew(permissionId, ids, APP_PERMISSION, ROLE, userId);
		return permissionRepo.findById(permissionId).get();
	}

	public AppPermission mapRoleToPermission(String permissionName, String roleName, long userId) {
		AppPermission p =permissionRepo.findByPermissionName(permissionName);
		Role r = roleService.roleRepo.findByRoleName(roleName);
		
		if(p != null && r != null) {
			return mapRoleToPermission(p.getPermissionId(), r.getRoleId(), userId);
		}
		log.info("Role or permission not found");
		return null;
	}

	public List<AppPermission> getPermission(User user) {
		List<Long> roleIds = user.getRoleList().stream().map(Role::getRoleId).toList();
		if (roleIds.isEmpty()) {
			return List.of(new AppPermission());
		}
		return findPermissionByRoleIds(roleIds);
	}

	private List<AppPermission> findPermissionByRoleIds(List<Long> roleIds) {
		return permissionRepo.findByRoleIds(roleIds);
	}
}
