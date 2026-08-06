/* ===========================
   JBX VEHICLE CONFIGURATION
=========================== */

const vehicles = {

    vios:{

        name:"Toyota Vios XLE AT",

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

        halfDay:1700,

        regular:{
            groupA:2500,
            groupB:3000,
            groupC:3200,
            groupD:3700
        }

    }

};

/* ===========================
   DESTINATION GROUPS
=========================== */

const groupA=[
"Metro Manila","Batangas","Cavite","Rizal",
"Pampanga","Bataan","Tarlac",
"Nueva Ecija","Bulacan","Laguna",
"Zambales","Aurora"
];

const groupB=[
"Pangasinan",
"Nueva Vizcaya",
"Quirino",
"La Union",
"Benguet",
"Quezon",
"Camarines Norte"
];

const groupC=[
"Ilocos Sur",
"Ifugao",
"Mountain Province",
"Isabela",
"Abra",
"Kalinga",
"Camarines Sur"
];

const groupD=[
"Ilocos Norte",
"Apayao",
"Cagayan",
"Albay",
"Sorsogon"
];

function getRate(vehicle, rentalType, province){

    if(rentalType=="half"){

        return vehicles[vehicle].halfDay;

    }

    if(groupA.includes(province))
        return vehicles[vehicle].regular.groupA;

    if(groupB.includes(province))
        return vehicles[vehicle].regular.groupB;

    if(groupC.includes(province))
        return vehicles[vehicle].regular.groupC;

    if(groupD.includes(province))
        return vehicles[vehicle].regular.groupD;

    return 0;

}

const deliveryFees={

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

function getDeliveryFee(city){

    if(deliveryFees[city]){

        return deliveryFees[city];

    }

    return 0;

}

let currentStep = 1;

function showStep(step){

    document.querySelectorAll(".step").forEach(s=>{

        s.classList.remove("active");

    });

    document.getElementById("step"+step).classList.add("active");

    document.getElementById("currentStep").innerHTML = step;

    document.getElementById("progressFill").style.width =

    (step/3*100)+"%";

}

document.getElementById("next1").onclick=function(){

    currentStep=2;

    showStep(currentStep);

}

document.getElementById("back1").onclick=function(){

    currentStep=1;

    showStep(currentStep);

}

document.getElementById("next2").onclick=function(){

    currentStep=3;

    showStep(currentStep);

}

document.getElementById("back2").onclick=function(){

    currentStep=2;

    showStep(currentStep);

}

showStep(1);
