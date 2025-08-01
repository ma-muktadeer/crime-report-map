package com.softcafesolution.dgfi.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

import com.softcafesolution.core.entity.AppPermission;
import com.softcafesolution.core.entity.Customer;
import com.softcafesolution.core.entity.Role;
import com.softcafesolution.core.entity.SConfiguration;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.messaging.CoreService;
import com.softcafesolution.core.messaging.ProcessorService;
import com.softcafesolution.core.messaging.ServiceCoordinator;
import com.softcafesolution.core.messaging.ServiceMap;
import com.softcafesolution.core.service.AppPermissionService;
import com.softcafesolution.core.service.RoleService;
import com.softcafesolution.core.service.SConfigurationService;
import com.softcafesolution.core.service.UserService;
import com.softcafesolution.dgfi.entity.CrimeChart;
import com.softcafesolution.dgfi.entity.Finincial;
import com.softcafesolution.dgfi.model.VwCrimeInfo;
import com.softcafesolution.dgfi.model.VwFinancialInfo;
import com.softcafesolution.dgfi.service.CrimeChartService;
import com.softcafesolution.dgfi.service.FinincialService;
import com.softcafesolution.dgfi.service.VwCrimeInfoService;

@Configuration
@ImportResource("classpath:servlet-context.xml")
public class AppConfig {
	
	@Autowired
	UserService userService;
	@Autowired
	private AppPermissionService appPermissionService;
	@Autowired
	private RoleService roleService;	
	
	@Autowired
	private CrimeChartService crimeChartService;
	
	@Autowired
	private VwCrimeInfoService crimeInfoService;
	
	@Autowired
	private SConfigurationService config;
	
	@Autowired
	private FinincialService finincialService;
	
	@Bean
	ServiceCoordinator ServiceCoordinator() {
		ServiceCoordinator sc = new ServiceCoordinator();
		sc.setServiceMap(serviceMap());

		return sc;
	}

	@Bean
	ServiceMap serviceMap() {
		ServiceMap serviceMap = new ServiceMap();
		Map<String, CoreService<?>> map = new LinkedHashMap<>();
		map.put(UserService.class.getSimpleName(), userService);
		map.put(AppPermissionService.class.getSimpleName(), appPermissionService);
		map.put(RoleService.class.getSimpleName(), roleService);
		map.put(CrimeChartService.class.getSimpleName(), crimeChartService);
		map.put(VwCrimeInfoService.class.getSimpleName(), crimeInfoService);
		map.put(SConfigurationService.class.getSimpleName(), config);
		map.put(FinincialService.class.getSimpleName(), finincialService);
		
		
		serviceMap.setServiceMap(map);
		return serviceMap;
	}

	@Bean
	ProcessorService processorService() {
		ProcessorService processorService = new ProcessorService();

		Map<String, String> classMap = new LinkedHashMap<>();

		mapClass(classMap, User.class);
		mapClass(classMap, AppPermission.class);
		mapClass(classMap, Role.class);
		mapClass(classMap, Customer.class);
		mapClass(classMap, CrimeChart.class);
		mapClass(classMap, VwCrimeInfo.class);
		mapClass(classMap, SConfiguration.class);
		mapClass(classMap, Finincial.class);
		mapClass(classMap, VwFinancialInfo.class);
		
        processorService.setClassMap(classMap);
		return processorService;
	}

	private void mapClass(Map<String, String> classMap, Class<?> clazz) {
		classMap.put(clazz.getSimpleName(), clazz.getName());
	}
	
	
}
