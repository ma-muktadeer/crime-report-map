package com.softcafesolution.dgfi.controller;

import org.springframework.beans.factory.annotation.Autowired;

import com.softcafesolution.core.messaging.ProcessorService;
import com.softcafesolution.core.messaging.ServiceCoordinator;
import com.softcafesolution.core.service.AppPermissionService;
import com.softcafesolution.core.service.UserService;

public class AbstractController {
	protected static final String VIA = "VIA";
	@Autowired
	protected ProcessorService processorService;

	@Autowired
	protected ServiceCoordinator serviceCoordinator;
	
	@Autowired
	protected UserService userService;
	
	
	@Autowired
	protected AppPermissionService appPermissionService;
	
	

}
