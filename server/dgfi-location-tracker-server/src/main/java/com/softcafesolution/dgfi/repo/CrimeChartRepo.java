package com.softcafesolution.dgfi.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.softcafesolution.dgfi.entity.CrimeChart;
import com.softcafesolution.dgfi.model.PernamentSeat;



public interface CrimeChartRepo extends JpaRepository <CrimeChart, Long>{


}
