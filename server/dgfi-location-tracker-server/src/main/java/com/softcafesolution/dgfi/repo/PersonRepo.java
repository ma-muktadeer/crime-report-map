package com.softcafesolution.dgfi.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafesolution.dgfi.entity.Person;

public interface PersonRepo extends JpaRepository<Person, Long>{

	List<Person> findByCrimeId(Long crimeId);

}
