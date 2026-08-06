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

function calculateBooking(){

    const vehicle=document.getElementById("vehicle").value;

    const rentalType=document.getElementById("rentalType").value;

    const province=document.getElementById("province").value;

    const rate=getRentalRate(vehicle,rentalType,province);

document.getElementById("sumVehicle").textContent =
    VEHICLES[vehicle].name;

document.getElementById("sumRental").textContent =
    rentalType === "half"
        ? "Half Day (12 Hours)"
        : "Regular (24 Hours)";

document.getElementById("sumDestination").textContent =
    province || "-";

document.getElementById("sumRentalFee").textContent =
    "₱" + rate.toLocaleString();

const pickupDate =
    document.getElementById("pickupDate").value;

const returnDate =
    document.getElementById("returnDate").value;

let rentalDays = 0;

if(pickupDate && returnDate){

    const start = new Date(pickupDate);

    const end = new Date(returnDate);

    rentalDays = Math.ceil(
        (end-start)/(1000*60*60*24)
    );

    if(rentalDays < 1){

        rentalDays = 1;

    }

}

document.getElementById("sumDays").textContent =
    rentalDays;

const rentalFee = rate * rentalDays;

const carWashFee = CONFIG.carWashFee;

document.getElementById("sumRentalFee").textContent =
    "₱" + rentalFee.toLocaleString();

}

document.getElementById("vehicle").onchange=calculateBooking;

document.getElementById("rentalType").onchange=calculateBooking;

document.getElementById("province").onchange=calculateBooking;

document.getElementById("pickupDate").onchange =
    calculateBooking;

document.getElementById("returnDate").onchange =
    calculateBooking;
