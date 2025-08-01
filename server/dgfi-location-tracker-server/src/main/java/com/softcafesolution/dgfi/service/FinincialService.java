package com.softcafesolution.dgfi.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.softcafesolution.core.enums.ActionType;
import com.softcafesolution.core.messaging.AbstractMessageHeader;
import com.softcafesolution.core.messaging.AbstractMessageService;
import com.softcafesolution.core.messaging.Message;
import com.softcafesolution.core.messaging.ResponseBuilder;
import com.softcafesolution.dgfi.entity.Finincial;
import com.softcafesolution.dgfi.model.EconomicReportMetaData;
import com.softcafesolution.dgfi.model.PeriodType;
import com.softcafesolution.dgfi.model.VwFinancialInfo;
import com.softcafesolution.dgfi.repo.FinincialRepo;
import com.softcafesolution.dgfi.repo.VwFinancialInfoRepo;

@Service
public class FinincialService extends AbstractMessageService<Finincial> {

    private static final Logger log = LoggerFactory.getLogger(FinincialService.class);

	@Autowired
	private FinincialRepo finincialRepo;

	@Autowired
	VwFinancialInfoRepo vwFinancialInfoRepo;

    FinincialService(UserDetailsService userDetailsService) {
    }

	@Override
	public Message<?> serviceSingle(Message requestMessage) throws Exception {
		AbstractMessageHeader header = null;
		Message<?> msgResponse = null;

		try {
			header = requestMessage.getHeader();
			String actionType = header.getActionType();
			log.info("action comes for=> {}", actionType);

			if (actionType.equals(ActionType.ACTION_NEW.toString())) {
				List<Finincial> finincials = saveOrUpdate(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, finincials);
			} else if (actionType.equals(ActionType.SEARCH.toString())) {
				Map<String, Map<String, Long>> finincials = search(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, finincials);
			} else if (actionType.equals(ActionType.ACTION_SELECT.toString())) {
				Page<VwFinancialInfo> financialList = select(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, financialList);
			} else if (actionType.equals(ActionType.ACTION_DELETE.toString())) {
				List<Finincial> financialList = delete(requestMessage, actionType);
				msgResponse = ResponseBuilder.buildResponse(header, financialList);
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

	private Map<String, Map<String, Long>> search(Message<List<Finincial>> requestMessage, String actionType) {
		return searchReportData(requestMessage);
	}

	private Map<String, Map<String, Long>> searchReportData(Message<List<Finincial>> requestMessage) {

		Finincial vc = requestMessage.getPayload().getFirst();

//		List<EconomicReportMetaData> 
		List<EconomicReportMetaData> results = findResult(vc);

		Set<String> expectedPeriods = generatePeriodRange(vc.getFromDate(), vc.getToDate(),
				PeriodType.valueOf(vc.getCompareBy()));
//
		return buildCompareValue(results, expectedPeriods);
	}

	private List<EconomicReportMetaData> findResult(Finincial vc) {
		if (vc.getType().equals("PRODUCTS")) {
			if (vc.getCompareBy().equals(PeriodType.WEEKLY.toString())) {
				return finincialRepo.getWeeklyFinicialStats(vc.getIdProductNameList(), vc.getFromDate(),
						vc.getToDate(), vc.getType());
			} else if (vc.getCompareBy().equals(PeriodType.MONTHLY.toString())) {
				return finincialRepo.getMonthlyFinicialStats(vc.getIdProductNameList(), vc.getFromDate(),
						vc.getToDate(), vc.getType());
			} else {
				return finincialRepo.getYearlyCrimeStats(vc.getIdProductNameList(), vc.getFromDate(), vc.getToDate(),
						vc.getType());
			}
		} else {

			if (vc.getCompareBy().equals(PeriodType.WEEKLY.toString())) {
				return finincialRepo.getWeeklyEconomics(vc.getFromDate(), vc.getToDate(), vc.getType());
				
			} else if (vc.getCompareBy().equals(PeriodType.MONTHLY.toString())) {
				return finincialRepo.getMonthlyEcomics(vc.getFromDate(), vc.getToDate(), vc.getType());
			} else {
				return finincialRepo.getYearlyMonthlyEcomics(vc.getFromDate(), vc.getToDate(), vc.getType());
			}
		}
	}

	private Map<String, Map<String, Long>> buildCompareValue(List<EconomicReportMetaData> results,
			Set<String> expectedPeriods) {

		if (results == null || results.isEmpty()) {
			return expectedPeriods.stream().collect(
					Collectors.toMap(period -> period, period -> new HashMap<>(), (a, b) -> a, LinkedHashMap::new));
		}

//		// Collect all crime types
		Set<String> crimeTypes = results.stream().filter(Objects::nonNull).map(EconomicReportMetaData::getType)
				.filter(Objects::nonNull).collect(Collectors.toSet());
//
//		// Initialize complete matrix: CrimeType -> (Date -> Value)
		Map<String, Map<String, Long>> chartData = expectedPeriods.stream()
				.collect(Collectors.toMap(period -> period,
						period -> crimeTypes.stream()
								.collect(Collectors.toMap(crimeType -> crimeType, crimeType -> 0L, (a, b) -> a, LinkedHashMap::new)),
						(a, b) -> a, LinkedHashMap::new));

		// Fill with actual values
//		results.forEach(dto -> {
//			if (dto != null && dto.getType() != null && dto.getDateString() != null
//					&& chartData.containsKey(dto.getType())) {
//
//				chartData.get(dto.getType()).put(dto.getDateString(), dto.getPrize() != null ? dto.getPrize() : 0L);
//			}
//		});
		results.forEach(dto -> {
			if (dto != null && dto.getType() != null) {
				chartData.computeIfPresent(dto.getDateString(), (period, periodData) -> {
					periodData.put(dto.getType(), dto.getPrize() != null ? dto.getPrize() : 0L);
					return periodData;
				});
			}
		});

		return chartData;
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


	private List<Finincial> saveOrUpdate(Message<List<Finincial>> requestMessage, String actionType) {
		Finincial cr = requestMessage.getPayload().getFirst();
		Long userId = requestMessage.getHeader().getUserId().longValue();

		cr.setUserModId(userId);
		cr.setModTime(new Date());

		if (cr.getFinincialId() == null) {
			cr.setCreatorId(userId);
		}

		finincialRepo.save(cr);

		return findAllFinicalByActive();
	}

	private List<Finincial> findAllFinicalByActive() {

		return finincialRepo.findAllByActive(1);
	}

	private Page<VwFinancialInfo> select(Message<List<Finincial>> message, String action) throws Exception {
		return selectAll(message);
	}

	private Page<VwFinancialInfo> selectAll(Message<List<Finincial>> message) throws Exception {
		Finincial ur = message.getPayload().get(0);
		Pageable pageable = PageRequest.of(ur.getPageNumber() != null ? ur.getPageNumber() - 1 : 0,
				ur.getPageSize() != null ? ur.getPageSize() : 20, Sort.by("finincialId").descending());
		return vwFinancialInfoRepo.findAllByTxTypeAndIsActive(ur.getType(), ur.getDttDate(), ur.getIdProductName(), ur.getIdUnitName(), 
				ur.getQuantity(), ur.getUnit(), ur.getPrice(), 1, pageable);
	}

	private List<Finincial> delete(Message<List<Finincial>> requestMessage, String actionType) {
		Finincial cr = requestMessage.getPayload().getFirst();
		Long id = cr.getFinincialId();

		Finincial existingRecord = finincialRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Record not found with id: " + id));

		existingRecord.setActive(0);
		existingRecord.setUserModId(requestMessage.getHeader().getUserId().longValue());
		existingRecord.setModTime(new Date());

		finincialRepo.save(existingRecord);

		return findAllFinicalByActive();
	}

}
