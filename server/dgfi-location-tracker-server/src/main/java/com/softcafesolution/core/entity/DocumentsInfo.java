package com.softcafesolution.core.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="T_DOCUMENTS_INFO")
public class DocumentsInfo {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="ID_DOCUMENTS_KEY")
	private Long documentsId;
	
	/**
	 * this key refer to address referance. like student, user, loan
	 */
	@Column(name = "lng_doc_ref_key", nullable = false)
	private Long docRefId;
	
	@Column(name = "lng_active", nullable = false)
	private Integer active = 1;
	/**
	 * doc type. loan user image, guarantor image, 
	 */
	@Column(name = "tx_doc_type", length = 64, nullable = false)
	@Enumerated(EnumType.STRING)
	private DocType docType;
	
	@Column(name = "tx_doc_object", length = 64, nullable = false)
	private String docObject;

	@Column(name = "tx_file_name", length = 132, nullable = false)
	private String fileName;

	@Column(name = "tx_file_path", length = 256)
	private String filePath;
	
	@Column(name = "dt_doc_upload_date", nullable = false, updatable = false)
	private Date docUploadDate = new Date();

	public DocumentsInfo() {
	}
	
	public DocumentsInfo(Long docRefId, DocType docType, String docObject, String fileName, String filePath) {
		this.docRefId = docRefId;
		this.docType = docType;
		this.docObject = docObject;
		this.fileName = fileName;
		this.filePath = filePath;
	}

	public Long getDocumentsId() {
		return documentsId;
	}

	public void setDocumentsId(Long documentsId) {
		this.documentsId = documentsId;
	}

	public Long getDocRefId() {
		return docRefId;
	}

	public void setDocRefId(Long docRefId) {
		this.docRefId = docRefId;
	}
	
	
	public DocType getDocType() {
		return docType;
	}

	public void setDocType(DocType docType) {
		this.docType = docType;
	}

	public String getDocObject() {
		return docObject;
	}

	public void setDocObject(String docObject) {
		this.docObject = docObject;
	}

	public Date getDocUploadDate() {
		return docUploadDate;
	}

	public void setDocUploadDate(Date docUploadDate) {
		this.docUploadDate = docUploadDate;
	}
	
	



	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}




	public Integer getActive() {
		return active;
	}

	public void setActive(Integer active) {
		this.active = active;
	}





	public static enum DocType{
		IMAGE, DOCUMENTS
	}

}
