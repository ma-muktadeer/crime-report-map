package com.softcafesolution.dgfi.utils;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

public class FileUtils {

	public static String saveFile2Dir(MultipartFile file, String basePath) throws Exception {
		mkdir(basePath);
		String fileName = file.getOriginalFilename();

		fileName = UUID.randomUUID().toString().replaceAll("-", "") + fileName.substring(fileName.lastIndexOf("."));

		String destPath = basePath + File.separator + fileName;
		File destFile = new File(destPath);
		file.transferTo(destFile);

		return destPath;
	}

	public static String convertFile2Base64(String filePath) throws IOException {
		byte[] fileContent = readFileToByteArrayNIO(filePath);
		return getFileType(filePath) + Base64.getEncoder().encodeToString(fileContent);
	}
	
	private static byte[] readFileToByteArrayNIO(String filePath) throws IOException {
        Path path = Paths.get(filePath);        
        return Files.readAllBytes(path);
    }
	
	private static String getFileType(String filePath) {
		return "data:image/" + filePath.substring(filePath.lastIndexOf(".") + 1) + ";base64,";
	}

	public static String createFile(String filePath, String fileExtension) {
		UUID uuid = UUID.randomUUID();
		if (StringUtils.isBlank(filePath)) {
			throw new RuntimeException("file path is empty.");
		}
		mkdir(filePath);
		if (StringUtils.isBlank(fileExtension)) {
			throw new RuntimeException("file Extension is empty.");
		}
		if (!fileExtension.startsWith(".")) {
			fileExtension = "." + fileExtension;
		}
		filePath = filePath + File.separator + uuid.toString() + fileExtension;

		return filePath;
	}

	private static void mkdir(String filePath) {
		if (!StringUtils.isBlank(filePath)) {
			File file = new File(filePath);
			if (!file.exists()) {
				boolean mkdirs = file.mkdirs();
			}
		}
	}

	public static String getFileExtension(String filePath) {
		if (filePath.endsWith(".pdf")) {
			return "pdf";
		} else if (filePath.endsWith(".xlsx")) {
			return "xlsx";
		} else if (filePath.endsWith(".csv")) {
			return "csv";
		}
		return "application/octet-stream";
	}

	public static String getContentType(String extension) {
		return switch (extension.toLowerCase()) {
		case "pdf" -> MediaType.APPLICATION_PDF_VALUE;
		case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // For Excel
		case "csv" -> "text/csv"; // For CSV
		default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
		};
	}
}
