package com.softcafesolution.core.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name="T_CHAT_MESSAGE")
public class ChatMessage extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SEQ_CHAT_MESSAGE") //for oracle
    @SequenceGenerator(sequenceName = "SEQ_CHAT_MESSAGE", allocationSize = 1, name = "SEQ_CHAT_MESSAGE") //for oracle
	
	@Column(name = "id_message_key")
	private Long messageId;
	
	@Column(name = "int_chat_type")
	private int chatType; // 0=one to one, 1 group
	@Column(name = "tx_message")
	private String message;
	@Column(name = "tx_msg_type")
	private String msgType;
	@Column(name = "id_sender_key")
	private Long senderId;
	@Column(name = "id_receiver_key")
	private String receiverId;
	@Column(name = "dtt_sent_time")
	private Date sentTime = new Date();
	@Column(name = "dtt_seen_time")
	private Date seenTime;
	@Column(name = "dtt_delevery_time")
	private Date deleveryTime;
	@Column(name = "int_seen")
	private int seen;
	@Column(name = "int_sent")
	private int sent;
	@Column(name = "int_delevered")
	private int delevered;
	@Column(name = "int_group_msg")
	private int groupMsg;
	@Column(name = "id_chat_group_key")
	private Integer chatGroupId;
	@Column(name = "tx_subscribe_url")
	private String subscribeUrl;
	
	
	public Long getMessageId() {
		return messageId;
	}
	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}
	
	public int getChatType() {
		return chatType;
	}
	public void setChatType(int chatType) {
		this.chatType = chatType;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public Long getSenderId() {
		return senderId;
	}
	public void setSenderId(Long senderId) {
		this.senderId = senderId;
	}
	public String getReceiverId() {
		return receiverId;
	}
	public void setReceiverId(String receiverId) {
		this.receiverId = receiverId;
	}
	public Date getSentTime() {
		return sentTime;
	}
	public void setSentTime(Date sentTime) {
		this.sentTime = sentTime;
	}
	public Date getSeenTime() {
		return seenTime;
	}
	public void setSeenTime(Date seenTime) {
		this.seenTime = seenTime;
	}
	public Date getDeleveryTime() {
		return deleveryTime;
	}
	public void setDeleveryTime(Date deleveryTime) {
		this.deleveryTime = deleveryTime;
	}
	public int getSeen() {
		return seen;
	}
	public void setSeen(int seen) {
		this.seen = seen;
	}
	public int getSent() {
		return sent;
	}
	public void setSent(int sent) {
		this.sent = sent;
	}
	public int getDelevered() {
		return delevered;
	}
	public void setDelevered(int delevered) {
		this.delevered = delevered;
	}
	public int getGroupMsg() {
		return groupMsg;
	}
	public void setGroupMsg(int groupMsg) {
		this.groupMsg = groupMsg;
	}
	public Integer getChatGroupId() {
		return chatGroupId;
	}
	public void setChatGroupId(Integer chatGroupId) {
		this.chatGroupId = chatGroupId;
	}
	public String getSubscribeUrl() {
		return subscribeUrl;
	}
	public void setSubscribeUrl(String subscribeUrl) {
		this.subscribeUrl = subscribeUrl;
	}
	
	
	
	
	
	
	

}
