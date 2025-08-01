package com.softcafesolution.core.utils;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;

public class CF {

    public static <T extends CommonProperties> T setDefaultValue(T t, Long userId){
        t.setCheckerId(userId);
        t.setCheckerTime(new Date());
        t.setCreatorId(userId);
        t.setStatus(Str.APPROVED);
        return t;
    }

	public static void setDefaultValue(Object obj, Long userId) throws Exception {
//        fillInsert(obj);
		PropertyUtils.setProperty(obj, CommonProp.checkerId,  userId);
		PropertyUtils.setProperty(obj, CommonProp.checkerTime,  new Date());
        PropertyUtils.setProperty(obj, CommonProp.userModId, userId);
		PropertyUtils.setProperty(obj, CommonProp.status,  Str.APPROVED);
	}

    public static void fillInsert(Object obj) throws Exception {
		PropertyUtils.setProperty(obj, CommonProp.active, 1);
        PropertyUtils.setProperty(obj, CommonProp.modDate, new Date());
		PropertyUtils.setProperty(obj, CommonProp.createDate,  new Date());
		PropertyUtils.setProperty(obj, CommonProp.status,  Str.PEND_APPROVE);
	}


    public static void fillInsert(Object obj, long makerId, boolean isAllowMakerChecker) throws Exception {
        PropertyUtils.setProperty(obj, CommonProp.creatorId, makerId);
        fillInsert(obj);
        if(!isAllowMakerChecker){
            setDefaultValue(obj, makerId);
        }
    }
	
	public static void fillUpdate(Object obj) throws Exception {
		PropertyUtils.setProperty(obj, CommonProp.modDate, new Date());
	}
	
    public static <T> List<T> mapRows(final Class<T> clazz, final Map<String, String> rs2BeanMap, final ResultSet rs) throws Exception {
        final List<T> arrayList = new ArrayList<T>();
        if (rs2BeanMap != null && rs != null) {
            T newInstance = null;
            while (rs.next()) {
                newInstance = clazz.newInstance();
                for (final Map.Entry<String, String> entry : rs2BeanMap.entrySet()) {
                    final Object value = rs.getObject(entry.getKey());
                    if (value != null) {
                        BeanUtils.setProperty((Object)newInstance, entry.getValue(), value);
                    }
                }
                arrayList.add(newInstance);
            }
        }
        return arrayList;
    }

}
