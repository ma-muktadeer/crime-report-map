package com.softcafesolution.core.repo;

import java.util.Date;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import com.softcafesolution.core.entity.User;

import jakarta.transaction.Transactional;


@Transactional
public interface UserRepo extends JpaRepository<User, Long>, JpaSpecificationExecutor<User>, QueryByExampleExecutor<User>{
	User findByUserIdAndActive(Long userId, Integer active);
	User findByLoginNameAndEmailAndActive(String loginName, String email, Integer active);
	User findByLoginNameAndActive(String loginName, Integer active);
	User findByPhoneNumberAndActive(String phoneNumber, Integer active);
	User findByEmailAndActive(String email, Integer active);
	User findByLoginNameAndEmailAndVerificationCodeAndActive(String loginName, String email, String verificationCode, Integer active);
	User findByLoginNameAndPasswordAndVerificationCodeAndActive(String loginName, String email, String verificationCode, Integer active);
	@Transactional
	@Modifying
	@Query(value="UPDATE User U "
			+ "SET U.allowLogin= :allowLogin"
			+ ", U.version = U.version+1 "
			+ ", U.userModId = :userModId "
			+ ", U.modTime = :modTime "
			+ "WHERE U.userId = :userId")
	void toggleActivation(@Param("allowLogin") Integer allowLogin, @Param("userId") Long userId, @Param("userModId") Long userModId, @Param("modTime") Date modTime);
	
	
	@Query(value="select u "
			+ " from User u "
			+ " where u.loginName = :loginName"
			+ " and u.password = :password "
			+ " and u.active =1")
	User login(@Param("loginName")  String loginName, @Param("password")  String password);
	
	@Transactional
	@Modifying
	@Query(value="UPDATE User U "
			+ "SET U.twoFactorAuth= :twoFactorAuth"
			+ ", U.version = U.version+1 "
			+ ", U.userModId = :userModId "
			+ ", U.modTime = :modTime "
			+ "WHERE U.userId = :userId")
	void toggle2Fa(@Param("twoFactorAuth") Integer twoFactorAuth, @Param("userId") Long userId, @Param("userModId") Long userModId, @Param("modTime") Date modTime);
	
	
	@Transactional
	@Modifying
	@Query(value="UPDATE User U "
			+ "SET U.active= 0"
			+ ", U.version = U.version+1 "
			+ ", U.userModId = :userModId "
			+ ", U.modTime = :modTime "
			+ "WHERE U.userId = :userId")
	void delete(@Param("userId") Long userId, @Param("userModId") Long userModId, @Param("modTime") Date modDate);


	@Query(value="SELECT  U FROM User U where U.active = 1")
	Page<User> findAll(Pageable pageable);
	
	@Query("SELECT T FROM User T WHERE T.userId in :userIdList and active = 1")
	List<User> findByUserIds(@Param("userIdList")Set<Long> userIdList);
	
	@Query("SELECT T FROM User T WHERE T.userId not in :userIdList and active = 1")
	List<User> findByNotUserIds(@Param("userIdList") Set<Long> userIdList);

    Page<User> findAllByActive(int i, Pageable pageable);
}