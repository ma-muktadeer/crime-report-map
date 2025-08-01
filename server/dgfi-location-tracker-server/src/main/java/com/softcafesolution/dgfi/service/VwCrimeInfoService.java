package com.softcafesolution.dgfi.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.entity.SConfiguration;
import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.core.service.SConfigurationService;
import com.softcafesolution.dgfi.entity.CrimeChart;
import com.softcafesolution.dgfi.model.ChartMetaDeta;
import com.softcafesolution.dgfi.model.MapMetaData;
import com.softcafesolution.dgfi.model.PeriodType;
import com.softcafesolution.dgfi.model.ReportChartMetaData;
import com.softcafesolution.dgfi.model.TableHeaderProperties;
import com.softcafesolution.dgfi.model.TabularMetaData;
import com.softcafesolution.dgfi.model.VwCrimeInfo;
import com.softcafesolution.dgfi.repo.VwCrimeInfoRepo;

@Service
public class VwCrimeInfoService extends AbstractMessageService<VwCrimeInfo> {

	private static final Logger log = LogManager.getLogger();

	@Autowired
	private VwCrimeInfoRepo crimeInfoRepo;
	
	@Autowired
	private CrimeChartService crimeChartService;

	@Autowired
	private SConfigurationService sConfigurationService;

	@Autowired
	private TableHeaderProperties tableHeaderProperties;

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("action comes for=> {}", actionType);

			if (actionType.equals(ActionType.ACTION_SELECT_ALL.toString())) {
				Page<VwCrimeInfo> crList = selectAll(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			}
			else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				Page<VwCrimeInfo> crList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			}else if (actionType.equals(ActionType.ACTION_SEARCH.toString())) {
				List<ChartMetaDeta> crList = search(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			} else if (actionType.equals(ActionType.ACTION_SEARCH_MONTH_INTERVAL.toString())) {
				Map<String, Map<String, Long>> crList = searchMonth(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			} else if (actionType.equals(ActionType.ACTION_SEARCH_YEARLY_INTERVAL.toString())) {
				Map<String, Map<String, Long>> crList = searchYearly(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			} else if (actionType.equals(ActionType.ACTION_SEARCH_MONTH_COMPARE.toString())) {
				Map<String, Map<String, Long>> crList = searchMonthCompare(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			} else if (actionType.equals(ActionType.ACTION_SEARCH_YEARLY_COMPARE.toString())) {
				Map<String, Map<String, Long>> crList = searchYearlyCompare(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, crList);
			} else if (actionType.equals(ActionType.ACTION_SEARCH_MAP.toString())) {
				VwCrimeInfo mpList = searchMap(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, mpList);
			} else if (actionType.equals(ActionType.TABULAR_SEARCH.toString())) {
				List<TabularMetaData> mpList = tabularSearch(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, mpList);
			}

			else {
				log.info("No action handle [{}]", actionType);
			}

		} catch (Exception ex) {

			msgResponse = ResponseBuilder.buildErrorResponsee(header, ex);

			log.error("Exception Message **** [{}]", ex.getLocalizedMessage());
		}

		return msgResponse;
	}

	
	
	private VwCrimeInfo searchMap(Message<List<VwCrimeInfo>> requestMessage, String actionType) {
		VwCrimeInfo vc = requestMessage.getPayload().getFirst();

		List<MapMetaData> mList = crimeInfoRepo.findMapMetaData(vc.getFromDate(), vc.getToDate(),
				vc.getTypeOfCrimeIdList(), vc.getDivisionId(), vc.getDistrictId(), vc.getUpazilaId(),
				vc.getOrganizationName(), vc.getType());
		vc.setMapCoreData(mList);

		if (vc.getType().equals("POLITICAL")) {
			vc.setMapDetailsData(fildDetailsValue(vc.getFromDate(), vc.getToDate(), vc.getTypeOfCrimeIdList(),
					vc.getDivisionId(), vc.getDistrictId(), vc.getUpazilaId(), vc.getOrganizationName(), vc.getType()));
		}

		return vc;
	}

	private List<VwCrimeInfo> fildDetailsValue(Date fromDate, Date toDate, List<Long> typeOfCrimeIdList,
			Long divisionId, Long districtId, Long upazilaId, String organizationName, String type) {
		List<VwCrimeInfo> vwCrimeInfos = crimeInfoRepo.findAllByDateBetweenAndType(fromDate, toDate, typeOfCrimeIdList,
				 divisionId, districtId, upazilaId, organizationName, type);
		return vwCrimeInfos;
	}

	private Map<String, Map<String, Long>> searchYearlyCompare(Message<List<VwCrimeInfo>> requestMessage,
			String actionType) {
		VwCrimeInfo vc = requestMessage.getPayload().getFirst();
		List<ReportChartMetaData> results = crimeInfoRepo.getYearlyCrimeStats(vc.getTypeOfCrimeIdList(),
				vc.getFromDate(), vc.getToDate(), vc.getDivisionId(), vc.getDistrictId());

		Set<String> expectedPeriods = generatePeriodRange(vc.getFromDate(), vc.getToDate(), PeriodType.YEARLY);

		return buildCompareValue(results, expectedPeriods);
	}
	
	private List<TabularMetaData> tabularSearch(Message<List<VwCrimeInfo>> requestMessage, String actionType) {
		VwCrimeInfo vw = requestMessage.getPayload().getFirst();
		List<SConfiguration> sList = sConfigurationService.selectConfigByIdsAndGroupAndSubgroup(
				vw.getTypeOfCrimeIdList(), "POLITICAL_GROUP", "POLITICAL_SUB_GROUP");
		return buildTabularMataData(sList, vw);

	}

	private Map<String, Map<String, Long>> searchMonthCompare(Message<List<VwCrimeInfo>> requestMessage,
			String actionType) {
		VwCrimeInfo vc = requestMessage.getPayload().getFirst();
		List<ReportChartMetaData> results = crimeInfoRepo.getMonthlyCrimeStats(vc.getTypeOfCrimeIdList(),
				vc.getFromDate(), vc.getToDate(), vc.getDivisionId(), vc.getDistrictId(), vc.getType());

		Set<String> expectedPeriods = generatePeriodRange(vc.getFromDate(), vc.getToDate(), PeriodType.MONTHLY);

		return buildCompareValue(results, expectedPeriods);

//		return buildCompareValue(results);
	}
	
	private List<TabularMetaData> buildTabularMataData(List<SConfiguration> sList, VwCrimeInfo vw) {
		List<TabularMetaData> tabularDatas = new ArrayList<>();
		for (SConfiguration sConfiguration : sList) {
			TabularMetaData tb = new TabularMetaData();
			tb.setTitle(sConfiguration.getValue1());
//			log.info("configId: {}", sConfiguration.getConfigId());
			Map<String, String> header = tableHeaderProperties.getTable().getHeader().get(sConfiguration.getConfigId());
			if (header == null || header.isEmpty()) {
				log.info("getting header is empty. setting default header for configId: {}", sConfiguration.getConfigId());
				header = tableHeaderProperties.getDefault().getHeader();
			}
//			log.info("tabular heade:title=>{}", header, tb.getTitle());

			// now need to add tb.setTabularData(null);politicalPartyName
			tb.setHeader(header);
			tb.setTabularData(
					crimeInfoRepo.findAllByTypeOfCrimeId(sConfiguration.getConfigId(), vw.getFromDate(), vw.getToDate(),
							vw.getDivisionId(), vw.getDistrictId(), vw.getUpazilaId(), vw.getPoliticalPartyName(), vw.getPoliticalPartyId()));
			tabularDatas.add(tb);
		}
		return tabularDatas;
	}

	private Map<String, Map<String, Long>> buildCompareValue(List<ReportChartMetaData> results,
			Set<String> expectedPeriods) {

		if (results == null || results.isEmpty()) {
			return expectedPeriods.stream().collect(
					Collectors.toMap(period -> period, period -> new HashMap<>(), (a, b) -> a, LinkedHashMap::new));
		}

		// Collect all crime types
		Set<String> crimeTypes = results.stream().filter(Objects::nonNull).map(ReportChartMetaData::getCrimeType)
				.filter(Objects::nonNull).collect(Collectors.toSet());

		// Initialize complete matrix: CrimeType -> (Date -> Value)
		Map<String, Map<String, Long>> chartData = crimeTypes.stream()
				.collect(Collectors.toMap(crimeType -> crimeType,
						crimeType -> expectedPeriods.stream()
								.collect(Collectors.toMap(date -> date, date -> 0L, (a, b) -> a, LinkedHashMap::new)),
						(a, b) -> a, LinkedHashMap::new));

		// Fill with actual values
		results.forEach(dto -> {
			if (dto != null && dto.getCrimeType() != null && dto.getDateString() != null
					&& chartData.containsKey(dto.getCrimeType())) {

				chartData.get(dto.getCrimeType()).put(dto.getDateString(),
						dto.getNumber() != null ? dto.getNumber() : 0L);
			}
		});

		return chartData;
	}

	private Map<String, Map<String, Long>> searchYearly(Message<List<VwCrimeInfo>> requestMessage, String actionType) {
		VwCrimeInfo vc = requestMessage.getPayload().getFirst();

		List<ReportChartMetaData> results = crimeInfoRepo.getYearlyCrimeStats(vc.getTypeOfCrimeIdList(),
				vc.getFromDate(), vc.getToDate(), vc.getDivisionId(), vc.getDistrictId());

		Set<String> expectedPeriods = generatePeriodRange(vc.getFromDate(), vc.getToDate(), PeriodType.YEARLY);

		return buildIntervalValue(results, expectedPeriods);
	}

	private Map<String, Map<String, Long>> searchMonth(Message<List<VwCrimeInfo>> requestMessage, String actionType) {

		return searchCrimeStats(requestMessage);

	}

//	private Set<String> generatePeriodRange(Date fromDate, Date toDate, PeriodType periodType) {
//		if (fromDate == null || toDate == null) {
//			return new TreeSet<>();
//		}
//
//		LocalDate start = fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//		LocalDate end = toDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//
//		return switch (periodType) {
//		case MONTHLY -> start.datesUntil(end, Period.ofMonths(1))
//				.<String>map(date -> DateTimeFormatter.ofPattern("yyyy-MM").format(date))
//				.collect(Collectors.toCollection(TreeSet::new));
//		case YEARLY -> start.datesUntil(end, Period.ofYears(1))
//				.<String>map(date -> DateTimeFormatter.ofPattern("yyyy").format(date))
//				.collect(Collectors.toCollection(TreeSet::new));
//		case WEEKLY -> {
//			DateTimeFormatter startDayFormatter = DateTimeFormatter.ofPattern("dd");
//			DateTimeFormatter endDayFormatter = DateTimeFormatter.ofPattern("dd MMM");
//			LocalDate alignedStart = start.with(java.time.DayOfWeek.SUNDAY);
//			yield alignedStart.datesUntil(end, Period.ofWeeks(1)).map(date -> {
//				LocalDate weekEnd = date.plusDays(6);
//				return startDayFormatter.format(date) + "-" + endDayFormatter.format(weekEnd);
//			}).collect(Collectors.toCollection(LinkedHashSet::new));
//		}
//		};
//	}
	
	private Set<String> generatePeriodRange(Date fromDate, Date toDate, PeriodType periodType) {
		if (fromDate == null || toDate == null) {
			return new TreeSet<>();
		}

		LocalDate start = fromDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate end = toDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

		switch (periodType) {
			case MONTHLY -> {
				DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
				Set<String> result = new TreeSet<>();
				LocalDate current = start.withDayOfMonth(1);
				LocalDate endMonth = end.withDayOfMonth(1);
				while (!current.isAfter(endMonth)) {
					result.add(monthFormatter.format(current));
					current = current.plusMonths(1);
				}
				return result;
			}
			case YEARLY -> {
				DateTimeFormatter yearFormatter = DateTimeFormatter.ofPattern("yyyy");
				Set<String> result = new TreeSet<>();
				LocalDate current = start.withDayOfYear(1);
				LocalDate endYear = end.withDayOfYear(1);
				while (!current.isAfter(endYear)) {
					result.add(yearFormatter.format(current));
					current = current.plusYears(1);
				}
				return result;
			}
			case WEEKLY -> {
				DateTimeFormatter startDayFormatter = DateTimeFormatter.ofPattern("dd");
				DateTimeFormatter endDayFormatter = DateTimeFormatter.ofPattern("dd MMM");
				Set<String> result = new LinkedHashSet<>();

				// align to Sunday of the first week
				LocalDate alignedStart = start.with(java.time.DayOfWeek.SUNDAY);
				LocalDate current = alignedStart;
				while (!current.isAfter(end)) {
					LocalDate weekEnd = current.plusDays(6);
					result.add(startDayFormatter.format(current) + "-" + endDayFormatter.format(weekEnd));
					current = current.plusWeeks(1);
				}
				return result;
			}
		}
		return new TreeSet<>();
	}

	public Map<String, Map<String, Long>> searchCrimeStats(Message<List<VwCrimeInfo>> requestMessage) {

		VwCrimeInfo vc = requestMessage.getPayload().getFirst();

		List<ReportChartMetaData> results = crimeInfoRepo.getMonthlyCrimeStats(vc.getTypeOfCrimeIdList(),
				vc.getFromDate(), vc.getToDate(), vc.getDivisionId(), vc.getDistrictId(), vc.getType());

		Set<String> expectedPeriods = generatePeriodRange(vc.getFromDate(), vc.getToDate(), PeriodType.MONTHLY);

		return buildIntervalValue(results, expectedPeriods);
	}

	private Map<String, Map<String, Long>> buildIntervalValue(List<ReportChartMetaData> results,
			Set<String> expectedPeriods) {

		if (results == null || results.isEmpty()) {
			return expectedPeriods.stream().collect(
					Collectors.toMap(period -> period, period -> new HashMap<>(), (a, b) -> a, LinkedHashMap::new));
		}

		// Collect all crime types
		Set<String> crimeTypes = results.stream().filter(Objects::nonNull).map(ReportChartMetaData::getCrimeType)
				.filter(Objects::nonNull).collect(Collectors.toSet());

		// Initialize complete matrix
		Map<String, Map<String, Long>> chartData = expectedPeriods.stream()
				.collect(Collectors.toMap(period -> period,
				period -> crimeTypes.stream().collect(
						Collectors.toMap(crimeType -> crimeType, crimeType -> 0L, (a, b) -> a, LinkedHashMap::new)),
				(a, b) -> a, LinkedHashMap::new));

		// Fill with actual values
		results.forEach(dto -> {
			if (dto != null && dto.getCrimeType() != null) {
				chartData.computeIfPresent(dto.getDateString(), (period, periodData) -> {
					periodData.put(dto.getCrimeType(), dto.getNumber() != null ? dto.getNumber() : 0L);
					return periodData;
				});
			}
		});

		return chartData;
	}

	private List<ChartMetaDeta> search(Message<List<VwCrimeInfo>> requestMessage, String actionType) {
		VwCrimeInfo vc = requestMessage.getPayload().getFirst();

		return crimeInfoRepo.searchTimelyChart(vc.getTypeOfCrimeIdList(), vc.getFromDate(), vc.getToDate(),
				vc.getDivisionId(), vc.getDistrictId(), vc.getType());
	}

	private Page<VwCrimeInfo> selectAll(Message<List<VwCrimeInfo>> requestMessage, String actionType) {
		VwCrimeInfo vwCrimeInfo = requestMessage.getPayload().getFirst();

		Pageable pageable = PageRequest.of(vwCrimeInfo.getPageNumber() - 1, vwCrimeInfo.getPageSize());
		return crimeInfoRepo.findAllCrime(vwCrimeInfo.getFromDate(), vwCrimeInfo.getToDate(),
				vwCrimeInfo.getTypeOfCrimeId(), vwCrimeInfo.getDivisionId(), vwCrimeInfo.getDistrictId(),
				vwCrimeInfo.getUpazilaId(), vwCrimeInfo.getOrganizationName(), vwCrimeInfo.getType(), pageable);
	}
	private Page<VwCrimeInfo> delete(Message<List<VwCrimeInfo>> requestMessage, String actionType) {
		VwCrimeInfo vwCrimeInfo = requestMessage.getPayload().getFirst();

		if(vwCrimeInfo.getCrimeId() != null) {
			crimeChartService.deleteCrime(vwCrimeInfo);
		}
		else {
			log.info("getting crimeid is null for deleting.");
			throw new RuntimeException("Invalid request.");
		}
		
		Pageable pageable = PageRequest.of(vwCrimeInfo.getPageNumber() - 1, vwCrimeInfo.getPageSize());
		return crimeInfoRepo.findAllCrime(vwCrimeInfo.getFromDate(), vwCrimeInfo.getToDate(),
				vwCrimeInfo.getTypeOfCrimeId(), vwCrimeInfo.getDivisionId(), vwCrimeInfo.getDistrictId(),
				vwCrimeInfo.getUpazilaId(), vwCrimeInfo.getOrganizationName(), vwCrimeInfo.getType(), pageable);
	}



}
