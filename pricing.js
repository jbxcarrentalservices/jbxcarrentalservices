/* ======================================
   JBX CAR RENTAL CONFIGURATION
====================================== */

const CONFIG={

    businessName:"JBX Car Rental Services",

    messengerURL:"https://m.me/JBXCarRentalServices",

    officeAddress:"Perpetual Village, Brgy. Bagong Tanyag, Taguig City",

    nightCharge:100,

    perKmCharge:25

};

/* ======================================
   VEHICLES
====================================== */

const VEHICLES={

    vios:{

        name:"Toyota Vios XLE AT",

        seats:5,

        halfDay:1300,

        regular:{

            groupA:1800,

            groupB:2300,

            groupC:2500,

            groupD:3000

        }

    },

    xpander:{

        name:"Mitsubishi Xpander GLX AT",

        seats:7,

        halfDay:1700,

        regular:{

            groupA:2500,

            groupB:3000,

            groupC:3200,

            groupD:3700

        }

    }

};

/* ======================================
   DESTINATION GROUPS
====================================== */

const GROUPS={

groupA:[
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
],

groupB:[
"Pangasinan",
"Nueva Vizcaya",
"Quirino",
"La Union",
"Benguet",
"Quezon",
"Camarines Norte"
],

groupC:[
"Ilocos Sur",
"Ifugao",
"Mountain Province",
"Isabela",
"Abra",
"Kalinga",
"Camarines Sur"
],

groupD:[
"Ilocos Norte",
"Apayao",
"Cagayan",
"Albay",
"Sorsogon"
]

};

/* ======================================
   DELIVERY FEES
====================================== */

const DELIVERY={

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

/* ======================================
   FIND PROVINCE GROUP
====================================== */

function getProvinceGroup(province){

    if(GROUPS.groupA.includes(province)) return "groupA";

    if(GROUPS.groupB.includes(province)) return "groupB";

    if(GROUPS.groupC.includes(province)) return "groupC";

    if(GROUPS.groupD.includes(province)) return "groupD";

    return null;

}

/* ======================================
   RENTAL RATE
====================================== */

function getRentalRate(vehicle,rentalType,province){

    const group=getProvinceGroup(province);

    if(!group) return 0;

    if(rentalType=="half"){

        return VEHICLES[vehicle].halfDay;

    }

    return VEHICLES[vehicle].regular[group];

}

/* ======================================
   DELIVERY FEE
====================================== */

function getDeliveryFee(city){

    return DELIVERY[city] || 0;

}
