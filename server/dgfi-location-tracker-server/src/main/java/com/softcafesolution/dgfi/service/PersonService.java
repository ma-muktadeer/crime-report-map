package com.softcafesolution.dgfi.service;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.dgfi.entity.Person;
import com.softcafesolution.dgfi.repo.PersonRepo;

@Service
public class PersonService {
	private final static Logger log = LoggerFactory.getLogger(PersonService.class);
	
	@Autowired
	private PersonRepo personRepo;

	public void savePersons(List<Person> persons, Long crimeId) {
		log.info("try to save person for crimeId={}", crimeId);
		if(persons == null || persons.isEmpty()) {
			return;
		}
		
		for (Person person : persons) {
			if(StringUtils.isBlank(person.getName())) {
				continue;
			}
			person.setCrimeId(crimeId);
			personRepo.save(person);
		}
		
	}
	
	public void updatePersons(List<Person> newPersons, Long crimeId) {
		
	    List<Person> existingPersons = personRepo.findByCrimeId(crimeId);

	    existingPersons.stream()
	        .filter(existing -> newPersons.stream()
	            .noneMatch(newPerson -> newPerson.getPersonId() != null 
	                && newPerson.getPersonId().equals(existing.getPersonId())))
	        .forEach(personRepo::delete);

	    newPersons.forEach(person -> {
	        person.setCrimeId(crimeId);
	        personRepo.save(person);
	    });
	}

}
