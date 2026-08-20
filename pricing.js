/* ==========================================
   JBX CAR RENTAL SERVICES
   PRICING CONFIGURATION
========================================== */

const CONFIG = {
    carWashFee: 200,
    lateNightFee: 100,
    perKmRate: 25
};

/* ==========================================
   VEHICLES
========================================== */

const VEHICLES = {

    vios: {
        name: "Toyota Vios XLE AT (5-Seater)",
        halfDay: 1300,
        regular: {
            groupA: 1800,
            groupB: 2300,
            groupC: 2500,
            groupD: 3000
        }
    },

    xpander: {
        name: "Mitsubishi Xpander GLX AT (7-Seater)",
        halfDay: 1700,
        regular: {
            groupA: 2500,
            groupB: 3000,
            groupC: 3200,
            groupD: 3700
        }
    }

};

/* ==========================================
   EXCESS HOUR RATES
========================================== */

const VIOS_EXCESS_RATES = {
    1: 200,
    2: 400,
    3: 600,
    4: 800,
    5: 1000,
    6: 1000,
    7: 1000,
    8: 1000,
    9: 1000,
    10: 1000,
    11: 1000,
    12: 1000,
    13: 1200,
    14: 1400,
    15: 1600,
    16: 1800,
    17: 1800,
    18: 1800,
    19: 1800,
    20: 1800,
    21: 1800,
    22: 1800,
    23: 1800
};

const XPANDER_EXCESS_RATES = {
    1: 250,
    2: 500,
    3: 750,
    4: 1000,
    5: 1250,
    6: 1500,
    7: 1500,
    8: 1500,
    9: 1500,
    10: 1500,
    11: 1500,
    12: 1500,
    13: 1750,
    14: 2000,
    15: 2250,
    16: 2500,
    17: 2500,
    18: 2500,
    19: 2500,
    20: 2500,
    21: 2500,
    22: 2500,
    23: 2500
};

/* ==========================================
   RENTAL PROMOTIONS
========================================== */

const PROMOS = {

    vios: {
        freeCarWashDays: 4,
        freeDeliveryDays: 5,
        freePickupDays: 6
    },

    xpander: {
        freeCarWashDays: 3,
        freeDeliveryDays: 4,
        freePickupDays: 5
    }

};

/* ==========================================
   DESTINATION GROUPS
========================================== */

const GROUP_A = [
"Metro Manila",
"Batangas",
"Cavite",
"Rizal",
"Pampanga",
"Bataan",
"Tarlac",
"Nueva Ecija",
"Bulacan",
"Laguna",
"Zambales"
];

const GROUP_B = [
"Pangasinan",
"Nueva Vizcaya",
"Quirino",
"La Union",
"Benguet",
"Quezon",
"Camarines Norte",
"Aurora"
];

const GROUP_C = [
"Ilocos Sur",
"Ifugao",
"Mountain Province",
"Isabela",
"Abra",
"Kalinga",
"Camarines Sur"
];

const GROUP_D = [
"Ilocos Norte",
"Apayao",
"Cagayan",
"Albay",
"Sorsogon"
];

/* ==========================================
   DELIVERY / PICKUP FEES
========================================== */

const DELIVERY_FEES = {

    "Parañaque":200,
    "Taguig":250,
    "Muntinlupa":275,
    "Pasay":300,
    "Las Piñas":375,
    "Makati":325,
    "Pateros":325,
    "Taytay":400,
    "Manila":500,
    "Cainta":500,
    "Quezon City":700

};

/* ==========================================
   RENTAL RATE
========================================== */

function getRentalRate(vehicle, rentalType, province){

    if(!VEHICLES[vehicle]) return 0;

    if(rentalType==="half"){

        return GROUP_A.includes(province)
            ? VEHICLES[vehicle].halfDay
            : 0;

    }

    if(GROUP_A.includes(province))
        return VEHICLES[vehicle].regular.groupA;

    if(GROUP_B.includes(province))
        return VEHICLES[vehicle].regular.groupB;

    if(GROUP_C.includes(province))
        return VEHICLES[vehicle].regular.groupC;

    if(GROUP_D.includes(province))
        return VEHICLES[vehicle].regular.groupD;

    return 0;

}

/* ==========================================
   HALF DAY CHECK
========================================== */

function isHalfDayAvailable(province){

    return GROUP_A.includes(province);

}

/* ==========================================
   DELIVERY FEE
========================================== */

function calculateDeliveryFee(method, city){

    if(method!=="delivery") return 0;

    return DELIVERY_FEES[city] || 0;

}

/* ==========================================
   PICKUP FEE
========================================== */

function calculatePickupFee(method, city){

    if(method!=="pickup") return 0;

    return DELIVERY_FEES[city] || 0;

}

/* ==========================================
   LATE NIGHT FEE
========================================== */

function calculateLateNightFee(time){

    if(!time) return 0;

    const hour=parseInt(time.split(":")[0]);

    return (hour>=22 || hour<4)
        ? CONFIG.lateNightFee
        : 0;

}

/* ==========================================
   FORMAT PESO
========================================== */

function formatPeso(value){

    return "₱" + Number(value).toLocaleString("en-PH");

}
