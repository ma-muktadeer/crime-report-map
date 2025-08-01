package com.softcafesolution.core.utils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.softcafesolution.core.entity.Address;
import com.softcafesolution.core.entity.User;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.Message;

public final class AppUtils {
	public static Long userModId(Message<List<User>> message){
		return userModId(message.getHeader());
	}
	
	public static Long userModId(AbstractMessageHeader header){
		return header.getUserId();
	}
	
	public static <T> List<T> toList(final Iterable<T> iterable) {
	    return StreamSupport.stream(iterable.spliterator(), false)
	                        .collect(Collectors.toList());
	}
	
	/**
	 * In the address list of any object, this method return one object by type.
	 * <br>
	 * like : present address, permanent address
	 * @param addList
	 * @param type
	 * @return
	 */
	public static Address addrByType(List<Address> addList, String type) {
		if(null == addList) return null;
	   Optional<Address> address =  addList.parallelStream().filter( addr -> type.equals(addr.getAddrType())).findFirst();
	   if(address.isPresent()) {
		   return address.get();
	   }
	   else{
		   return null;
	   }
	}
}
