package com.softcafesolution.core.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.RandomUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.GenericMap;
import com.softcafesolution.core.entity.Login;
import com.softcafesolution.core.entity.Role;
import com.softcafesolution.core.entity.RoleGroup;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.GenericMessage;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.MessagingConstants;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.repo.GenericMapRepo;
import com.softcafesolution.core.repo.LoginRepo;
import com.softcafesolution.core.repo.UserRepo;
import com.softcafesolution.core.utils.ActivityType;
import com.softcafesolution.core.utils.AppUtils;
import com.softcafesolution.core.utils.CF;
import com.softcafesolution.core.utils.Str;

@Service(value = "userService")
public class UserService extends AbstractMessageService<List<User>> {
	private static final Logger log = LoggerFactory.getLogger(UserService.class);

	private static final String USER = "USER";
	private static final String ROLE = "ROLE";

	private static final String APP_PERMISSION = "APP_PERMISSION";

	private static final String ROLE_GROUP = "ROLE_GROUP";

	private static final String DEPARTMENT = "DEPARTMENT";

	private static final String APP_NAME = "appName";

	private static final String USER_APP = "USER_APP";

	private static final String USER_DEPARTMENT = "USER_DEPARTMENT";

	// @Value("${tmp.code.validity.min}")
	// private int tmpCodeValidity;

	@Value("${sendActivationMail:true}")
	private boolean sendActivationMail;

	@Value("${appName:DGFI Location Tracker Server}")
	public String appName;

	@Value("${pass.secret.key:JKHUUYFYTEDFJKHjuuilhiweor83957394irskjfsei857wu%&^*()&^}")
	private String SECRET_KEY;

	@Value("${userRegistrationAdminMail:ahoshan.habib@dhakabank.com.bd}")
	String userRegistrationAdminMail;

	@Value("${ldapLogin:false}")
	private boolean ldapLogin;

//    @Value("${dbLoginOnLdapFail:true}")
//    private boolean dbLoginOnLdapFail;

	@Value("${defaultAdPass:Ld@pP#$$w@dr}")
	private String defaultAdPass;

	@Autowired
	private LoginRepo loginRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private RoleService roleService;

	@Autowired
	private RoleGroupService roleGroupService;

	@Autowired
	SConfigurationService sConfigurationService;

	@Autowired
	LoginService loginService;

	@Autowired
	private GenericMapRepo gm;

	@Autowired
	AddressService addressService;

	@Autowired
	MailService mailService;

	@Autowired
	GenericMapRepo genericMapRepo;

	@Autowired
	GenericMapService genericMapService;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private AppPermissionService appPermissionService;

	private boolean isAllowMakerChecker = false;

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Message<?> serviceSingle(Message requestMessage) throws Exception {

		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {

			header = requestMessage.getHeader();
			String actionType = header.getActionType();

			if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				Page<User> userLIst = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.SELECT_SINGLE.toString())) {
				List<User> userLIst = selectSingle(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}else if (actionType.equals(ActionType.ACTION_SELECT_SINGLE_WITH_ROLE.toString())) {
				List<User> userLIst = selectSingleWithRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			}
			else if (actionType.equals(ActionType.REGISTER.toString())) {
				List<User> userLIst = register(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_MANAGE_ROLE.toString())) {
				List<User> userLIst = manageRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.ACTION_MANAGE_ROLE_GROUP.toString())) {
				List<User> userLIst = manageRoleGroup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.MANAGE_ROLE_GROUP.toString())) {
				List<User> userLIst = manageRoleGroup(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.APPROVE.toString())) {
				Page<User> user = approved(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				Page<User> userList = insert(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_UPDATE.toString())) {
				msgResponse = ResponseBuilder.buildResponse(header, update(requestMessage));
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				Page<User> user = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_LOGIN.toString())) {
				List<User> userList = login(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_LOGOUT.toString())) {
				User user = logout(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_CHANGE_PASS.toString())) {
				User userList = changePass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userList);
			} else if (actionType.equals(ActionType.ACTION_FORGOT_PASS.toString())) {
				User user = forgotPass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_TOGGLE_ACTIVATION.toString())) {
				User user = toggleActivation(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.ACTION_AUTH_FORGOT_PASS.toString())) {
				// this action use when forgot pass word send and user try to recover password
				// this allow change password via tmp password
				User user = authForgotPass(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else if (actionType.equals(ActionType.APPROVE_ROLE.toString())) {
				List<User> userLIst = approveRole(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.APPROVE_DEASSIGN.toString())) {
				List<User> userLIst = approveDeAssign(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, userLIst);
			} else if (actionType.equals(ActionType.USER_ACTIVATION.toString())) {
				User user = userActivation(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, user);
			} else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			try {
				msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

				log.error("Exception Message **** [{}]", ex);
			} catch (Exception e) {
				log.error("Error parsing expception");

				header.setErrorMsg(ex.getLocalizedMessage());
				GenericMessage m = new GenericMessage();
				header.setStatus(MessagingConstants.STATUS_ERROR);
				m.setHeader(header);
				return m;
			}

		}

		return msgResponse;
	}

	private List<User> manageRoleGroup(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);

		List<RoleGroup> roleGroupList = user.getRoleGroupList();

		sharedGenericMapService.unmapAllByFrom(user.getUserId(), USER, ROLE_GROUP,
				Long.valueOf(message.getHeader().getUserId()));

		for (RoleGroup roleGroup : roleGroupList) {
			// check this role already assign or not.
			// if assign just skip
			// or insert
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeName(user.getUserId(), USER,
					roleGroup.getRoleGroupId(), ROLE_GROUP);
			if (map == null) {
				map = new GenericMap();
				map.setFromId(user.getUserId());
				map.setToId(roleGroup.getRoleGroupId());
				map.setFromTypeName(USER);
				map.setToTypeName(ROLE_GROUP);
				map.setActive(1);
				map.setVersion(0);
				gm.save(map);
			} else if (map.getActive() == 0) {
				map.setVersion(map.getVersion() + 1);
				map.setActive(1);
				gm.save(map);
			}
		}

		return selectSingleWithRoleGroup(message, ActionType.SELECT_SINGLE.toString());

	}

	private Page<User> approved(Message<List<User>> requestMessage, String actionType) throws Exception {
		User usr = requestMessage.getPayload().get(0);
		User dbUser = null;

		Pageable pageable = PageRequest.of(usr.getPageNumber() - 1, usr.getPageSize(), Sort.by("userId").descending());

		log.info("comes for approve user. userId:{}", usr.getUserId());
		if (usr.getUserId() != null) {
//			dbUser = userRepo.findByUserIdAndFirstLoginAndUserStatusAndActive(usr.getUserId(), 1, Str.PEND_APPROVE, 1);
			dbUser = userRepo.findByUserIdAndActive(usr.getUserId(), 1);

			if (dbUser != null) {
				dbUser.setUserStatus(Str.ACTIVE);
				dbUser.setModTime(new Date());
				dbUser.setUserModId(Long.valueOf(requestMessage.getHeader().getUserId()));
//                dbUser.setApproveById(Long.valueOf(requestMessage.getHeader().getUserId()));
//                dbUser.setApproveTime(new Date());
				String pass = null;
				dbUser.setAllowLogin(1);
				userRepo.save(dbUser);

			} else {
				log.info("can not find database user.For userId:{}", usr.getUserId());
				throw new Exception("User not found");
			}
		}
		return userRepo.findAllByActive(1, pageable);
	}

	private Page<User> delete(Message<List<User>> message, String actionType) throws Exception {
		User user = message.getPayload().get(0);
		userRepo.delete(user.getUserId(), AppUtils.userModId(message), new Date());
		return selectAll(message);
	}

	private Page<User> update(Message<List<User>> message) throws Exception {
		User user = message.getPayload().get(0);
		User dbUser = userRepo.findById(user.getUserId()).get();

		if (!StringUtils.isBlank(user.getPhoneNumber())) {
			User checkUser = userRepo.findByPhoneNumberAndActive(user.getPhoneNumber(), 1);
			if (checkUser != null && dbUser.getUserId().longValue() != checkUser.getUserId().longValue()) {
				throw new Exception("Duplicate mobile number not allowed.");
			}
		}

		User checkUser = userRepo.findByEmailAndActive(user.getEmail(), 1);
		if (checkUser != null && dbUser.getUserId().longValue() != checkUser.getUserId().longValue()) {
			throw new Exception("Duplicate email not allowed.");
		}
		dbUser.setEmployeeId(user.getEmployeeId());
		dbUser.setFullName(user.getFullName());
		dbUser.setFirstName(user.getFirstName());
		dbUser.setLastName(user.getLastName());
		dbUser.setEmail(user.getEmail());
		dbUser.setDob(user.getDob());
		dbUser.setPhoneNumber(user.getPhoneNumber());
		dbUser.setBranch(user.getBranch());
		dbUser.setBranchId(user.getBranchId());
		dbUser.setNid(user.getNid());
		dbUser.setRemarks(user.getRemarks());
		dbUser.setDesignation(user.getDesignation());
//        dbUser.setLogingMethod(user.getLogingMethod());
		dbUser = checkMakerChecker(dbUser, message.getHeader().getUserId());

		sharedGenericMapService.unMapAndMap(user.getUserId(), user.getDepartmentIdList(), USER, USER_DEPARTMENT,
				message.getHeader().getUserId());

		dbUser = userRepo.save(dbUser);

		return selectAll(message);
	}

	private User checkMakerChecker(User usr, Long userId) {
		if (usr == null) {
			return usr;
		} else {
			return setUserStatus(usr, userId);
		}
	}

	private User setUserStatus(User usr, Long userId) {
		if (!isAllowMakerChecker) {
			if (usr.getActive() == 0) {
				usr.setActive(0);
			} else if (usr.getAllowLogin() == 1) {
				usr.setUserStatus(Str.ACTIVE);
			} else {
				usr.setUserStatus(Str.INACTIVE);
			}
		} else {
			if (usr.getActive() == 0) {
				usr.setUserStatus(Str.PEND_DELETE);
				usr.setActive(1);
			} else if (usr.getAllowLogin() == 1) {
				usr.setUserStatus(Str.PEND_ACTIVE);
				usr.setInactiveDate(new Date());
			} else {
				usr.setUserStatus(Str.PEND_INACTIVE);
			}
			usr.setCreatorId(userId);
			usr.setCheckerTime(new Date());
		}
		return usr;
	}

	private User userActivation(Message<List<User>> message, String actionType) {

		User user = message.getPayload().get(0);

		User dbUser = userRepo.findById(user.getUserId()).get();

		// check roal
//        if (!StringUtils.isBlank(user.getCommonActivity()) && user.getCommonActivity().equals(Str.ACTIVE)) {
//            List<GenericMap> list = genericMapRepo.findByFromIdAndActive(user.getUserId(), 1);
//            if (list.size() == 0) {
//                user.setCommonActivity(Str.ROLE_NOT_FOUND);
//                return user;
//            }
//        }

		if (isAllowMakerChecker) {
			if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.PEND_INACTIVE)) {
				dbUser = activeInactiveUserMaker(dbUser, message, Str.PEND_INACTIVE, ActivityType.USER_INACITVE_MAKE);
			} else if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.PEND_ACTIVE)) {
				dbUser = activeInactiveUserMaker(dbUser, message, Str.PEND_ACTIVE, ActivityType.USER_ACITVE_MAKE);
			} else if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.ACTIVE)) {
				dbUser = activeInactiveUserChecker(dbUser, message, Str.ACTIVE, ActivityType.USER_INACITVE_CHECKE, 1);
			} else if (!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.INACTIVE)) {
				dbUser = activeInactiveUserChecker(dbUser, message, Str.INACTIVE, ActivityType.USER_INACITVE_CHECKE, 0);
			}
		} else {
			toggleActivation(message, actionType);
		}

//		else if(!StringUtils.isBlank(user.getUserStatus()) && user.getUserStatus().equals(Str.ACTIVE)) {
//			if(dbUser.getUserStatus().equals(Str.PEND_INACTIVE)) {
//				dbUser = activeInactiveUserChecker(dbUser, message, Str.INACTIVE, ActivityType.USER_INACITVE_CHECKE, 0);
//			}
//			else if(dbUser.getUserStatus().equals(Str.PEND_ACTIVE)) {
//				dbUser = activeInactiveUserChecker(dbUser, message, Str.ACTIVE, ActivityType.USER_ACITVE_CHECK, 1);
//			}
//		}
		return dbUser;

	}

	private User activeInactiveUserMaker(User dbUser, Message<List<User>> message, String status,
			ActivityType activityType) {
		Long userModId = AppUtils.userModId(message);

		dbUser = updateUser(dbUser, userModId, status);

//        activityLogService.save(userModId, dbUser.getUserId(), activityType,
//                message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress());

		// send mail to who have user authorization permission AND role USER_ADMIN
//		try {
//			sendMail4UserInactive(dbUser.getEmail(), true);
//		} catch (Exception e) {
//			log.info("getting error: {}", e.getMessage());
//		}

		return dbUser;
	}

	private User activeInactiveUserChecker(User dbUser, Message<List<User>> message, String status,
			ActivityType activityType, int allowLogin) {
		Long userModId = AppUtils.userModId(message);
		if (allowLogin == 0) {
			dbUser.setInactiveDate(new Date());
		}
		dbUser.setAllowLogin(allowLogin);
		dbUser = updateUser(dbUser, userModId, status);

//        activityLogService.save(userModId, dbUser.getUserId(), activityType,
//                message.getHeader().getSenderSourceIPAddress(), message.getHeader().getSenderGatewayIPAddress());

//		String email = dbUser.getEmail();
//		if (dbUser.getUserType() != "INTERNAL_USER") {
//			User createUser = userRepo.findByUserIdAndActive(dbUser.getCreatorId(), 1);
//			if (createUser != null) {
//				email += "," + createUser.getEmail();
//			}
//		}

		// send mail to who have user authorization permission AND role USER_ADMIN
		/*
		 * try { MailType mailType = findMailType(allowLogin, dbUser.getUserType());
		 * 
		 * MailTemplete mt = mailTempleteService.findActiveInactiveMailTemp(mailType);
		 * 
		 * if (mt != null) { MailTemplete m =
		 * mailTempleteService.buildUserSubjectAndBody(mt, null, dbUser, null); //
		 * sendMail4UserInactive(email, false, m, mailType);
		 * 
		 * mailNotificationService.sendUserNotification(m, dbUser.getEmail(), mailType);
		 * 
		 * } else { log.info("active or inactive mail not found"); }
		 * 
		 * } catch (Exception e) { log.info("getting error: {}", e.getMessage()); }
		 */

		return dbUser;
	}

	private User updateUser(User dbUser, Long userModId, String status) {
		dbUser.setModTime(new Date());
		dbUser.setUserModId(userModId);
		dbUser.setUserStatus(status);
		dbUser.setVersion(dbUser.getVersion() + 1);
		return userRepo.save(dbUser);

	}

	private User activeUser(User dbUser, Long userModId) {

		dbUser.setAllowLogin(dbUser.getAllowLogin() == null || dbUser.getAllowLogin() == 0 ? 1 : 0);
		dbUser.setModTime(new Date());
		dbUser.setUserModId(userModId);
		dbUser.setUserStatus(dbUser.getAllowLogin() == 0 ? Str.INACTIVE : Str.ACTIVE);
		dbUser.setVersion(dbUser.getVersion() + 1);
		userRepo.save(dbUser);

		// userRepo.toggleActivation(user.getAllowLogin(), user.getUserId(),
		// AppUtils.userModId(message), new Date());
		/*
		 * dbUser = userRepo.findById(dbUser.getUserId()).get();
		 * 
		 * int currentState = dbUser.getAllowLogin();
		 * 
		 * if (currentState == 1 && sendActivationMail) { // send activation mail
		 * log.info("Sending activation mail"); String email =
		 * getUserMail(dbUser.getUserId()); if (email != null) { try {
		 * sendActivationToggleMail(activationMailSubject, mailReplace(dbUser,
		 * activationMailBody), email); if (sendActivationToggleMailToAdmin) {
		 * log.info("Sending activation mail to admin");
		 * sendActivationToggleMail(activationMailSubject, mailReplace(dbUser,
		 * activationMailToAdminBody), userRegistrationAdminMail); } } catch (Exception
		 * e) { log.error("Error sending activation mail {}", e); } } } else if
		 * (currentState == 0 && sendDeactivationMail) { // send de activation mail
		 * log.info("Sending deactivation mail"); String email =
		 * getUserMail(dbUser.getUserId()); if (email != null) { try {
		 * sendActivationToggleMail(deActivationMailSubject, mailReplace(dbUser,
		 * deActivationMailBody), email); if (sendActivationToggleMailToAdmin) {
		 * log.info("Sending deactivation mail to admin");
		 * sendActivationToggleMail(deActivationMailSubject, mailReplace(dbUser,
		 * deActivationMailToAdminBody), userRegistrationAdminMail); } } catch
		 * (Exception e) { log.error("Error sending deactivation mail {}", e); } } }
		 */
		return dbUser;
	}

	private User toggleActivation(Message<List<User>> message, String actionType) {

		User user = message.getPayload().get(0);

		User dbUser = userRepo.findById(user.getUserId()).get();
		return activeUser(dbUser, AppUtils.userModId(message));
	}

	private void sendActivationToggleMail(String subject, String body, String email) {
		log.info("Sending Activation/Deactivation toggle mail to [{}]", email);
		Runnable task = () -> {
			try {
				mailService.send(subject, body, email);
			} catch (Exception e) {
				log.error("Error Sending Activation toggle mail to [{}]\n{}", email, e);
			}
		};
		Thread thread = new Thread(task);
		thread.start();
	}

	private String getUserMail(Long userId) {
		User dbUser = userRepo.findByUserIdAndActive(userId, 1);
		if (!StringUtils.isBlank(dbUser.getEmail())) {
			return dbUser.getEmail();
		} else {
			log.info("User mail not found for userId [{}]", userId);
		}
		return null;
	}

	public User findUserById(Long userId) {
		return userRepo.findByUserIdAndActive(userId, 1);
	}

	private List<User> manageRole(Message<List<User>> message, String actionType) throws Exception {

		// user roleList if any assign == false. need unassign
		// user unassignRollList if any assign true need to insert

		User user = message.getPayload().get(0);

		List<Role> roleList = user.getRoleList();
		List<Role> unassignRoleList = user.getUnassignRoleList();
		for (Role role : roleList) {
			// check this role already assign or not.
			// if assign just skip
			// or insert
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeName(user.getUserId(), USER,
					role.getRoleId(), ROLE);
			if (map == null) {
				map = new GenericMap();
				map.setFromId(user.getUserId());
				map.setToId(role.getRoleId());
				map.setFromTypeName(USER);
				map.setToTypeName(ROLE);
				map.setActive(1);
				map.setVersion(0);
				map.setModTime(new Date());
				map.setUserModId(message.getHeader().getUserId());
				map.setStatus(Str.PEND_ASSIGN);
				map.setCreatorId(user.getUserId());
				gm.save(map);
			} else if (map.getActive() == 0) {
				map.setVersion(map.getVersion() + 1);
				map.setActive(1);
				map.setModTime(new Date());
				map.setUserModId(message.getHeader().getUserId());
				map.setStatus(Str.PEND_ASSIGN);
				gm.save(map);
			}
		}

		for (Role role : unassignRoleList) {
			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(user.getUserId(), USER,
					role.getRoleId(), ROLE, 1);

			if (null == map) {
				continue;
			}
			map.setVersion(map.getVersion() + 1);
			map.setModTime(new Date());
			map.setUserModId(message.getHeader().getUserId());
			map.setActive(0);
			map.setStatus(Str.PEND_DEASSINED);
			gm.save(map);
		}

		return selectSingleWithRole(message, ActionType.SELECT_SINGLE.toString());
	}

	private User forgotPass(Message<List<User>> message, String actionType) throws Exception {
		User user = null;

		user = message.getPayload().get(0);
		user = userRepo.findByLoginNameAndEmailAndActive(user.getLoginName(), user.getEmail(), 1);

		if (user == null) {
			throw new Exception("User does not exist");
		}
		user = sendCode(user, "Educafe Temp Password", "Temporary password.");
		user = userRepo.save(user);
		return user;
	}

	private User authForgotPass(Message<List<User>> message, String actionType) throws Exception {
		User user = null;

		user = message.getPayload().get(0);
		User authUser = userRepo.findByLoginNameAndEmailAndVerificationCodeAndActive(user.getLoginName(),
				user.getEmail(), user.getVerificationCode(), 1);
		if (null != authUser) {
			authUser.setPassword(user.getNewPass());
			authUser.setVersion(authUser.getVersion() + 1);
			authUser.setVerificationCode(null);
			CF.fillUpdate(authUser);
			authUser = userRepo.save(authUser);
		} else {
			throw new Exception("Invalid verification code");
		}
		return authUser;

	}

	private User changePass(Message<List<User>> message, String actionType) throws Exception {
		User user = null;

		user = message.getPayload().get(0);
		if (user.getPassword().equals(user.getNewPass())) {
			throw new Exception("Old password and new password must not be same");
		}
		User loginUser = userRepo.login(user.getLoginName(), user.getPassword());
		if (loginUser != null) {
			// now change pass
			loginUser.setPassword(user.getNewPass());
			userRepo.save(loginUser);
		} else {
			throw new Exception("Invalid Username or Password");
		}
		return loginUser;
	}

	private User logout(Message<List<User>> message, String actionType) throws Exception {
		User user = null;

		user = message.getPayload().get(0);
		updateLogin(message, user, 0, user.getLoginName());

		return user;
	}

	private void updateLogin(Message message, User user, int loginLogout, String username) throws Exception {
		Login login = new Login();
		login.setUserId(user.getUserId());

		if (loginLogout == 0)
			login.setLogoutTime(new Date());
		else
			login.setLoginTime(new Date());

		login.setGateway(message.getHeader().getSenderGatewayIPAddress());
		login.setIpAddr(message.getHeader().getSenderSourceIPAddress());
		login.setLogin(loginLogout);
		login.setLoginName(username);
		login.setAttemptStatus(1);
		login.setFailResolved(0);
		loginRepo.save(login);
	}

	private void updateLogin(Message message, User user, int loginLogout) throws Exception {
		Login login = new Login();
		login.setUserId(user.getUserId());

		if (loginLogout == 0)
			login.setLogoutTime(new Date());
		else
			login.setLoginTime(new Date());

		login.setGateway(message.getHeader().getSenderGatewayIPAddress());
		login.setIpAddr(message.getHeader().getSenderSourceIPAddress());
		login.setLogin(loginLogout);
		loginRepo.save(login);
	}

	private void doAuthenticate(User user) {
		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user.getLoginName(),
				user.getPassword());
		try {
			authenticationManager.authenticate(auth);
		} catch (Exception e) {
			throw new BadCredentialsException("Invalid user name or password");
		}
	}

	private List<User> login(Message<List<User>> message, String actionType) throws Exception {
		List<User> userList = null;
		List<Role> roleList = null;
		User user = null;

		User usr = message.getPayload().get(0);

//        doAuthenticate(usr);

//        user = userRepo.login(usr.getLoginName(), usr.getPassword());
		user = userRepo.findByLoginNameAndActive(usr.getLoginName(), 1);

		if (user != null) {
			if (!passwordEncoder.matches(usr.getPassword(), user.getPassword())) {
				throw new BadCredentialsException("Invalid user name or password");
			}

			userList = new ArrayList<>();
			if (user.getTwoFactorAuth() != null && user.getTwoFactorAuth() == 1) {
				user = sendCode(user, "Educafe Verification Code", "Verification Code");
				user = userRepo.save(user);
				userList.add(user);
				return userList;
			}
			// now select role
			user.setRoleList(roleService.selectUserRole(user));
			user.setPermissionList(appPermissionService.getPermission(user));
			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}

	}

	private User sendCode(User user, String subject, String body) throws Exception {
		// send auth code to mail
		int vc = RandomUtils.secure().randomInt(100000, 9999999);
		log.info("[{}]", vc);
		user.setVerificationCode(Integer.toString(vc));
		user.setModTime(new Date());
		user.setVersion(user.getVersion() + 1);
		Runnable task = () -> {
			SystemMailService.sendAppSecurityCode(body + " : " + vc, subject, user.getEmail());
		};
		new Thread(task).start();
		return user;
	}

	private Page<User> select(Message<List<User>> message, String action) throws Exception {

		return selectAll(message);
	}

	private Page<User> selectAll(Message<List<User>> message) throws Exception {
		User ur = message.getPayload().get(0);
		Pageable pageable = PageRequest.of(ur.getPageNumber() != null ? ur.getPageNumber() - 1 : 0,
				ur.getPageSize() != null ? ur.getPageSize() : 20, Sort.by("userId").descending());
		return userRepo.findAll(pageable);
	}

	private List<User> selectSingle(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		Optional<User> userOp = userRepo.findById(user.getUserId());
		if (userOp.isPresent()) {
			List<User> userList = new ArrayList<>();
			user = userOp.get();

			user.setDepartmentIdList(sharedGenericMapService.getToIdList(user.getUserId(), USER, USER_DEPARTMENT));
//            List<Address> addrList = addressService.select(user.getUserId(), AddrFor.USER);
			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private List<User> selectSingleWithRole(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		Optional<User> userOp = userRepo.findById(user.getUserId());
//		Optional<User> userOp = userRepo.findById(Long.valueOf(message.getHeader().getUserId()));
		if (userOp.isPresent()) {
			user = userOp.get();
			List<User> userList = new ArrayList<>();
			List<Role> roleList = roleService.selectUserRole(user);
			user.setRoleList(roleList);

			List<Role> unassignRoleList = roleService.selectUnassignRoleList(roleList);
			user.setUnassignRoleList(unassignRoleList);

			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private List<User> selectSingleWithRoleGroup(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		Optional<User> userOp = userRepo.findById(user.getUserId());
		if (userOp.isPresent()) {
			user = userOp.get();
			List<User> userList = new ArrayList<>();
			List<RoleGroup> roleList = roleGroupService.selectUserRoleGroup(user);
			user.setRoleGroupList(roleList);

			List<RoleGroup> unassignRoleList = roleGroupService.selectUnassignRoleGroupList(roleList);
			user.setUnassignRoleGroupList(unassignRoleList);

			userList.add(user);
			return userList;
		} else {
			return Collections.emptyList();
		}
	}

	private List<User> register(Message<List<User>> message, String action) throws Exception {
		User user = message.getPayload().get(0);
		User checkUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);

		if (checkUser == null) {
			// check ad login
			try {

				user = addNewUser(user, message.getHeader().getUserId());

				message.getPayload().add(user);

				sendRegisterMail(user);
				return message.getPayload();
			} catch (Exception ex) {
				throw new Exception("User not exits.");
			}

		} else {
			if (checkUser.getAllowLogin() != 1) {
				throw new Exception(
						"User already exist but not allowed to login. Please contact your administrator for activation.");
			} else {
				throw new Exception("User already exist.");
			}
		}
	}

	private User addNewUser(User user, Long userId) throws Exception {

		user.setVersion(0);
		user.setAllowLogin(0);
		user.setUserStatus(Str.INACTIVE);
		user.setModTime(new Date());
		user.setPassword(
				ldapLogin ? passwordEncoder.encode(defaultAdPass) : passwordEncoder.encode(user.getPassword()));
//                user.setPassword(isLdapSuccess ? user.getDefaultAdPass() : user.getPassword());
		log.info("Saving User [{}]", user.getLoginName());
		return userRepo.save(user);
	}

	private void sendRegisterMail(User user) {
		try {
			Runnable task = () -> {
				// send two mail from here.
				// one to newly registered user
				// another to admin user. pre-configured email address

				try {
					// mail to admin
					log.info("Sending user registration mail to admin [{}]", userRegistrationAdminMail);
//                    mailService.send(registerMailSubject, mailReplace(user, registerMailToAdminTemplate),
//                            userRegistrationAdminMail);
				} catch (Exception e) {
					log.error("Error Sending user registration mail to admin [{}]\n{}", userRegistrationAdminMail, e);
				}

				try {
					// mail to admin
					log.info("Sending user registration mail to user [{}]", user.getEmail());
//                    mailService.send(registerMailSubject, mailReplace(user, registerMailToUserTemplate),
//                            user.getEmail());
				} catch (Exception e) {
					log.error("Error Sending user registration mail to user [{}]\n{}", user.getEmail(), e);
				}
			};
			task.run();

			Thread thread = new Thread(task);
			thread.start();
		} catch (Exception e) {
			log.error("Error sending register mail \n{}", e);
		}
	}

	private String mailReplace(User user, String template) {
		return template.replace("#Username#", StringUtils.isBlank(user.getLoginName()) ? "" : user.getLoginName())
				.replace("#Branch#", StringUtils.isBlank(user.getBranchName()) ? "" : user.getBranchName())
				.replace("#Email#", StringUtils.isBlank(user.getEmail()) ? "" : user.getEmail())
				.replace("#FullName#", StringUtils.isBlank(user.getFullName()) ? "" : user.getFullName());
	}

	@Autowired
	SharedGenericMapService sharedGenericMapService;

	private Page<User> insert(Message<List<User>> message, String action) throws Exception {

		User user = message.getPayload().get(0);
		User checkUser = userRepo.findByLoginNameAndActive(user.getLoginName(), 1);
		if (checkUser == null) {
			if (!StringUtils.isBlank(user.getPhoneNumber())) {
				checkUser = userRepo.findByPhoneNumberAndActive(user.getPhoneNumber(), 1);
				if (checkUser != null) {
					throw new Exception("Duplicate mobile number not allowed.");
				}
			}

			checkUser = userRepo.findByEmailAndActive(user.getEmail(), 1);
			if (checkUser != null) {
				throw new Exception("Duplicate email not allowed.");
			}

			CF.fillInsert(user, message.getHeader().getUserId(), isAllowMakerChecker);
//            user.setCreatorId(message.getHeader().getUserId());
//            user.setModTime(new Date());
//            user.setUserModId(message.getHeader().getUserId());
//            user.setVersion(0);
//            if (userRepo.count() < 1) {
//                user.setAllowLogin(1);
//            }
//            //user.setPassword(defaultAdPass);
//            if(isAllowMakerChecker){
//                user.setUserStatus(Str.PEND_APPROVE);
//            }else {
//                user.setUserStatus(Str.APPROVED);
//            }
//            user = userRepo.save(user);
			user = addNewUser(user, message.getHeader().getUserId());

			// manage department with generic map

			List<Long> toIdList = user.getDepartmentIdList();

			sharedGenericMapService.unMapAndMap(user.getUserId(), toIdList, "USER", USER_DEPARTMENT,
					message.getHeader().getUserId());

//            message.getPayload().add(user);
		} else {
			throw new Exception("User already exist.");
		}
		return selectAll(message);
	}

	private List<User> approveRole(Message<List<User>> message, String actionType) {

		try {
			User user = message.getPayload().get(0);

			List<Role> roleList = user.getRoleList();

			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(user.getUserId(), USER,
					roleList.get(0).getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus("APPROVED");
				// map.setApproveById(user.getUserId());
				// map.setApproveTime(new Date());
				gm.save(map);
			}

			return selectSingleWithRole(message, ActionType.SELECT_SINGLE.toString());

		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}

	}

	private List<User> approveDeAssign(Message<List<User>> message, String actionType) {

		try {
			User user = message.getPayload().get(0);

			List<Role> roleList = user.getRoleList();

			GenericMap map = gm.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(user.getUserId(), USER,
					roleList.get(0).getRoleId(), ROLE, 1);
			if (map != null) {
				map.setStatus(null);
				map.setActive(0);
				gm.save(map);
			}

			return selectSingleWithRole(message, ActionType.SELECT_SINGLE.toString());

		} catch (Exception e) {
			e.printStackTrace();
			log.info("Error! [{}]", e);
			return null;
		}

	}

	public boolean isEmptyUser() {

		return userRepo.count() < 1;
	}

	public void saveInitialValue(User usr) {
		userRepo.save(usr);

	}

}
