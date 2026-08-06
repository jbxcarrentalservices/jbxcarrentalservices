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
"Zambales",
"Aurora"
];

const GROUP_B = [
"Pangasinan",
"Nueva Vizcaya",
"Quirino",
"La Union",
"Benguet",
"Quezon",
"Camarines Norte"
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
