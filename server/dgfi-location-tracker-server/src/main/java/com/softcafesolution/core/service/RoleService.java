package com.softcafesolution.core.service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.softcafesolution.core.entity.AppPermission;
import com.softcafesolution.core.utils.AppStatus;
import com.softcafesolution.core.utils.AppUtils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.GenericMap;
import com.softcafesolution.core.entity.Role;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.enums.AppConstants;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.AppPermissionRepo;
import com.softcafesolution.core.repo.GenericMapRepo;
import com.softcafesolution.core.repo.RoleRepo;
import com.softcafesolution.core.utils.CF;
import com.softcafesolution.core.utils.Str;


@Service(value = "roleService")
public class RoleService extends AbstractMessageService<List<Role>> {

	private static final Logger log = LoggerFactory.getLogger(RoleService.class);
	private static final String APP_PERMISSION = "APP_PERMISSION";
	private static final String ROLE = "ROLE";

	@Autowired
	public RoleRepo roleRepo;
	
	
	@Autowired
	AppPermissionRepo permissionRepo;
	
	@Autowired
	private GenericMapRepo gm;
	
	@Autowired
	SharedGenericMapService sharedGenericMapService;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				List<Role> roleLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			} 
			else if (actionType.equals(ActionType.ACTION_SAVE.toString())) {
				Role roleLIst = save(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			 else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				 Role roleLIst = delete(requestMessage, actionType);
	                msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			 }
			else if (actionType.equals(ActionType.SELECT_ROLE_WITH_PERMISSION.toString())) {
				Role roleLIst = selectRoleWithPermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			else if (actionType.equals(ActionType.MANAGE_ROLE_PERMISSION.toString())) {
				Role roleLIst = manageRolePermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}
			else if (actionType.equals(ActionType.APPROVE.toString())) {
				Role roleLIst = approve(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}else if(actionType.equals(ActionType.APPROVE_PERMISSION.toString())) {
				Role roleLIst = approvePermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
			}else if(actionType.equals(ActionType.APPROVE_DEASSIGN_PERMISSION.toString())) {
				Role roleLIst = approveDeAssignPermission(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, roleLIst);
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

	




	private Role delete(Message<List<Role>> message, String action) throws Exception {
	    Role role = message.getPayload().get(0);
	    	    
	    Role db = roleRepo.findById(role.getRoleId())
	        .orElseThrow(() -> new Exception("Role not found with id: " + role.getRoleId()));

	    if(db !=null) {
	    	db.setActive(0);
	    	roleRepo.save(db);
	    	log.info("delete permission for id [{}]" , role.getRoleId());
	    }
	    return db;
	}
	

	public boolean checkPermission(){
		return true;
	}

	private Role approveDeAssignPermission(Message<List<Role>> message, String actionType) {
		try {
			Role role = message.getPayload().get(0);

			AppPermission permission = role.getAppPermissionList().get(0);

			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(permission.getPermissionId(), APP_PERMISSION,
					role.getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus(null);
				map.setActive(0);
				gm.save(map);
			}
			return role;

		} catch (Exception e) {
			log.info("Error! [{}]", e);
			return null;
		}
	}

	private Role approvePermission(Message<List<Role>> message, String actionType) {
		
		try {
			Role role = message.getPayload().get(0);

			AppPermission permission = role.getAppPermissionList().get(0);
			
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(permission.getPermissionId(), AppConstants.APP_PERMISSION,
					role.getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus(Str.APPROVED);
				//map.setApproveById(Long.valueOf(message.getHeader().getUserId()));
				//map.setApproveTime(new Date());
				gm.save(map);
			}

			return role;
			
		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}
		
	}
	
	/*private Role approveDeAssignPermission(Message<List<Role>> message, String actionType) {
		
		try {
			Role role = message.getPayload().get(0);

			AppPermission permission = role.getAppPermissionList().get(0);
			
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(permission.getPermissionId(), APP_PERMISSION,
					role.getRoleId(), ROLE, 1);
				if (map != null) {
					map.setStatus(null);
					map.setActive(0);
					gm.save(map);
				}

			return role;
			
		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}
		
	}*/

	private Role approve(Message<List<Role>> message, String action) {
		Role r = message.getPayload().get(0);
		
		Role d = roleRepo.findById(r.getRoleId()).get();
		
		d.setStatus(AppStatus.APPROVED);
		//d.setApproveById(Long.valueOf(message.getHeader().getUserId()));
		//d.setApproveTime(new Date());
		d.setModTime(new Date());
		d.setUserModId(Long.valueOf(message.getHeader().getUserId()));
		
		
		return roleRepo.save(d);
	}
	
	
	public String[] securityRoles() {
		List<Role> roles = roleRepo.findAll();
		
		List<String> rList = roles.stream().map(i -> i.getRoleName()).collect(Collectors.toList());
		return rList.toArray(new String[rList.size()]);
	}
	
	

	private Role selectRoleWithPermission(Message<List<Role>> message, String action) {
		Role r = message.getPayload().get(0);
		
		List<GenericMap> list = gm.findByToIdAndToTypeNameAndFromTypeNameAndActive(r.getRoleId(), "ROLE", AppConstants.APP_PERMISSION, 1);
		
		if(list.size() > 0) {
			Set<Long> toIdList = list.parallelStream().mapToLong(i -> i.getFromId()).boxed()
					.collect(Collectors.toSet());
			
			List<AppPermission> assigned = permissionRepo.findByPermissionIds(toIdList);
			
			for(AppPermission p : assigned) {
				GenericMap g = list.stream().filter( x -> x.getFromId().longValue() == p.getPermissionId().longValue()).findFirst().get();
				
				p.setGenericMapStatus(g.getStatus());
			}
			
			r.setPermissionList(assigned);
			
			
			Set<Long> unto = assigned.parallelStream().mapToLong(i -> i.getPermissionId()).boxed()
					.collect(Collectors.toSet());
			
			r.setUnassignedPermissionList(permissionRepo.findByPermissionIdsNotIn(unto));
		}
		else {
			r.setPermissionList(new ArrayList<>());
			r.setUnassignedPermissionList(permissionRepo.findByActive(1, Sort.by(Sort.Direction.ASC, "displayName")));
		}
		
		return r;
	}

	private Role manageRolePermission(Message<List<Role>> message, String action) {
		Role r = message.getPayload().get(0);
		Long customerId = message.getHeader().getCustomerId();
		
		List<AppPermission> lList = r.getPermissionList();

		List<AppPermission> ulList = r.getUnassignedPermissionList();
		
		long userId = Long.valueOf(message.getHeader().getUserId());
		for(AppPermission p : lList) {
			GenericMap map = gm.findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(r.getRoleId(), ROLE, p.getPermissionId(), AppConstants.APP_PERMISSION, 1);
			if(map == null) {
				map = gm.findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(r.getRoleId(), ROLE, p.getPermissionId(), AppConstants.APP_PERMISSION, 0);
				
				if(map == null) {
					map = sharedGenericMapService.buildGenericMap(p.getPermissionId(), AppConstants.APP_PERMISSION, r.getRoleId(), ROLE, userId);
					
					map.setStatus(Str.PEND_ASSIGN);
					gm.save(map);
				}
				else {
					map.setActive(1);
//					map.setGenericMapVer(map.getGenericMapVer() + 1);
					map.setModTime(new Date());
					map.setUserModId(message.getHeader().getUserId());
					map.setEntryTime(new Date());
					map.setCreatorId(message.getHeader().getUserId());
					map.setStatus(Str.PEND_ASSIGN);
//					map.setCustomerId(customerId);
					gm.save(map);
				}
			}
			else if(map.getActive() == 0) {
				map.setActive(1);
//				map.setGenericMapVer(map.getGenericMapVer() + 1);
				map.setModTime(new Date());
				map.setUserModId(message.getHeader().getUserId());
				map.setStatus(Str.PEND_ASSIGN);
				gm.save(map);
			}
		
		}
		for(AppPermission p : ulList) {
			GenericMap map = gm.findByToIdAndToTypeNameAndFromIdAndFromTypeNameAndActive(r.getRoleId(), ROLE, p.getPermissionId(), AppConstants.APP_PERMISSION, 1);
			
			if(map != null) {
				map.setActive(1);
//				map.setGenericMapVer(map.getGenericMapVer() + 1);
				map.setModTime(new Date());
				map.setUserModId(Long.valueOf(message.getHeader().getUserId()));
				map.setStatus(Str.PEND_DEASSINED);
				gm.save(map);
			}
		}
		return r;
	}

	private Role save(Message<List<Role>> message, String action) throws Exception{
		Role r = message.getPayload().get(0);
		Long userId = message.getHeader().getUserId();
		Long customerId = message.getHeader().getCustomerId();

		if (r.getRoleId() == null) {
			
			String roleName = r.getDisplayName().replace(" ", "_").toUpperCase();
			r.setRoleName(roleName);
			CF.fillInsert(r);
			r.setEntryTime(new Date());
			r.setCreatorId(message.getHeader().getUserId());
			r.setCreatorId(userId);
			r.setUserModId(userId);
			return roleRepo.save(r);
		} else {
			Role db = roleRepo.findById(r.getRoleId()).get();
			db.setDisplayName(r.getDisplayName());
			db.setDesc(r.getDesc());
			db.setModTime(new Date());
			db.setUserModId(message.getHeader().getUserId());
			return roleRepo.save(db);
		}
		
	}

	private List<Role> select(Message<List<Role>> message, String action) throws Exception {
		List<Role> activeRoles = roleRepo.findByActive(1);
		return activeRoles;

	}

	private List<Role> selectAll(Message requestMessage, String actionType) {
		return StreamSupport.stream(roleRepo.findAll().spliterator(), false).collect(Collectors.toList());
	}

	public void mapRole(Long userId, List<Role> roleList) {
		// map role
		if (null != roleList && roleList.size() > 0) {
			for (Role role : roleList) {
				GenericMap g = new GenericMap();
				g.setFromId(userId);
				g.setFromTypeName(AppConstants.STR_USER);
				g.setToId(role.getRoleId());
				g.setToTypeName(AppConstants.STR_ROLE);
				gm.save(g);
			}
		}
	}

	public List<Role> selectUserRoleByRoleGroup(User user) {
		return roleRepo.selectUserAssignedRoleByRoleGroup(user.getUserId());
	}
	
	
	
	public List<Role> selectAssignedRole(Long fromId, String fromName) {

		// first select map roleush
		// than select role

		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(fromId, fromName, "ROLE", 1);
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());

			return roleRepo.findByRoleIds(toIdList);
		}
		return Collections.emptyList();
	}
	
	
	public List<Role> selectUserActiveRole(User user) {

		//List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(user.getUserId(), AppConstants.STR_USER, "ROLE", 1);
		
		Set<String> st = new HashSet<>();
		//st.add("APPROVED");
		//st.add("PEND_DEASSIGN");
		List<GenericMap> mapList = gm.getToIdItemByStatus(user.getUserId(), AppConstants.STR_USER, "ROLE", st );
		
		
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());
			
			List<Role> roleList = roleRepo.findByRoleIds(toIdList);
			
			for (Role role : roleList) {
				GenericMap g = mapList.stream().filter(m -> m.getToId().equals(role.getRoleId())).findAny().orElse(null);
				
				role.setGenericMapStatus(g.getStatus());
			}
			
			return roleList;
		}
		return Collections.emptyList();
	}
	
	

	public List<Role> selectUserRole(User user) {

		List<GenericMap> mapList = gm.findByFromIdAndFromTypeNameAndToTypeNameAndActive(user.getUserId(), AppConstants.STR_USER, "ROLE", 1);
		
		
		if (mapList.size() > 0) {
			Set<Long> toIdList = mapList.parallelStream().mapToLong(i -> i.getToId()).boxed()
					.collect(Collectors.toSet());
			
			List<Role> roleList = roleRepo.findByRoleIds(toIdList);
			
			for (Role role : roleList) {
				GenericMap g = mapList.stream().filter(m -> m.getToId().equals(role.getRoleId())).findAny().orElse(null);
				
				role.setGenericMapStatus(g.getStatus());
			}
			
			return roleList;
		}
		return Collections.emptyList();
	}
	
	
	
	
	public List<Role> selectUnassignRoleList(List<Role> assignRoleList) {
		
		if(null == assignRoleList || assignRoleList.size() == 0) {
			return roleRepo.findAll();
		}

		Set<Long> toIdList = assignRoleList.parallelStream().mapToLong(i -> i.getRoleId()).boxed()
				.collect(Collectors.toSet());

		return roleRepo.findByRoleIdsNotIn(toIdList);
		

	}
	
	
	public List<Role> getPermissionRole(long permissionId){
		return roleRepo.getPermissionList(permissionId);
	}
	
	

}
