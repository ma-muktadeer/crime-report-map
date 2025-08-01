package com.softcafesolution.dgfi.model;

import com.softcafesolution.dgfi.utils.FileExportType;

public class FileExportRequest {

    private String viewName;
    private FileExportType fileExportType;
    private String fromDate;
    private String toDate;
    private String cbsTransactionId;
    private String cbsCreditAccount;
    private String cbsTxnStatus;
    private String fundSourceTxnId;
    private String fundTargetTxnId;
    private String transactionType;

    public String getViewName() {
        return viewName;
    }

    public void setViewName(String viewName) {
        this.viewName = viewName;
    }

    public FileExportType getFileExportType() {
        return fileExportType;
    }

    public void setFileExportType(FileExportType fileExportType) {
        this.fileExportType = fileExportType;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getCbsTransactionId() {
        return cbsTransactionId;
    }

    public void setCbsTransactionId(String cbsTransactionId) {
        this.cbsTransactionId = cbsTransactionId;
    }

    public String getCbsCreditAccount() {
        return cbsCreditAccount;
    }

    public void setCbsCreditAccount(String cbsCreditAccount) {
        this.cbsCreditAccount = cbsCreditAccount;
    }

    public String getCbsTxnStatus() {
        return cbsTxnStatus;
    }

    public void setCbsTxnStatus(String cbsTxnStatus) {
        this.cbsTxnStatus = cbsTxnStatus;
    }

    public String getFundSourceTxnId() {
        return fundSourceTxnId;
    }

    public void setFundSourceTxnId(String fundSourceTxnId) {
        this.fundSourceTxnId = fundSourceTxnId;
    }

    public String getFundTargetTxnId() {
        return fundTargetTxnId;
    }

    public void setFundTargetTxnId(String fundTargetTxnId) {
        this.fundTargetTxnId = fundTargetTxnId;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
}
