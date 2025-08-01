package com.softcafesolution.core.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

import com.softcafesolution.core.entity.Address;

public interface AddressRepo extends CrudRepository<Address, Long>, JpaSpecificationExecutor<Address>{
	
	List<Address> findByAddrRefIdAndAddrForAndActive(Long refId, String addFor, int active);
}
