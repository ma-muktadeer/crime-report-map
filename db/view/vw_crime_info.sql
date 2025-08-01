-- Drop existing view if exists
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_crime_info')
BEGIN
    DROP VIEW vw_crime_info;
    PRINT 'Existing view vw_crime_info dropped.';
END
GO

-- Create optimized view
CREATE VIEW vw_crime_info AS
WITH person_agg AS (
    SELECT
        p.id_crime_key,
        p.tx_person_type,
        STUFF((
            SELECT ', ' + px.tx_name +
                   CASE
                       WHEN px.tx_introduction IS NOT NULL AND px.tx_introduction != ''
                       THEN ' (' + px.tx_introduction + ')'
                       ELSE ''
                   END
            FROM t_person px
            WHERE px.id_crime_key = p.id_crime_key
              AND px.tx_person_type = p.tx_person_type
              AND px.tx_name IS NOT NULL
              AND px.tx_name != ''
              AND px.tx_name NOT LIKE '%[0-9]%'
            FOR XML PATH(''), TYPE
        ).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS person_details
    FROM t_person p
    WHERE p.tx_name IS NOT NULL
    GROUP BY p.id_crime_key, p.tx_person_type
),
person_pivot AS (
    SELECT
        id_crime_key,
        MAX(CASE WHEN tx_person_type = 'victim' THEN person_details END) AS tx_victim_details,
        MAX(CASE WHEN tx_person_type = 'criminal' THEN person_details END) AS tx_criminal_details,
        MAX(CASE WHEN tx_person_type = 'guest' THEN person_details END) AS tx_guest_details,
        MAX(CASE WHEN tx_person_type = 'defendant' THEN person_details END) AS tx_defendant_details,
        MAX(CASE WHEN tx_person_type = 'plaintiff' THEN person_details END) AS tx_plaintiff_details,
        MAX(CASE WHEN tx_person_type = 'sponsor' THEN person_details END) AS tx_sponsor_details
    FROM person_agg
    GROUP BY id_crime_key
)

SELECT
    div.tx_loc_name_bn AS tx_division_name,
    div.dec_latitude AS div_latitude,
    div.dec_longitude AS div_longitude,
    dis.tx_loc_name_bn AS tx_district_name,
    dis.dec_latitude AS dis_latitude,
    dis.dec_longitude AS dis_longitude,
    upz.tx_loc_name_bn AS tx_upazila,
    con.tx_value1 AS tx_crime_type,
    par.tx_loc_name_bn AS tx_parliamentary_seat_name,

    CASE
        WHEN c.id_political_party_key != 0 THEN pnt.tx_value1
        ELSE c.tx_political_party_name
    END AS tx_political_party_name,

    c.id_crime_key,
    c.tx_type,
    c.tx_party_name,
    c.id_parliamentary_seat_key,
    c.dt_occurse_date,
    c.id_political_party_key,
    c.tx_location_name,
    c.int_presence_number,
    c.id_district_key,
    c.lng_injured_number,
    c.lng_deaths_number,
    c.tx_social_organization_name,
    c.id_type_of_crime_key,
    c.entry_time,
    c.time,
    c.id_division_key,
    c.id_upazila_key,
    c.tx_organization_name,
    c.tx_over_view,
    CONVERT(VARCHAR(20), CONVERT(VARCHAR(10), c.dt_occurse_date, 120) + ' ' + c.time) AS tx_date_time,

    pp.tx_victim_details,
    pp.tx_criminal_details,
    pp.tx_guest_details,
    pp.tx_defendant_details,
    pp.tx_plaintiff_details,
    pp.tx_sponsor_details,

    c.tx_legal_admin_action,
    CAST(c.lng_injured_number AS VARCHAR) + '/' + 
    CAST(c.lng_deaths_number AS VARCHAR) AS tx_casualties


FROM t_crime c
LEFT JOIN T_LOCATION div ON div.id_location_key = c.id_division_key
LEFT JOIN T_LOCATION dis ON dis.id_location_key = c.id_district_key
LEFT JOIN T_LOCATION upz ON upz.id_location_key = c.id_upazila_key
LEFT JOIN T_LOCATION par ON par.id_location_key = c.id_parliamentary_seat_key and par.is_active = 1
JOIN t_configuration con ON con.id_config_key = c.id_type_of_crime_key
LEFT JOIN t_configuration pnt ON pnt.id_config_key = c.id_political_party_key
    AND pnt.tx_config_group = 'POLITICAL_PARTY_GROUP'
    AND pnt.tx_config_sub_group = 'POLITICAL_PARTY_SUB_GROUP'
    AND pnt.is_active = 1
LEFT JOIN person_pivot pp ON pp.id_crime_key = c.id_crime_key
WHERE c.is_active = 1
GO

PRINT 'Optimized view vw_crime_info created successfully.';
