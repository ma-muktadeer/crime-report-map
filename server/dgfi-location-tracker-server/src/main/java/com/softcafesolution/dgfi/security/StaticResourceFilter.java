package com.softcafesolution.dgfi.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class StaticResourceFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        String requestURI = ((HttpServletRequest) request).getRequestURI();

        if (requestURI.endsWith(".pbf") && requestURI.contains("/assets/tiles/")) {
            httpResponse.setHeader("Content-Type", "application/x-protobuf");
            httpResponse.setHeader("Content-Encoding", "gzip");
            httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        }

        chain.doFilter(request, response);
    }
}
