// [Electricity Tariff]
const demandUnitPriceInfo = [{
  date: 0,
  demandL1: 0,
  demandL2: 0,
  demandL3: 0,
  demandH1: 0,
  demandH2: 0,
  demandH3: 0,
},{
  date: 201612,
  demandL1: 910,
  demandL2: 1600,
  demandL3: 7300,
  demandH1: 730,
  demandH2: 1260,
  demandH3: 6060,
}];

const energyUnitPriceInfo = [{
  date: 0,
  energyL1: 0,
  energyL2: 0,
  energyL3: 0,
  energyL4: 0,
  energyH1: 0,
  energyH2: 0,
  energyH3: 0,
  energyH4: 0,
},{
  date: 201612,
  energyL1: 93.3,
  energyL2: 187.9,
  energyL3: 280.6,
  energyL4: 709.5,
  energyH1: 78.3,
  energyH2: 147.3,
  energyH3: 215.6,
  energyH4: 574.6,
},{
  date: 202101,
  energyL1: 88.3,
  energyL2: 182.9,
  energyL3: 275.6,
  energyL4: 704.5,
  energyH1: 73.3,
  energyH2: 142.3,
  energyH3: 210.6,
  energyH4: 569.6,
},{
  date: 202204,
  energyL1: 93.2,
  energyL2: 187.8,
  energyL3: 280.5,
  energyL4: 709.4,
  energyH1: 78.2,
  energyH2: 147.2,
  energyH3: 215.5,
  energyH4: 574.5,
},{
  date: 202210,
  energyL1: 100.6,
  energyL2: 195.2,
  energyL3: 287.9,
  energyL4: 716.8,
  energyH1: 85.6,
  energyH2: 154.6,
  energyH3: 222.9,
  energyH4: 581.9,
},{
  date: 202301,
  energyL1: 112.0,
  energyL2: 206.6,
  energyL3: 299.3,
  energyL4: 728.2,
  energyH1: 97.0,
  energyH2: 166.0,
  energyH3: 234.3,
  energyH4: 593.3,
},{
  date: 202306,
  energyL1: 120.0,
  energyL2: 214.6,
  energyL3: 307.3,
  energyL4: 736.2,
  energyH1: 105.0,
  energyH2: 174.0,
  energyH3: 242.3,
  energyH4: 601.3,
}];

const climateUnitPriceInfo = [{
  date: 0,
  climate: 0,
},{
  date: 201612,
  climate: 0,
},{
  date: 202101,
  climate: 5.3,
},{
  date: 202204,
  climate: 7.3,
},{
  date: 202301,
  climate: 9,
}];

const fuelUnitPriceInfo = [{
  date: 0,
  fuel: 0,
},{
  date: 201612,
  fuel: 0,
},{
  date: 202012,
  fuel: -3,
},{
  date: 202109,
  fuel: 0,
},{
  date: 202206,
  fuel: 5,
}]

function getNumberOfDays(yyyymm) {
  const year = Number(String(yyyymm).slice(0, 4));
  const month = Number(String(yyyymm).slice(4, 6));
  const d = new Date(year, month !== 1 ? month - 1 : 12, 0);

  return d.getDate();
 }
 
function getMonthRate(yyyymm, meterDate) {
  const numberOfDays = getNumberOfDays(yyyymm);
  meterDate == 30 ? meterDate = numberOfDays : meterDate;
  let result = [];
  meterDate == 1
    ? result = {before: 1, this: 0}
    : meterDate == 30
    ? result = {before: 0, this: 1}
    : result = {before: (numberOfDays - meterDate + 1) / numberOfDays, this: ((meterDate - 1) / numberOfDays)}
  ;

  return result;
}

function getFuelCharge(yyyymm, meterDate) {
  let fuelCharges = [[],[]];;
  const mm = Number(String(yyyymm).slice(4, 6));
  const beforeYyyymm = mm == 1 ? yyyymm - 89 : yyyymm - 1;
  for(i = 0; i < fuelUnitPriceInfo.length; i++) {
    if(yyyymm >= fuelUnitPriceInfo[i].date) {
      fuelCharges[1] = fuelUnitPriceInfo[i].fuel
      ;
    }
  }
  for(j = 0; j < fuelUnitPriceInfo.length; j++) {
    if(beforeYyyymm >= fuelUnitPriceInfo[j].date) {
      fuelCharges[0] = fuelUnitPriceInfo[j].fuel
      ;
    }
  }
  let result = [];
  meterDate == 1
    ? result = {before: fuelCharges[0], this: 0}
    : meterDate == 30
    ? result = {before: 0, this: fuelCharges[1]}
    : result = {before: fuelCharges[0], this: fuelCharges[1]}
  ;

	return result;
}

function getClimateCharge(yyyymm, meterDate) {
  let climateCharges = [[],[]];
  const mm = Number(String(yyyymm).slice(4, 6));
  const beforeYyyymm = mm == 1 ? yyyymm - 89 : yyyymm - 1;
  for(i = 0; i < climateUnitPriceInfo.length; i++) {
    if(yyyymm >= climateUnitPriceInfo[i].date) {
      climateCharges[1] = climateUnitPriceInfo[i].climate
      ;
    }
  }
  for(j = 0; j < climateUnitPriceInfo.length; j++) {
    if(beforeYyyymm >= climateUnitPriceInfo[j].date) {
      climateCharges[0] = climateUnitPriceInfo[j].climate
      ;
    }
  }
  let result = [];
  meterDate == 1
    ? result = {before: climateCharges[0], this: 0}
    : meterDate == 30
    ? result = {before: 0, this: climateCharges[1]}
    : result = {before: climateCharges[0], this: climateCharges[1]}
  ;

	return result;
}

function getDemandCharge(yyyymm, contractType, meterDate) {
  let demandCharges = [[],[]];
  const mm = Number(String(yyyymm).slice(4, 6));
	const beforeYyyymm = mm == 1 ? yyyymm - 89 : yyyymm - 1;
	for(i = 0; i < demandUnitPriceInfo.length; i++) {
		if(yyyymm >= demandUnitPriceInfo[i].date) {
    			demandCharges[1] = contractType == "low"
			? [demandUnitPriceInfo[i].demandL1, demandUnitPriceInfo[i].demandL2, demandUnitPriceInfo[i].demandL3]
			: [demandUnitPriceInfo[i].demandH1, demandUnitPriceInfo[i].demandH2, demandUnitPriceInfo[i].demandH3]
			;
		}
	}
  for(j = 0; j < demandUnitPriceInfo.length; j++) {
		if(beforeYyyymm >= demandUnitPriceInfo[j].date) {
    			demandCharges[0] = contractType == "low"
			? [demandUnitPriceInfo[j].demandL1, demandUnitPriceInfo[j].demandL2, demandUnitPriceInfo[j].demandL3]
			: [demandUnitPriceInfo[j].demandH1, demandUnitPriceInfo[j].demandH2, demandUnitPriceInfo[j].demandH3]
			;
		}
	}
  let result = [];
  meterDate == 1
    ? result = {before: demandCharges[0], this: [0, 0, 0]}
    : meterDate == 30
    ? result = {before: [0, 0, 0], this: demandCharges[1]}
    : result = {before: demandCharges[0], this: demandCharges[1]}
  ;

	return result;
}

function getIntervalCharge(contractType, yyyymm, meterDate) {
	let beforeMonthResult = [];
	let thisMonthResult = [];
	const mm = Number(String(yyyymm).slice(4, 6));
	const beforeYyyymm = mm == 1 ? yyyymm - 89 : yyyymm - 1;
	const beforeMm = mm !== 1 ? mm - 1 : 12;
	for(i = 0; i < energyUnitPriceInfo.length; i++) {
		if(yyyymm >= energyUnitPriceInfo[i].date) {
    			thisMonthResult = contractType == "low"
			? [energyUnitPriceInfo[i].energyL1, energyUnitPriceInfo[i].energyL2, energyUnitPriceInfo[i].energyL3, energyUnitPriceInfo[i].energyL4]
			: [energyUnitPriceInfo[i].energyH1, energyUnitPriceInfo[i].energyH2, energyUnitPriceInfo[i].energyH3, energyUnitPriceInfo[i].energyH4]
			;
		}
	}
	for(j = 0; j < energyUnitPriceInfo.length; j++) {
		if(beforeYyyymm >= energyUnitPriceInfo[j].date) {
    			beforeMonthResult = contractType == "low"
			? [energyUnitPriceInfo[j].energyL1, energyUnitPriceInfo[j].energyL2, energyUnitPriceInfo[j].energyL3, energyUnitPriceInfo[j].energyL4]
			: [energyUnitPriceInfo[j].energyH1, energyUnitPriceInfo[j].energyH2, energyUnitPriceInfo[j].energyH3, energyUnitPriceInfo[j].energyH4]
			;
		}
	}
	beforeMm == 7 || beforeMm == 8 || beforeMm == 12 || beforeMm == 1 || beforeMm == 2
		? ""
		: beforeMonthResult[3] = beforeMonthResult[2]
	;
	mm == 7 || mm == 8 || mm == 12 || mm == 1 || mm == 2
		? ""
		: thisMonthResult[3] = thisMonthResult[2]
	;
  let result = [];
  meterDate == 1
    ? result = {before: beforeMonthResult, this: [0, 0, 0, 0]}
    : meterDate == 30
    ? result = {before: [0, 0, 0, 0], this: thisMonthResult}
    : result = {before: beforeMonthResult, this: thisMonthResult}
    
	return result;
}

function getIntervalRange(yyyymm) {
	const thisMonth = Number(String(yyyymm).slice(4, 6));
	const beforeMonth = thisMonth !== 1 ? thisMonth - 1 : 12;
	const result = [[], []];
	if(beforeMonth == 7 || beforeMonth == 8) {
		result[0].push(300, 150, 550);
	} else {
		result[0].push(200, 200, 600);
	}
	if(thisMonth == 7 || thisMonth == 8) {
		result[1].push(300, 150, 550);
	} else {
		result[1].push(200, 200, 600);
	}

	return {before: result[0], this: result[1]};
}

function calcEnergyCharge(yyyymm, meterDate, contractType, kWh) {
  const [beforeMonthRate, thisMonthRate] = [
    meterDate == 1
      ? 1
      : meterDate == 30
      ? 0
      : getMonthRate(yyyymm, meterDate).before
    ,
    meterDate == 30
      ? 1
      : meterDate == 1
      ? 0
      : getMonthRate(yyyymm, meterDate).this
  ];
	const [beforeKWh, thisKWh] = [Math.round(kWh * beforeMonthRate), Math.round(kWh * thisMonthRate)];
	const [before1000, this1000] = [Math.round(1000 * beforeMonthRate), Math.round(1000 * thisMonthRate)];
	const [beforeRest, thisRest] = [kWh <= 1000 ? 0 : Math.round((kWh - 1000) * beforeMonthRate), kWh <= 1000 ? 0 : Math.round((kWh - 1000) * thisMonthRate)];
  const [beforeRange1, beforeRange2, beforeRange3] = [
    getIntervalRange(yyyymm).before[0],
    getIntervalRange(yyyymm).before[1],
    getIntervalRange(yyyymm).before[2]
  ];
  const [
    beforeActualInterval1,
    beforeActualInterval2,
    beforeActualInterval3,
    beforeActualInterval4
  ] = [
    beforeKWh < 0
      ? 0
      : beforeKWh > Math.round(beforeRange1 * beforeMonthRate)
      ? Math.round(beforeRange1 * beforeMonthRate)
      : beforeKWh
    ,
    beforeKWh - Math.round(beforeRange1 * beforeMonthRate) < 0
      ? 0
      : beforeKWh - Math.round(beforeRange1 * beforeMonthRate) > Math.round(beforeRange2 * beforeMonthRate)
      ? Math.round(beforeRange2 * beforeMonthRate)
      : beforeKWh - Math.round(beforeRange1 * beforeMonthRate)
    ,
    beforeKWh - (Math.round(beforeRange1 * beforeMonthRate) + Math.round(beforeRange2 * beforeMonthRate)) < 0
      ? 0
      : beforeKWh - (Math.round(beforeRange1 * beforeMonthRate) + Math.round(beforeRange2 * beforeMonthRate)) > Math.round(beforeRange3 * beforeMonthRate)
      ? before1000 - (Math.round(beforeRange1 * beforeMonthRate) + Math.round(beforeRange2 * beforeMonthRate))
      : beforeKWh - (Math.round(beforeRange1 * beforeMonthRate) + Math.round(beforeRange2 * beforeMonthRate))
    ,
    beforeKWh <= before1000
      ? 0
      : beforeRest
  ];
  const [thisRange1, thisRange2, thisRange3] = [
    getIntervalRange(yyyymm).this[0],
    getIntervalRange(yyyymm).this[1],
    getIntervalRange(yyyymm).this[2]
  ];
  const [
    thisActualInterval1,
    thisActualInterval2,
    thisActualInterval3,
    thisActualInterval4
  ] = [
    thisKWh < 0
      ? 0
      : thisKWh > Math.round(thisRange1 * thisMonthRate)
      ? Math.round(thisRange1 * thisMonthRate)
      : thisKWh
    ,
    thisKWh - Math.round(thisRange1 * thisMonthRate) < 0
      ? 0
      : thisKWh - Math.round(thisRange1 * thisMonthRate) > Math.round(thisRange2 * thisMonthRate)
      ? Math.round(thisRange2 * thisMonthRate)
      : thisKWh - Math.round(thisRange1 * thisMonthRate)
    ,
    thisKWh - (Math.round(thisRange1 * thisMonthRate) + Math.round(thisRange2 * thisMonthRate)) < 0
      ? 0
      : thisKWh - (Math.round(thisRange1 * thisMonthRate) + Math.round(thisRange2 * thisMonthRate)) > Math.round(thisRange3 * thisMonthRate)
      ? this1000 - (Math.round(thisRange1 * thisMonthRate) + Math.round(thisRange2 * thisMonthRate))
      : thisKWh - (Math.round(thisRange1 * thisMonthRate) + Math.round(thisRange2 * thisMonthRate))
    ,
    thisKWh <= this1000
      ? 0
      : thisRest
  ];
	const [
		beforeIntervalCharge1,
		beforeIntervalCharge2,
		beforeIntervalCharge3,
		beforeIntervalCharge4
	] = [
		getIntervalCharge(contractType, yyyymm, meterDate).before[0],
		getIntervalCharge(contractType, yyyymm, meterDate).before[1],
		getIntervalCharge(contractType, yyyymm, meterDate).before[2],
	  getIntervalCharge(contractType, yyyymm, meterDate).before[3]
	];
	const [
		thisIntervalCharge1,
		thisIntervalCharge2,
		thisIntervalCharge3,
		thisIntervalCharge4
	] = [
		getIntervalCharge(contractType, yyyymm, meterDate).this[0],
		getIntervalCharge(contractType, yyyymm, meterDate).this[1],
		getIntervalCharge(contractType, yyyymm, meterDate).this[2],
    getIntervalCharge(contractType, yyyymm, meterDate).this[3]
	];
  const [sumBefore1, sumBefore2, sumBefore3, sumBefore4] = [
    beforeActualInterval1 * beforeIntervalCharge1,
    beforeActualInterval2 * beforeIntervalCharge2,
    beforeActualInterval3 * beforeIntervalCharge3,
    beforeActualInterval4 * beforeIntervalCharge4,
  ];
  const [sumThis1, sumThis2, sumThis3, sumThis4] = [
    thisActualInterval1 * thisIntervalCharge1,
    thisActualInterval2 * thisIntervalCharge2,
    thisActualInterval3 * thisIntervalCharge3,
    thisActualInterval4 * thisIntervalCharge4,
  ];
  const [allBeforeSum, allThisSum, allSum] = [
    sumBefore1 + sumBefore2 + sumBefore3 + sumBefore4,
    sumThis1 + sumThis2 + sumThis3 + sumThis4,
    sumBefore1 + sumBefore2 + sumBefore3 + sumBefore4 + sumThis1 + sumThis2 + sumThis3 + sumThis4
  ];
  const plus8WonFrom20230516 = yyyymm == 202305 && meterDate == 30
    ? kWh * 8 * 16 / 31
    : yyyymm == 202305 && meterDate >= (16 + 1)
    ? kWh * 8 * (meterDate - 16) / 30
    : yyyymm == 202306 && meterDate <= 16
    ? kWh * 8 * 16 / 31
    : yyyymm == 202306 && meterDate >= (16 + 1)
    ? kWh * 8 * (31 - (meterDate - 1)) / 31
    : 0
  ;

  return meterDate == 1
    ? Math.trunc(allBeforeSum + plus8WonFrom20230516) + Math.trunc(Number(((allBeforeSum + plus8WonFrom20230516) % 1).toPrecision(1)))
    : meterDate == 30
    ? Math.trunc(allThisSum + plus8WonFrom20230516) + Math.trunc(Number(((allThisSum + plus8WonFrom20230516) % 1).toPrecision(1)))
    : Math.trunc(allSum + plus8WonFrom20230516) + Math.trunc(Number(((allSum + plus8WonFrom20230516) % 1).toPrecision(1)))
  ;
}

function calcFuelCharge(yyyymm, meterDate, kWh) {
  const [beforeFuelCharge, thisFuelCharge] = [
    getFuelCharge(yyyymm, meterDate).before,
    getFuelCharge(yyyymm, meterDate).this,
  ];

  return meterDate == 1
    ? Math.trunc(beforeFuelCharge * kWh) + Math.trunc(Number(((beforeFuelCharge * kWh) % 1).toPrecision(1)))
    : Math.trunc(thisFuelCharge * kWh) + Math.trunc(Number(((thisFuelCharge * kWh) % 1).toPrecision(1)))
  ;
}

function calcClimateCharge(yyyymm, meterDate, kWh) {
  const [beforeMonthRate, thisMonthRate] = [
    getMonthRate(yyyymm, meterDate).before,
    getMonthRate(yyyymm, meterDate).this,
  ];
  const [beforeClimateCharge, thisClimateCharge] = [
    getClimateCharge(yyyymm, meterDate).before,
    getClimateCharge(yyyymm, meterDate).this,
  ];

  const [allBeforeSum, allthisSum, allSum] = [
    kWh * beforeClimateCharge,
    kWh * thisClimateCharge,
    ((beforeMonthRate * kWh) * beforeClimateCharge) + ((thisMonthRate * kWh) * thisClimateCharge)
  ]
  
  return meterDate == 1
    ? Math.trunc(allBeforeSum) + Math.trunc(Number((allBeforeSum % 1).toPrecision(1)))
    : meterDate == 30
    ? Math.trunc(allthisSum) + Math.trunc(Number((allthisSum % 1).toPrecision(1)))
    : Math.trunc(allSum) + Math.trunc(Number((allSum % 1).toPrecision(1)))
  ;
}

function calcDemandCharge(yyyymm, meterDate, contractType, kWh) {
  const [beforeMonthRate, thisMonthRate] = [
    meterDate == 1
      ? 1
      : meterDate == 30
      ? 0
      : getMonthRate(yyyymm, meterDate).before
    ,
    meterDate == 30
      ? 1
      : meterDate == 1
      ? 0
      : getMonthRate(yyyymm, meterDate).this
  ];
  const thisMonth = Number(String(yyyymm).slice(4, 6));
	const beforeMonth = thisMonth !== 1 ? thisMonth - 1 : 12;
  const [thisDemandCharge1, thisDemandCharge2, thisDemandCharge3] = [
    getDemandCharge(yyyymm, contractType, meterDate).this[0],
    getDemandCharge(yyyymm, contractType, meterDate).this[1],
    getDemandCharge(yyyymm, contractType, meterDate).this[2]
  ];
  const [beforeDemandCharge1, beforeDemandCharge2, beforeDemandCharge3] = [
    getDemandCharge(yyyymm, contractType, meterDate).before[0],
    getDemandCharge(yyyymm, contractType, meterDate).before[1],
    getDemandCharge(yyyymm, contractType, meterDate).before[2]
  ];
  let resultBefore = 0;
  let resultThis = 0;
  if(beforeMonth == 7 || beforeMonth == 8) {
		resultBefore = kWh <= 300 
      ? beforeDemandCharge1 * beforeMonthRate
      : kWh <= 450
      ? beforeDemandCharge2 * beforeMonthRate
      : beforeDemandCharge3 * beforeMonthRate
    ;
  } else {
    resultBefore = kWh <= 200
      ? beforeDemandCharge1 * beforeMonthRate
      : kWh <= 400
      ? beforeDemandCharge2 * beforeMonthRate
      : beforeDemandCharge3 * beforeMonthRate
    ;
  }
  if(thisMonth == 7 || thisMonth == 8) {
		resultThis = kWh <= 300 
    ? thisDemandCharge1 * thisMonthRate
      : kWh <= 450
      ? thisDemandCharge2 * thisMonthRate
      : thisDemandCharge3 * thisMonthRate
    ;
  } else {
    resultThis = kWh <= 200
    ? thisDemandCharge1 * thisMonthRate
      : kWh <= 400
      ? thisDemandCharge2 * thisMonthRate
      : thisDemandCharge3 * thisMonthRate
    ;
  }
  
  return meterDate == 1
    ? Math.trunc(resultBefore) + Math.trunc(Number((resultBefore % 1).toPrecision(1)))
    : meterDate == 30
    ? Math.trunc(resultThis) + Math.trunc(Number((resultThis % 1).toPrecision(1)))
    : Math.trunc(resultBefore + resultThis) + Math.trunc(Number(((resultBefore + resultThis) % 1).toPrecision(1)))
  ; 
}

function calcElecCharge(yyyymm, meterDate, contractType, kWh) {
  return calcDemandCharge(yyyymm, meterDate, contractType, kWh) // 기본요금
    + calcEnergyCharge(yyyymm, meterDate, contractType, kWh) // 전력량요금
    + calcClimateCharge(yyyymm, meterDate, kWh) // 기후환경요금
    + calcFuelCharge(yyyymm, meterDate, kWh) // 연료비조정요금
  ;
}

// [역산] 전력량요금 -> 전력량
function calcConsumption(yyyymm, meterDate, contractType, energyCharge) {
  const [beforeMonthRate, thisMonthRate] = [
    meterDate == 1
      ? 1
      : meterDate == 30
      ? 0
      : getMonthRate(yyyymm, meterDate).before
    ,
    meterDate == 30
      ? 1
      : meterDate == 1
      ? 0
      : getMonthRate(yyyymm, meterDate).this
  ];
	const [
		beforeIntervalCharge1,
		beforeIntervalCharge2,
		beforeIntervalCharge3,
		beforeIntervalCharge4
	] = [
		getIntervalCharge(contractType, yyyymm, meterDate).before[0],
		getIntervalCharge(contractType, yyyymm, meterDate).before[1],
		getIntervalCharge(contractType, yyyymm, meterDate).before[2],
	  getIntervalCharge(contractType, yyyymm, meterDate).before[3]
	];
	const [
		thisIntervalCharge1,
		thisIntervalCharge2,
		thisIntervalCharge3,
		thisIntervalCharge4
	] = [
		getIntervalCharge(contractType, yyyymm, meterDate).this[0],
		getIntervalCharge(contractType, yyyymm, meterDate).this[1],
		getIntervalCharge(contractType, yyyymm, meterDate).this[2],
    getIntervalCharge(contractType, yyyymm, meterDate).this[3]
	];
  const mm = Number(String(yyyymm).slice(4, 6));
  const beforeMm = mm !== 1 ? mm - 1 : 12;
  const [actualCharge200, actualCharge300, actualCharge400, actualCharge450, actualCharge1000, actualChargeOver1000] = [
    ((beforeIntervalCharge1 * beforeMonthRate) + (thisIntervalCharge1 * thisMonthRate)),
    beforeMm == 6
      ? ((beforeIntervalCharge2 * beforeMonthRate) + (thisIntervalCharge1 * thisMonthRate))
      : beforeMm == 7
      ? ((beforeIntervalCharge1 * beforeMonthRate) + (thisIntervalCharge1 * thisMonthRate))
      : beforeMm == 8
      ? ((beforeIntervalCharge1 * beforeMonthRate) + (thisIntervalCharge2 * thisMonthRate))
      : ((beforeIntervalCharge2 * beforeMonthRate) + (thisIntervalCharge2 * thisMonthRate))
    ,
    ((beforeIntervalCharge2 * beforeMonthRate) + (thisIntervalCharge2 * thisMonthRate)),
    beforeMm == 6
      ? ((beforeIntervalCharge3 * beforeMonthRate) + (thisIntervalCharge2 * thisMonthRate))
      : beforeMm == 7
      ? ((beforeIntervalCharge2 * beforeMonthRate) + (thisIntervalCharge2 * thisMonthRate))
      : beforeMm == 8
      ? ((beforeIntervalCharge2 * beforeMonthRate) + (thisIntervalCharge3 * thisMonthRate))
      : ((beforeIntervalCharge3 * beforeMonthRate) + (thisIntervalCharge3 * thisMonthRate))
    ,
    ((beforeIntervalCharge3 * beforeMonthRate) + (thisIntervalCharge3 * thisMonthRate)),
    ((beforeIntervalCharge4 * beforeMonthRate) + (thisIntervalCharge4 * thisMonthRate))
  ];
  const [targetSum200, targetSum300, targetSum400, targetSum450, targetSum1000] = [
    actualCharge200 * 200,
    actualCharge300 * 100,
    actualCharge400 * 100,
    actualCharge450 * 50,
    actualCharge1000 * 550
  ];

  return energyCharge < targetSum200
    ? Math.ceil(energyCharge / actualCharge200)
    : energyCharge < targetSum200 + targetSum300
    ? Math.ceil((energyCharge - (targetSum200)) / actualCharge300) + 200
    : energyCharge < targetSum200 + targetSum300 + targetSum400
    ? Math.ceil((energyCharge - (targetSum200 + targetSum300)) / actualCharge400) + 300
    : energyCharge < targetSum200 + targetSum300 + targetSum400 + targetSum450
    ? Math.ceil((energyCharge - (targetSum200 + targetSum300 + targetSum400)) / actualCharge450) + 400
    : energyCharge < targetSum200 + targetSum300 + targetSum400 + targetSum450 + targetSum1000
    ? Math.ceil((energyCharge - (targetSum200 + targetSum300 + targetSum400 + targetSum450)) / actualCharge1000) + 450
    : Math.ceil((energyCharge - (targetSum200 + targetSum300 + targetSum400 + targetSum450 + targetSum1000)) / actualChargeOver1000) + 1000
  ;
}

function calcVat(yyyymm, meterDate, contractType, kWh) {
  return Math.floor(calcElecCharge(yyyymm, meterDate, contractType, kWh) * 0.1);
}

function calcPowerFund(yyyymm, meterDate, contractType, kWh) {
  return Math.floor(calcElecCharge(yyyymm, meterDate, contractType, kWh) * 0.037);
}

function calcTotalElecCharge(yyyymm, meterDate, contractType, kWh) {
  return calcElecCharge(yyyymm, meterDate, contractType, kWh) + calcVat(yyyymm, meterDate, contractType, kWh) + calcPowerFund(yyyymm, meterDate, contractType, kWh);
}