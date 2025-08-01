//package com.softcafesolution.mdm;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.core.annotation.Order;
//
//import com.softcafesolution.mdm.entity.Policy;
//import com.softcafesolution.mdm.repo.PolicyRepo;
//
//@SpringBootTest
//class SoftcafeMdmServerApplicationTests {
//
//	
//	@Autowired
//	PolicyRepo policyRepo;
//	
//	@Test
//	void contextLoads() {
//	}
//	
//	@Test
//	@Order(1)
//	void savePolicy() {
//		Policy p = new Policy();
//		p.setPolicyName("App");
//		p.setPolicyGroup("group");
//		
//		p = policyRepo.save(p);
//		
//		assertEquals(p.getPolicyId().longValue(), 1);
//		
//	}
//
//	
//}
