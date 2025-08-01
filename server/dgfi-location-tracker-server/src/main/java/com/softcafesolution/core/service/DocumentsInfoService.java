package com.softcafesolution.core.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.DocumentsInfo;
import com.softcafesolution.core.entity.DocumentsInfo.DocType;
import com.softcafesolution.core.repo.DocumentsInfoRepo;
import com.softcafesolution.dgfi.utils.FileUtils;

@Service
public class DocumentsInfoService {
	private static final Logger log = LogManager.getLogger();
	
	@Autowired
	private DocumentsInfoRepo documentsInfoRepo;

	public DocumentsInfo saveDocument(Long loanId, String filePath, String docObject, String fileName, DocType docType) {
		DocumentsInfo dbDoc = documentsInfoRepo.findByDocRefIdAndActive(loanId, 1);
		if(dbDoc != null) {
			dbDoc.setActive(0);
			documentsInfoRepo.save(dbDoc);
		}
		DocumentsInfo df = new DocumentsInfo(loanId, docType, docObject, fileName, filePath);
		return documentsInfoRepo.save(df);
		
	}

	public Map<String, String> findFile(Long crimeId) {
		DocumentsInfo df = documentsInfoRepo.findByDocRefIdAndActive(crimeId, 1);
		Map<String, String> res = new HashMap<>();
		if(df == null || StringUtils.isBlank(df.getFilePath())) {
			return res;
		}
		try {
			res.put("imageName", df.getFileName());
			res.put("imageSrc", FileUtils.convertFile2Base64(df.getFilePath()));
			return res;

		} catch (Exception e) {
			log.error("getting error to convert file to string. document id={}", df.getDocumentsId());
			return res;
		}
		
	}
	
	

}

