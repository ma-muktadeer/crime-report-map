package com.softcafesolution.core.service;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.GenericMap;
import com.softcafesolution.core.repo.GenericMapRepo;

@Service
public class SharedGenericMapService {
	private static final Logger log = LogManager.getLogger(SharedGenericMapService.class);
	@Autowired
	GenericMapRepo genericMapRepo;

	/**
	 * 
	 * @param fromId
	 * @param fromTypeName
	 * @param toName
	 * @param userId
	 */
	public void unmapAllByFrom(long fromId, String fromTypeName, String toName, long userId) {
		log.info("Unmapping all [{}]:[{}]", fromId, fromTypeName);
		genericMapRepo.unmapAllByFrom(fromId, fromTypeName, toName, userId, new Date());
	}
	

	/**
	 * 
	 * @param toId
	 * @param toType
	 * @param fromName
	 * @param userId
	 */
	public void unmapAllByTo(long toId, String toType, String fromName, long userId) {
		log.info("Unmapping all by to [{}]:[{}]", toId, toType, fromName);
		genericMapRepo.unmapAllByTo(toId, toType, fromName, userId, new Date());
	}
	
	public void unMapOne(long fromId, String fromTypeName, long toId, String toTypeName, long userId) {
		log.info("Unmapping one [{}]:[{}]:[{}]:[{}]", fromId, fromTypeName, toId, toTypeName );
		
		GenericMap gen = genericMapRepo.findByFromIdAndFromTypeNameAndToIdAndToTypeNameAndActive(fromId, fromTypeName, toId, toTypeName, 1);
		if(gen == null) {
			return;
		}
		gen.setModTime(new Date());
		gen.setUserModId(userId);
		
		gen.setActive(0);
		genericMapRepo.save(gen);
	}

	public void mapNew(long fromId, List<Long> toIdList, String fromTypeName, String toTypeName, long userId) {
		if(toIdList == null) {
			return;
		}
		toIdList = toIdList.stream().filter( i -> i != null).collect(Collectors.toList());
		for (long toId : toIdList) {
			mapNew(fromId, toId, fromTypeName, toTypeName, userId);
		}
	}
	
	public Set<Long> getToIdSet(long fromId, String fromName, String toName){
		List<GenericMap> list = genericMapRepo.findByFromIdAndFromTypeNameAndToTypeNameAndActive(fromId, fromName, toName, 1);
		return list.stream().map( i -> i.getToId()).collect(Collectors.toSet());
	}
	
	/**
	 * 
	 * @param fromId
	 * @param fromName
	 * @param toName
	 * @return
	 */
	public List<Long> getToIdList(long fromId, String fromName, String toName){
		List<GenericMap> list = genericMapRepo.findByFromIdAndFromTypeNameAndToTypeNameAndActive(fromId, fromName, toName, 1);
		return list.stream().map( i -> i.getToId()).collect(Collectors.toList());
	}

	public void mapNew(long fromId, long toId, String fromTypeName, String toTypeName, long userId) {
		GenericMap db = genericMapRepo.findByFromIdAndFromTypeNameAndToIdAndToTypeName(fromId, fromTypeName,
				toId, toTypeName);

		if (db == null) {
			db = buildGenericMap(fromId, fromTypeName, toId, toTypeName, userId);
		} else {
			db.setActive(1);
			db.setModTime(new Date());
			db.setUserModId(userId);
		}
		genericMapRepo.save(db);
	}

	/**
	 * @param fromId
	 * @param toIdList
	 * @param fromTypeName
	 * @param toTypeName
	 * @param userId
	 */
	public void unMapAndMap(long fromId, List<Long> toIdList, String fromTypeName, String toTypeName, long userId) {
		unmapAllByFrom(fromId, fromTypeName, toTypeName, userId);

		mapNew(fromId, toIdList, fromTypeName, toTypeName, userId);

	}

	public GenericMap buildGenericMap(long fromId, String fromTypeName, long toId, String toTypeName, long userId) {
		GenericMap g = new GenericMap();
		g.setFromId(fromId);
		g.setFromTypeName(fromTypeName);
		g.setToId(toId);
		g.setToTypeName(toTypeName);
		g.setActive(1);
		g.setEntryTime(new Date());
		g.setModTime(new Date());
		g.setCreatorId(userId);
		g.setUserModId(userId);
		g.setVersion(0);
		return g;
	}

}
