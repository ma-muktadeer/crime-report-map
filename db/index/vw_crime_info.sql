-- Create non-clustered indexes on t_crime join columns
CREATE NONCLUSTERED INDEX IX_Crime_DivisionKey ON t_crime (id_division_key);
GO

CREATE NONCLUSTERED INDEX IX_Crime_DistrictKey ON t_crime (id_district_key);
GO

CREATE NONCLUSTERED INDEX IX_Crime_UpazilaKey ON t_crime (id_upazila_key);
GO

CREATE NONCLUSTERED INDEX IX_Crime_CrimeTypeKey ON t_crime (id_type_of_crime_key);
GO

-- Create non-clustered index on T_LOCATION join column
CREATE NONCLUSTERED INDEX IX_Location_LocationKey ON T_LOCATION (id_location_key);
GO

-- Create non-clustered index on t_configuration join column
CREATE NONCLUSTERED INDEX IX_Configuration_ConfigKey ON t_configuration (id_config_key);
GO

-- If you had the t_person joins in your original query, these indexes would be beneficial:
-- CREATE NONCLUSTERED INDEX IX_Person_CrimeKey_PersonType ON t_person (id_crime_key, tx_person_type) INCLUDE (tx_name, tx_introduction, tx_political_party_name);
-- GO
-- CREATE NONCLUSTERED INDEX IX_Person_Guest ON t_person (id_crime_key) WHERE tx_person_type = 'guest' INCLUDE (tx_name, tx_introduction);
-- GO

-- File: update_statistics.sql

-- Update statistics on the involved tables
UPDATE STATISTICS t_crime WITH FULLSCAN;
GO

UPDATE STATISTICS T_LOCATION WITH SAMPLE 50 PERCENT;
GO

UPDATE STATISTICS t_configuration WITH RESAMPLE;
GO