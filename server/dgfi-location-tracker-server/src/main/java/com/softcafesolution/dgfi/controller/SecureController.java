package com.softcafesolution.dgfi.controller;

import java.security.Principal;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.dgfi.entity.CrimeChart;
import com.softcafesolution.dgfi.service.CrimeChartService;

import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping(value="/secure/api/v1")//secure/api/v1/
@CrossOrigin(allowCredentials = "true", originPatterns = "*")
public class SecureController extends AbstractController {
	private static final Logger log = LogManager.getLogger();
	
	@Autowired
	private CrimeChartService crimeChartService;
	
	@PostMapping(value = "/jsonRequest", produces="application/json")
	public Message<?> handleJsonRequest(@Validated @RequestBody String json, HttpServletRequest req, Principal pricipal) {

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
	
	@PostMapping(value = "/admin/jsonRequest", produces="application/json")
	public Message<?> adminReq(@RequestBody String json, HttpServletRequest req, Principal pricipal) {
		return handleJsonRequest(json, req, pricipal);
	}
	
	@GetMapping("/ping")
	public String getMethodName(HttpServletRequest r) {
		log.info("Got secure ping from [{}]:[{}]", r.getRemoteAddr(), r.getRemotePort());
		return "Hello" + r.getRemoteAddr();
	}
	
//	http://127.0.0.1:8080/secure/api/v1/save-criminal
	@PostMapping(value = "/save-criminal", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> handleLoanUpload(@ModelAttribute("criminalData" ) CrimeChart criminalData, 
			HttpServletRequest req) throws NumberFormatException, Exception {
		
		try {
	        Long userId = Long.parseLong(req.getHeader("UserId"));
	        return crimeChartService.saveCriminal(criminalData, userId);
	    } catch (Exception e) {
	        log.error("Error saving criminal data", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Something went wrong: " + e.getMessage());
	    }
	}

}
