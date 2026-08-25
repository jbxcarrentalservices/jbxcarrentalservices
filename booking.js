/* ==========================================
   JBX BOOKING SYSTEM
========================================== */

let vehicleIsBooked = false;

/* ==========================================
   GOOGLE CALENDAR
========================================== */

let calendarData = {};
let calendarLoaded = false;

const CALENDAR_ID = "jbxcarrentalservices@gmail.com";
const GOOGLE_API_KEY = "AIzaSyDjGmJn7gTvpENVph4I8H9Z_its_a2K-e4";
const VEHICLE_CODES = {
    vios: "VIOS",
    xpander: "XPANDER"
};

async function checkVehicleAvailability(){

    const selectedVehicle =
        document.getElementById("vehicle").value;

    const pickup =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;

    const notice =
        document.getElementById("availabilityNotice");

   // Wait for Google Calendar data to finish loading
if(!calendarLoaded){

    if(notice){

        notice.style.display = "block";
        notice.style.background = "#f7f7f7";
        notice.style.color = "#555";

        notice.innerHTML =
            "⏳ Checking vehicle availability...";

    }

    await getBookedDates();

}

    // Wait until all date and time fields are entered
    if(
        !pickup ||
        !returnDate ||
        !pickupTime ||
        !returnTime
    ){

        vehicleIsBooked = false;

        if(notice){
            notice.style.display = "none";
        }

        return;

    }

    const userStart =
        new Date(`${pickup}T${pickupTime}`);

    const userEnd =
        new Date(`${returnDate}T${returnTime}`);

    const events =
        calendarData.items || [];


    // --------------------------------
    // CHECK ONE VEHICLE
    // --------------------------------

    function isVehicleAvailable(vehicleCode){

        let booked = false;

        events.forEach(event => {

            if(!event.summary) return;

            if(!event.summary.startsWith(vehicleCode)){
                return;
            }

            let eventStart =
                new Date(
                    event.start.dateTime ||
                    event.start.date
                );

            let eventEnd =
                new Date(
                    event.end.dateTime ||
                    event.end.date
                );


            // 2-hour buffer BEFORE reservation
            eventStart.setHours(
                eventStart.getHours() - 2
            );


            // 2-hour buffer AFTER reservation
            eventEnd.setHours(
                eventEnd.getHours() + 2
            );


            // Actual date + time overlap
            if(
                userStart < eventEnd &&
                userEnd > eventStart
            ){

                booked = true;

            }

        });

        return !booked;

    }


    // --------------------------------
    // CHECK SELECTED VEHICLE
    // --------------------------------

    const selectedCode =
        VEHICLE_CODES[selectedVehicle];

    const selectedAvailable =
        isVehicleAvailable(selectedCode);


    // --------------------------------
    // DETERMINE OTHER VEHICLE
    // --------------------------------

    const otherVehicle =
        selectedVehicle === "vios"
            ? "xpander"
            : "vios";

    const otherCode =
        VEHICLE_CODES[otherVehicle];

    const otherAvailable =
        isVehicleAvailable(otherCode);


    // --------------------------------
    // SELECTED VEHICLE AVAILABLE
    // --------------------------------

    if(selectedAvailable){

        vehicleIsBooked = false;

        if(notice){

            notice.style.display = "block";

            notice.style.background = "#e9ffe9";

            notice.style.color = "#008000";

            notice.innerHTML =
                "✅ " +
                (selectedVehicle === "vios"
                    ? "Vios"
                    : "Xpander") +
                " is available for the selected date and time.";

        }

        return;

    }


    // --------------------------------
    // SELECTED UNAVAILABLE
    // OTHER AVAILABLE
    // --------------------------------

    if(!selectedAvailable && otherAvailable){

        vehicleIsBooked = true;

        if(notice){

            notice.style.display = "block";

            notice.style.background = "#fff4d6";

            notice.style.color = "#8a5a00";

            const otherName =
                otherVehicle === "vios"
                    ? "Vios"
                    : "Xpander";

            notice.innerHTML =

                "❌ " +
                (selectedVehicle === "vios"
                    ? "Vios"
                    : "Xpander") +
                " is unavailable for the selected date and time.<br><br>" +

                "✅ " +
                otherName +
                " is available.<br><br>" +

                `<button type="button"
                    id="switchVehicleButton"
                    style="
                        padding:12px 18px;
                        border:none;
                        border-radius:8px;
                        background:#000;
                        color:#fff;
                        font-weight:600;
                        cursor:pointer;
                    ">
                    Switch to ${otherName}
                </button>`;

            const switchButton =
                document.getElementById(
                    "switchVehicleButton"
                );

            if(switchButton){

                switchButton.onclick = function(){

                    document.getElementById(
                        "vehicle"
                    ).value = otherVehicle;

                    vehicleIsBooked = false;

                    calculateBooking();

                    checkVehicleAvailability();

                };

            }

        }

        return;

    }


    // --------------------------------
    // BOTH VEHICLES UNAVAILABLE
    // --------------------------------

    vehicleIsBooked = true;

    if(notice){

        notice.style.display = "block";

        notice.style.background = "#ffe5e5";

        notice.style.color = "#c40000";

        notice.innerHTML =

            "❌ Both Vios and Xpander are unavailable " +
            "for the selected date and time.<br><br>" +

            "Please choose another date or time.";

    }

}

let calendarPromise = null;

async function getBookedDates() {

    if(calendarLoaded && calendarData){
        return calendarData.items || [];
    }

    if(calendarPromise){
        return await calendarPromise;
    }

    const now = new Date().toISOString();

    const url =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?` +
        `key=${GOOGLE_API_KEY}` +
        `&singleEvents=true` +
        `&orderBy=startTime` +
        `&timeMin=${now}`;

    calendarPromise = fetch(url)
        .then(response => response.json())
        .then(data => {

            calendarData = data;

            calendarLoaded = true;

            console.log(
                "Calendar Events:",
                data
            );

            return data.items || [];

        })
        .catch(error => {

            console.error(
                "Calendar loading error:",
                error
            );

            calendarLoaded = false;

            calendarPromise = null;

            return [];

        });

    return await calendarPromise;
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

document.getElementById("next1").onclick=async function(){

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;

    if(!pickupTime || !returnTime){

        alert("Please enter both pickup time and return time.");

        return;

    }

    if(!validateStep1()) return;

    await checkVehicleAvailability();

    if(vehicleIsBooked){

        alert(
            "This vehicle is unavailable for the selected date and time. Please choose another time."
        );

        return;

    }

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

    return true;

}

// -------------------------
// AUTOMATIC RENTAL TYPE
// -------------------------

function getRentalType(){

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;

    if(
        !pickupDate ||
        !returnDate ||
        !pickupTime ||
        !returnTime
    ){
        return "";
    }

    const start =
        new Date(`${pickupDate}T${pickupTime}`);

    const end =
        new Date(`${returnDate}T${returnTime}`);

    const totalHours =
        (end - start) / (1000 * 60 * 60);

    if(totalHours <= 12){
        return "half";
    }

    return "regular";
}

// -------------------------
// RENTAL DURATION
// -------------------------

function getRentalDuration(){

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;

    if(
        !pickupDate ||
        !returnDate ||
        !pickupTime ||
        !returnTime
    ){
        return "";
    }

    const start =
        new Date(`${pickupDate}T${pickupTime}`);

    const end =
        new Date(`${returnDate}T${returnTime}`);

    const difference =
        end - start;

    if(difference <= 0){
        return "";
    }

    const totalHours =
        difference / (1000 * 60 * 60);

    const days =
        Math.floor(totalHours / 24);

    const hours =
        Math.floor(totalHours % 24);

    let duration = "";

    if(days > 0){

        duration +=
            days + (days === 1 ? " day" : " days");

    }

    if(hours > 0){

        if(duration !== ""){
            duration += " & ";
        }

        duration +=
            hours + " hr" + (hours === 1 ? "" : "s");

    }

    return duration || "Less than 1 hr";
}

// -------------------------
// BOOKING CALCULATOR
// -------------------------

function calculateBooking(){

    const vehicle =
        document.getElementById("vehicle").value;

    const province =
        document.getElementById("province").value;

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;


    // -------------------------
    // RESET IF NO VEHICLE
    // -------------------------

    if(!vehicle){

        const preview =
            document.getElementById("step1EstimatedTotal");

        if(preview){
            preview.textContent = "₱0";
        }

        if(document.getElementById("sumVehicle"))
            document.getElementById("sumVehicle").textContent =
                "Select Vehicle";

        if(document.getElementById("sumRental"))
            document.getElementById("sumRental").textContent =
                "-";

        if(document.getElementById("sumDestination"))
            document.getElementById("sumDestination").textContent =
                province || "-";

        if(document.getElementById("sumDays"))
            document.getElementById("sumDays").textContent =
                "0";

        return;
    }


    // -------------------------
    // DAILY RATE
    // -------------------------

    const rate =
        getRentalRate(
            vehicle,
            "regular",
            province
        );


    // -------------------------
    // CALCULATE EXACT DURATION
    // -------------------------

    let totalHours = 0;
    let fullDays = 0;
    let remainingHours = 0;
    let remainingMinutes = 0;

    if(
        pickupDate &&
        returnDate &&
        pickupTime &&
        returnTime
    ){

        const start =
            new Date(
                `${pickupDate}T${pickupTime}`
            );

        const end =
            new Date(
                `${returnDate}T${returnTime}`
            );

        totalHours =
            (end - start) /
            (1000 * 60 * 60);

        if(totalHours > 0){

            fullDays =
                Math.floor(totalHours / 24);

            const remaining =
                totalHours -
                (fullDays * 24);

            remainingHours =
                Math.floor(remaining);

            remainingMinutes =
                Math.round(
                    (remaining - remainingHours) * 60
                );

        }

    }


    // -------------------------
    // RENTAL FEE
    // -------------------------

    let rentalFee = 0;

    let excessHours =
        remainingHours;


    if(remainingMinutes > 15){
        excessHours++;
    }


    if(totalHours > 0){

        rentalFee =
            fullDays * rate;


        if(excessHours > 0){

            const excessRates =
                vehicle === "vios"
                    ? VIOS_EXCESS_RATES
                    : XPANDER_EXCESS_RATES;

            rentalFee +=
                excessRates[excessHours] || 0;

        }

    }


    // -------------------------
    // RENTAL DAYS FOR PROMOS
    // -------------------------

    let days = fullDays;

    if(totalHours > 0 && days < 1){
        days = 1;
    }


    // -------------------------
    // DELIVERY / PICKUP
    // -------------------------

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


    // -------------------------
    // LATE NIGHT
    // -------------------------

    const pickupLateNight =
        calculateLateNightFee(pickupTime);

    const returnLateNight =
        calculateLateNightFee(returnTime);

    const lateNightFee =
        pickupLateNight +
        returnLateNight;


    // -------------------------
    // PROMOTIONS
    // -------------------------

    let finalCarWashFee =
        CONFIG.carWashFee;

    let finalDeliveryFee =
        deliveryFee;

    let finalPickupFee =
        pickupFee;

    let longRentalDiscount =
        0;

    const promo =
        PROMOS[vehicle];


    if(
        promo &&
        days >= promo.freeCarWashDays
    ){

        finalCarWashFee = 0;

    }


    if(
        promo &&
        days >= promo.freeDeliveryDays &&
        province === "Metro Manila" &&
        document.getElementById("deliveryMethod").value === "delivery"
    ){

        finalDeliveryFee = 0;

    }


    if(
        promo &&
        days >= promo.freePickupDays &&
        province === "Metro Manila" &&
        document.getElementById("pickupMethod").value === "pickup"
    ){

        finalPickupFee = 0;

    }


    // -------------------------
    // 7-DAY DISCOUNT
    // -------------------------

    const freeRentalDays =
        Math.floor(days / 7);

    if(freeRentalDays > 0){

        longRentalDiscount =
            freeRentalDays * rate;

    }


    // -------------------------
    // TOTAL
    // -------------------------

    const total =
        rentalFee +
        finalDeliveryFee +
        finalPickupFee +
        finalCarWashFee +
        lateNightFee -
        longRentalDiscount;


    // -------------------------
    // STEP 1 PRICE PREVIEW
    // -------------------------

    const step1Preview =
        document.getElementById(
            "step1EstimatedTotal"
        );

    if(step1Preview){

        step1Preview.textContent =
            "₱" +
            rentalFee.toLocaleString();

    }


    // -------------------------
    // STEP 2 FEE PREVIEW
    // -------------------------

    const step2DeliveryFee =
        document.getElementById("step2DeliveryFee");

    const step2PickupFee =
        document.getElementById("step2PickupFee");

    const step2AdditionalTotal =
        document.getElementById("step2AdditionalTotal");


    if(step2DeliveryFee){

        step2DeliveryFee.textContent =
            "₱" +
            finalDeliveryFee.toLocaleString();

    }


    if(step2PickupFee){

        step2PickupFee.textContent =
            "₱" +
            finalPickupFee.toLocaleString();

    }


    if(step2AdditionalTotal){

        step2AdditionalTotal.textContent =
            "₱" +
            (
                finalDeliveryFee +
                finalPickupFee
            ).toLocaleString();

    }


    // -------------------------
    // DURATION DISPLAY
    // -------------------------

    let durationText = "-";


    if(totalHours > 0){

        const parts = [];


        if(fullDays > 0){

            parts.push(
                fullDays +
                (
                    fullDays === 1
                        ? " day"
                        : " days"
                )
            );

        }


        if(excessHours > 0){

            parts.push(
                excessHours +
                (
                    excessHours === 1
                        ? " hour"
                        : " hours"
                )
            );

        }


        if(parts.length > 0){

            durationText =
                parts.join(" & ");

        }

    }


  // -------------------------
// UPDATE SUMMARY
// -------------------------

const sumVehicle =
    document.getElementById("sumVehicle");

if(sumVehicle){
    sumVehicle.textContent =
        VEHICLES[vehicle].name;
}


const sumRental =
    document.getElementById("sumRental");

if(sumRental){
    sumRental.textContent =
        durationText;
}


const sumDestination =
    document.getElementById("sumDestination");

if(sumDestination){
    sumDestination.textContent =
        province || "-";
}


const sumDays =
    document.getElementById("sumDays");

if(sumDays){
    sumDays.textContent =
        days;
}


const sumRentalFee =
    document.getElementById("sumRentalFee");

if(sumRentalFee){
    sumRentalFee.textContent =
        "₱" +
        rentalFee.toLocaleString();
}


const sumDelivery =
    document.getElementById("sumDelivery");

if(sumDelivery){
    sumDelivery.textContent =
        "₱" +
        finalDeliveryFee.toLocaleString();
}


const sumPickup =
    document.getElementById("sumPickup");

if(sumPickup){
    sumPickup.textContent =
        "₱" +
        finalPickupFee.toLocaleString();
}


const sumCarWash =
    document.getElementById("sumCarWash");

if(sumCarWash){
    sumCarWash.textContent =
        "₱" +
        finalCarWashFee.toLocaleString();
}


const sumSpecialDiscount =
    document.getElementById("sumSpecialDiscount");

if(sumSpecialDiscount){
    sumSpecialDiscount.textContent =
        "₱" +
        longRentalDiscount.toLocaleString();
}


const sumLateNight =
    document.getElementById("sumLateNight");

if(sumLateNight){
    sumLateNight.textContent =
        "₱" +
        lateNightFee.toLocaleString();
}


const sumTotal =
    document.getElementById("sumTotal");

if(sumTotal){
    sumTotal.textContent =
        "₱" +
        total.toLocaleString();
}
   
}

// -------------------------
// PICKUP DATE MINIMUM
// -------------------------

function setPickupDateMin(){

    const pickupDate =
        document.getElementById("pickupDate");

    const today =
        new Date().toISOString().split("T")[0];

    pickupDate.min = today;

}

// -------------------------
// RETURN DATE MINIMUM
// -------------------------

function updateReturnDateMin(){

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate");

    if(!pickupDate) return;

    returnDate.min = pickupDate;

    // Clear return date if it is earlier than pickup date
    if(returnDate.value && returnDate.value < pickupDate){

        returnDate.value = "";

    }

}

// -------------------------
// LIVE UPDATE
// -------------------------

const fields = [
    "vehicle",
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


// -------------------------
// UPDATE PRICE + AVAILABILITY
// -------------------------

async function updateBookingPreview(){

    // Update price preview first
    calculateBooking();


    // Get required availability fields
    const vehicle =
        document.getElementById("vehicle").value;

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;


    // Don't check availability until
    // all required fields are complete
    if(
        !vehicle ||
        !pickupDate ||
        !returnDate ||
        !pickupTime ||
        !returnTime
    ){

        return;

    }


    // WAIT for availability check to finish
    await checkVehicleAvailability();

}

// -------------------------
// LISTEN FOR CHANGES
// -------------------------

fields.forEach(id => {

    const element =
        document.getElementById(id);

    if(!element) return;


    // Normal select/date/time change
    element.addEventListener(
        "change",
        updateBookingPreview
    );


    // Also catch direct input changes
    element.addEventListener(
        "input",
        updateBookingPreview
    );


    // Keep return-date minimum
    if(id === "pickupDate"){

        element.addEventListener(
            "change",
            updateReturnDateMin
        );

    }

});

// -------------------------
// MESSENGER BOOKING
// -------------------------

document.getElementById("bookMessenger").onclick=function(){

    calculateBooking();

    const vehicle =
        VEHICLES[document.getElementById("vehicle").value].name;

    const message =

`Hello JBX Car Rental Services!

I would like to book a vehicle.

========================

Vehicle:
${vehicle}

Rental Duration:
${document.getElementById("sumRental").textContent}

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

Delivery Address:
${document.getElementById("deliveryAddress").value}

Vehicle Return:
${document.getElementById("pickupMethod").value}

Pickup City:
${document.getElementById("pickupCity").value}

Pickup Address:
${document.getElementById("pickupAddress").value}
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

setPickupDateMin();

updateReturnDateMin();

calculateBooking();

(async () => {

    await getBookedDates();

    checkVehicleAvailability();

})();
