package com.softcafesolution.dgfi.controller;

import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.softcafesolution.core.entity.AppPermission;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.GenericMessage;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.MessagingConstants;
import com.softcafesolution.core.service.SecurityService;
import com.softcafesolution.dgfi.model.LoginRes;
import com.softcafesolution.dgfi.security.JwtService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/public/api/v1")
public class PublicController extends AbstractController {
	private static final Logger log = LogManager.getLogger();
	
	@Autowired
	protected JwtService jwtService;

	@PostMapping(value = "/login", produces="application/json")
	public LoginRes login(@RequestBody String json, HttpServletRequest req) {

		log.trace("UI request \n{}", json);

		Message<?> requestMessage = null;
		try {
			requestMessage = processorService.fromJson(json);
			requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
			requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
			String actionType = requestMessage.getHeader().getActionType();

			if (actionType.equals(ActionType.ACTION_LOGIN.toString())) {
				return handleLogin(requestMessage);
			}
			
		} catch (Exception e) {
			log.error("Exception processing message [{}]", e);
		}
		return new LoginRes();
	}

	
	@PostMapping(value = "/jsonRequest", produces="application/json")
	public Message<?> handleJsonRequest(@Validated @RequestBody String json, HttpServletRequest req) {

		log.trace("UI request \n{}", json);

		Message<?> requestMessage = null;
		Message<?> processedMessage = null;
		try {		
			requestMessage = processorService.fromJson(json);
			requestMessage.getHeader().setSenderSourceIPAddress(req.getRemoteAddr());
			requestMessage.getHeader().setSenderGatewayIPAddress(req.getHeader(VIA));
			processedMessage = serviceCoordinator.service(requestMessage);
		} catch (Exception e) {
			 log.error("Exception processing message [{}]", e);
		}
		return processedMessage;
	}
	
	@GetMapping(value = "/map/permission/role")
	public AppPermission permissionRole(@RequestParam("permissionId") long permissionId, @RequestParam("roleId") long roleId) {

		return appPermissionService.mapRoleToPermission(permissionId, roleId, 100000);
	}
	
	@GetMapping(value = "/map/permission/roles")
	public AppPermission permissionRoleS(@RequestParam("permissionId") long permissionId, @RequestParam("roleId") String roleId) {

		return appPermissionService.mapRoleToPermission(permissionId, roleId, 100000);
	}
	
	@GetMapping(value = "/map/permission/role/by/name")
	public AppPermission permissionRoleByName(@RequestParam("permissionName") String permissionName, @RequestParam("roleName") String roleName) {

		return appPermissionService.mapRoleToPermission(permissionName, roleName, 100000);
	}

	@SuppressWarnings("unchecked")
	private LoginRes handleLogin(Message<?> requestMessage) throws Exception {
		LoginRes login = new LoginRes();
		Message<?> res = userService.serviceSingle(requestMessage);
		log.info("Login");
		
		
		if(!res.getHeader().getStatus().equals(MessagingConstants.STATUS_OK)) {
			AbstractMessageHeader header  = res.getHeader();
			GenericMessage<?> m = new GenericMessage<>();
			header.setStatus(MessagingConstants.STATUS_ERROR);
			m.setHeader(header);
			login.setRes(m);
			return login;
		}
		login.setRes(res);
		
		List<User> u = (List<User>) res.getPayload();

		if (u == null || u.size() == 0) {
			return login;
		}
		
		User user = u.get(0);

		long iss = System.currentTimeMillis();

		Date issuedAt = new Date(iss);
		Date expAt = new Date(iss + SecurityService.tokenExpSec);
		
		String token = jwtService.createToken(user.getLoginName(), issuedAt, expAt, user.getRoleList());

		login.setToken(token);
		login.setExpireAt(expAt);
		login.setIssuedAt(issuedAt);
		login.setAuthenticated(true);

		login.setRes(res);
		return login;
	}

	@PostMapping("register")
	public void register(@RequestBody User u) {

	}
	
	@GetMapping("/ping")
	public String getMethodName(HttpServletRequest r) {
		log.info("Got public ping from [{}]:[{}]", r.getRemoteAddr(), r.getRemotePort());
		return "Hello" + r.getRemoteAddr();
	}
	

}
