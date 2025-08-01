package com.softcafesolution.core.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafesolution.core.entity.ChatMessage;

public interface ChatMessageRepo extends JpaRepository<ChatMessage, Long>{
	
}
