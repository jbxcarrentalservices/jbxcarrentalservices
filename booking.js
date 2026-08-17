/* ==========================================
   JBX BOOKING SYSTEM
========================================== */

/* ==========================================
   GOOGLE CALENDAR
========================================== */

let calendarData = {};

const CALENDAR_ID = "jbxcarrentalservices@gmail.com";
const GOOGLE_API_KEY = "AIzaSyDjGmJn7gTvpENVph4I8H9Z_its_a2K-e4";
const VEHICLE_CODES = {
    vios: "VIOS",
    xpander: "XPANDER"
};

async function checkVehicleAvailability(){

const vehicleCode =
    VEHICLE_CODES[
        document.getElementById("vehicle").value
    ];

    const pickup =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    if(!pickup || !returnDate) return;

    const start = new Date(pickup);

    const end = new Date(returnDate);

    const events =
        calendarData.items || [];

    let booked = false;

    events.forEach(event=>{

        if(!event.summary) return;

       console.log("Selected Vehicle:", vehicle);
console.log("Calendar Vehicle:", event.summary);

if (!event.summary.startsWith(vehicleCode)) return;

const eventStart = new Date(
    event.start.date || event.start.dateTime
);

const eventEnd = new Date(
    event.end.date || event.end.dateTime
);

// make the user's return date inclusive
end.setDate(end.getDate() + 1);

console.log("User Start:", start);
console.log("User End:", end);

console.log("Event Start:", eventStart);
console.log("Event End:", eventEnd);

if (start < eventEnd && end > eventStart) {
    booked = true;
}

    });

    const notice =
        document.getElementById("availabilityNotice");

   if(!notice) return;
   
    if(booked){

        notice.style.display="block";

        notice.style.background="#ffe5e5";

        notice.style.color="#c40000";

        notice.innerHTML="❌ This vehicle is already booked on the selected dates.";

    }

    else{

        notice.style.display="block";

        notice.style.background="#e9ffe9";

        notice.style.color="#008000";

        notice.innerHTML="✅ Vehicle is available.";

    }

}
async function getBookedDates() {

    const now = new Date().toISOString();

    const url =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
        `key=${GOOGLE_API_KEY}` +
        `&singleEvents=true` +
        `&orderBy=startTime` +
        `&timeMin=${now}`;

    try {

        const response = await fetch(url);

        const data = await response.json();

calendarData = data;

console.log("Calendar Events:", data);

return data.items || [];

    } catch (err) {

        console.error(err);

        return [];

    }

}

// -------------------------
// STEP WIZARD
// -------------------------

let currentStep = 1;

showStep(currentStep);

function showStep(step){

    document.querySelectorAll(".step").forEach(section=>{

        section.classList.remove("active");

    });

    document.getElementById("step"+step).classList.add("active");

    document.getElementById("currentStep").textContent = step;

    document.getElementById("progressFill").style.width =
    (step/3*100)+"%";

}

// -------------------------
// STEP BUTTONS
// -------------------------

document.getElementById("next1").onclick=function(){

    if(!validateStep1()) return;

    currentStep=2;

    showStep(currentStep);

};

document.getElementById("back1").onclick=function(){

    currentStep=1;

    showStep(currentStep);

};

document.getElementById("next2").onclick=function(){

    if(!validateStep2()) return;

    calculateBooking();

    currentStep=3;

    showStep(currentStep);

};

document.getElementById("back2").onclick=function(){

    currentStep=2;

    showStep(currentStep);

};

// -------------------------
// DELIVERY SECTION
// -------------------------

function toggleDeliverySection(){

    const deliveryMethod =
    document.getElementById("deliveryMethod").value;

    const deliverySection =
    document.getElementById("deliverySection");

    if(deliveryMethod=="delivery"){

        deliverySection.style.display="block";

    }else{

        deliverySection.style.display="none";

    }

}

function togglePickupSection(){

    const pickupMethod =
    document.getElementById("pickupMethod").value;

    const pickupSection =
    document.getElementById("pickupSection");

    if(pickupMethod=="pickup"){

        pickupSection.style.display="block";

    }else{

        pickupSection.style.display="none";

    }

}

document.getElementById("deliveryMethod")
.addEventListener("change",toggleDeliverySection);

document.getElementById("pickupMethod")
.addEventListener("change",togglePickupSection);

toggleDeliverySection();

// -------------------------
// STEP 1 VALIDATION
// -------------------------

function validateStep1(){

    if(document.getElementById("vehicle").value==""){

        alert("Please select a vehicle.");

        return false;

    }

    if(document.getElementById("pickupDate").value==""){

        alert("Please select pickup date.");

        return false;

    }

    if(document.getElementById("returnDate").value==""){

        alert("Please select return date.");

        return false;

    }

    if(document.getElementById("province").value==""){

        alert("Please select destination.");

        return false;

    }

    return true;

}

// -------------------------
// STEP 2 VALIDATION
// -------------------------

function validateStep2(){

    if(document.getElementById("customerName").value==""){

        alert("Please enter your full name.");

        return false;

    }

    if(document.getElementById("customerPhone").value==""){

        alert("Please enter your contact number.");

        return false;

    }

    if(document.getElementById("licenseNumber").value==""){

        alert("Please enter your driver's license number.");

        return false;

    }

    return true;

}

// -------------------------
// RENTAL DAYS
// -------------------------

function getRentalDays(){

    const pickup =
    document.getElementById("pickupDate").value;

    const returnDate =
    document.getElementById("returnDate").value;

    if(!pickup || !returnDate){

        return 0;

    }

    const start = new Date(pickup);

    const end = new Date(returnDate);

    let days = Math.ceil(

        (end-start)/(1000*60*60*24)

    );

    if(days<1){

        days=1;

    }

    return days;

}

// -------------------------
// BOOKING CALCULATOR
// -------------------------

function calculateBooking(){

    const vehicle =
    document.getElementById("vehicle").value;

    const rentalType =
    document.getElementById("rentalType").value;

    const province =
    document.getElementById("province").value;

    const rate =
    getRentalRate(vehicle,rentalType,province);

    const days =
    getRentalDays();

    const rentalFee =
    rate * days;

    const deliveryFee =
    calculateDeliveryFee(

        document.getElementById("deliveryMethod").value,

        document.getElementById("deliveryCity").value

    );

    const pickupFee =
    calculatePickupFee(

        document.getElementById("pickupMethod").value,

        document.getElementById("pickupCity").value

    );

    // Charge late-night fee for BOTH delivery and pickup times
    const pickupLateNight =
    calculateLateNightFee(

        document.getElementById("pickupTime").value

    );

    const returnLateNight =
    calculateLateNightFee(

        document.getElementById("returnTime").value

    );

    const lateNightFee =
    pickupLateNight + returnLateNight;

    const carWashFee =
    CONFIG.carWashFee;

    const total =

        rentalFee +

        deliveryFee +

        pickupFee +

        carWashFee +

        lateNightFee;

    // -------------------------
    // UPDATE SUMMARY
    // -------------------------

    document.getElementById("sumVehicle").textContent =
    VEHICLES[vehicle].name;

    document.getElementById("sumRental").textContent =

    rentalType=="half"

    ?

    "Half Day (12 Hours)"

    :

    "Regular (24 Hours)";

    document.getElementById("sumDestination").textContent =
    province || "-";

    document.getElementById("sumDays").textContent =
    days;

    document.getElementById("sumRentalFee").textContent =
    "₱"+rentalFee.toLocaleString();

    document.getElementById("sumDelivery").textContent =
    "₱"+deliveryFee.toLocaleString();

    document.getElementById("sumPickup").textContent =
    "₱"+pickupFee.toLocaleString();

    document.getElementById("sumCarWash").textContent =
    "₱"+carWashFee.toLocaleString();

    document.getElementById("sumLateNight").textContent =
    "₱"+lateNightFee.toLocaleString();

    document.getElementById("sumTotal").textContent =
    "₱"+total.toLocaleString();

}

// -------------------------
// LIVE UPDATE
// -------------------------

const fields = [

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

];

fields.forEach(id=>{

    const element=document.getElementById(id);

    if(element){

        element.addEventListener("change", () => {

            calculateBooking();

            checkVehicleAvailability();

        });

    }

});

// -------------------------
// MESSENGER BOOKING
// -------------------------

document.getElementById("bookMessenger").onclick=function(){

    calculateBooking();

    const vehicle =
        VEHICLES[document.getElementById("vehicle").value].name;

    const rentalType =
        document.getElementById("rentalType").value=="half"
        ? "Half Day (12 Hours)"
        : "Regular (24 Hours)";

    const message =

`Hello JBX Car Rental Services!

I would like to book a vehicle.

========================

Vehicle:
${vehicle}

Rental Type:
${rentalType}

Pickup Date:
${document.getElementById("pickupDate").value}

Return Date:
${document.getElementById("returnDate").value}

Pickup Time:
${document.getElementById("pickupTime").value}

Return Time:
${document.getElementById("returnTime").value}

Destination:
${document.getElementById("province").value}

Delivery:
${document.getElementById("deliveryMethod").value}

Delivery City:
${document.getElementById("deliveryCity").value}

Vehicle Return:
${document.getElementById("pickupMethod").value}

Pickup City:
${document.getElementById("pickupCity").value}

========================

Estimated Rental Fee:
${document.getElementById("sumRentalFee").textContent}

Delivery Fee:
${document.getElementById("sumDelivery").textContent}

Pickup Fee:
${document.getElementById("sumPickup").textContent}

Car Wash Fee:
${document.getElementById("sumCarWash").textContent}

Late Night Fee:
${document.getElementById("sumLateNight").textContent}

TOTAL:
${document.getElementById("sumTotal").textContent}

========================

Customer Information

Name:
${document.getElementById("customerName").value}

Contact Number:
${document.getElementById("customerPhone").value}

Email:
${document.getElementById("customerEmail").value}

Thank you!`;

    window.open(

        "https://m.me/JBXCarRentalServices?text="+
        encodeURIComponent(message),

        "_blank"

    );

};

// -------------------------
// INITIAL LOAD
// -------------------------

toggleDeliverySection();

togglePickupSection();

calculateBooking();

(async () => {

    await getBookedDates();

    checkVehicleAvailability();

})();
