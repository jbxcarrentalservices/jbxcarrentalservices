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

const deliveryMethod =
    document.getElementById("deliveryMethod").value;

const deliveryCity =
    document.getElementById("deliveryCity").value;

const pickupMethod =
    document.getElementById("pickupMethod").value;

const pickupCity =
    document.getElementById("pickupCity").value;

const deliveryFee =
    calculateDeliveryFee(deliveryMethod, deliveryCity);

const pickupFee =
    calculatePickupFee(pickupMethod, pickupCity);

const carWashFee =
    CONFIG.carWashFee;

const lateNightFee = 0;

const total =
    rentalFee +
    deliveryFee +
    pickupFee +
    carWashFee +
    lateNightFee;

document.getElementById("sumRentalFee").textContent =
    "₱" + rentalFee.toLocaleString();

document.getElementById("sumCarWash").textContent =
    "₱" + carWashFee.toLocaleString();

document.getElementById("sumDelivery").textContent =
    "₱" + deliveryFee.toLocaleString();

document.getElementById("sumPickup").textContent =
    "₱" + pickupFee.toLocaleString();

document.getElementById("sumLateNight").textContent =
    "₱" + lateNightFee.toLocaleString();

document.getElementById("sumTotal").textContent =
    "₱" + total.toLocaleString();

document.getElementById("deliveryMethod").onchange =
    calculateBooking;

document.getElementById("deliveryCity").onchange =
    calculateBooking;

document.getElementById("pickupMethod").onchange =
    calculateBooking;

document.getElementById("pickupCity").onchange =
    calculateBooking;
