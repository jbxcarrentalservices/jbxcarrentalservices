/* ======================================
   JBX BOOKING PAGE
====================================== */

/* ---------- STEP WIZARD ---------- */

let currentStep = 1;

function showStep(step){

    document.querySelectorAll(".step").forEach(section=>{

        section.classList.remove("active");

    });

    document.getElementById("step"+step).classList.add("active");

    document.getElementById("currentStep").textContent = step;

    document.getElementById("progressFill").style.width =
        (step/3*100)+"%";

}

showStep(1);

/* ---------- BUTTONS ---------- */

document.getElementById("next1").onclick=()=>{

    currentStep=2;

    showStep(currentStep);

};

document.getElementById("back1").onclick=()=>{

    currentStep=1;

    showStep(currentStep);

};

document.getElementById("next2").onclick=()=>{

    currentStep=3;

    showStep(currentStep);

};

document.getElementById("back2").onclick=()=>{

    currentStep=2;

    showStep(currentStep);

};

/* ======================================
   MAIN CALCULATOR
====================================== */

function calculateBooking(){

    /* VEHICLE */

    const vehicle =
        document.getElementById("vehicle").value;

    const rentalType =
        document.getElementById("rentalType").value;

    const province =
        document.getElementById("province").value;

    const rate =
        getRentalRate(vehicle,rentalType,province);

    /* DATES */

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

    /* RENTAL */

    const rentalFee =
        rentalDays * rate;

    /* DELIVERY */

    const deliveryMethod =
        document.getElementById("deliveryMethod").value;

    const deliveryCity =
        document.getElementById("deliveryCity").value;

    const pickupMethod =
        document.getElementById("pickupMethod").value;

    const pickupCity =
        document.getElementById("pickupCity").value;

    const deliveryFee =
        calculateDeliveryFee(
            deliveryMethod,
            deliveryCity
        );

    const pickupFee =
        calculatePickupFee(
            pickupMethod,
            pickupCity
        );

    /* OTHER FEES */

    const carWashFee =
        CONFIG.carWashFee;

    const lateNightFee = 0;

    /* TOTAL */

    const total =
        rentalFee +
        deliveryFee +
        pickupFee +
        carWashFee +
        lateNightFee;

    /* SUMMARY */

    document.getElementById("sumVehicle").textContent =
        VEHICLES[vehicle].name;

    document.getElementById("sumRental").textContent =
        rentalType=="half"
        ? "Half Day (12 Hours)"
        : "Regular (24 Hours)";

    document.getElementById("sumDestination").textContent =
        province || "-";

    document.getElementById("sumDays").textContent =
        rentalDays;

    document.getElementById("sumRentalFee").textContent =
        "₱"+rentalFee.toLocaleString();

    document.getElementById("sumCarWash").textContent =
        "₱"+carWashFee.toLocaleString();

    document.getElementById("sumDelivery").textContent =
        "₱"+deliveryFee.toLocaleString();

    document.getElementById("sumPickup").textContent =
        "₱"+pickupFee.toLocaleString();

    document.getElementById("sumLateNight").textContent =
        "₱"+lateNightFee.toLocaleString();

    document.getElementById("sumTotal").textContent =
        "₱"+total.toLocaleString();

}

/* ======================================
   EVENT LISTENERS
====================================== */

[
"vehicle",
"rentalType",
"province",
"pickupDate",
"returnDate",
"pickupTime",
"returnTime",
"deliveryMethod",
"deliveryCity",
"pickupMethod",
"pickupCity"

].forEach(id=>{

    const element=document.getElementById(id);

    if(element){

        element.addEventListener("change",calculateBooking);

    }

});

/* ======================================
   INITIAL LOAD
====================================== */

calculateBooking();
