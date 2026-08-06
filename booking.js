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
