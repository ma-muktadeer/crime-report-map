package com.softcafesolution.dgfi.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class SecurityUtils {
    private static final Logger log = LogManager.getLogger();

    public static String generateDeviceFingerprint(HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");
        String acceptLanguage = request.getHeader("Accept-Language");
        String referer = request.getHeader("Referer");

        String rawFingerprint = ipAddress + ":" + userAgent + ":" + acceptLanguage + ":" + referer;

        return hashFingerPrint(rawFingerprint);
    }

    private static String hashFingerPrint(String rawFingerprint) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return Base64.getEncoder().encodeToString(digest.digest(rawFingerprint.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            log.error("Error while hashing fingerprint: {}", e.getMessage());
            return rawFingerprint;
        }
    }
}
