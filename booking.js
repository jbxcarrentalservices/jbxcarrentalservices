/* ==========================================
   JBX BOOKING SYSTEM
========================================== */

let vehicleIsBooked = false;

/* ==========================================
   GOOGLE CALENDAR
========================================== */

let calendarData = {};
let calendarLoaded = false;
let calendarPromise = null;

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


    // --------------------------------
    // WAIT FOR GOOGLE CALENDAR DATA
    // --------------------------------

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


    // --------------------------------
    // REQUIRE ALL DATE/TIME FIELDS
    // --------------------------------

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


    if(
        isNaN(userStart.getTime()) ||
        isNaN(userEnd.getTime()) ||
        userEnd <= userStart
    ){

        vehicleIsBooked = false;

        if(notice){
            notice.style.display = "none";
        }

        return;

    }


    // --------------------------------
    // CUSTOMER RENTAL DURATION
    // --------------------------------
    //
    // 24 hours = 1 day
    // 48 hours = 2 days
    // 72 hours = 3 days
    //

    const rentalHours =
        (userEnd - userStart) /
        (1000 * 60 * 60);

    const rentalDays =
        Math.floor(rentalHours / 24);


    // --------------------------------
    // DETERMINE MAXIMUM ALLOWED
    // CALENDAR CONFLICT
    // --------------------------------

    let maxConflictHours = null;


    // 3–4 days:
    // maximum 1-day conflict

    if(
        rentalDays >= 3 &&
        rentalDays <= 4
    ){

        maxConflictHours = 24;

    }


    // 5 days:
    // maximum 2-day conflict

    else if(rentalDays === 5){

        maxConflictHours = 48;

    }


    // 6 days:
    // maximum 3-day conflict

    else if(rentalDays === 6){

        maxConflictHours = 72;

    }


    // 7 days or more:
    // any conflict can be bypassed

    else if(rentalDays >= 7){

        maxConflictHours = Infinity;

    }


    const events =
        calendarData.items || [];


    // --------------------------------
    // CHECK VEHICLE WITH EXISTING
    // 2-HOUR BUFFER
    // --------------------------------

    function isVehicleAvailable(vehicleCode){

        let booked = false;


        events.forEach(event => {

            if(!event.summary) return;

            if(
                !event.summary.startsWith(vehicleCode)
            ){
                return;
            }


            // Ignore cancelled events
            if(event.status === "cancelled"){
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


            if(
                isNaN(eventStart.getTime()) ||
                isNaN(eventEnd.getTime())
            ){
                return;
            }


            // Existing 2-hour buffer
            eventStart.setHours(
                eventStart.getHours() - 2
            );

            eventEnd.setHours(
                eventEnd.getHours() + 2
            );


            // Check overlap
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
    // CALCULATE ACTUAL CONFLICT
    // WITHOUT 2-HOUR BUFFER
    // --------------------------------
    //
    // This is used ONLY for the
    // long-rental bypass.
    //

    function getConflictHours(vehicleCode){

        let conflictHours = 0;


        events.forEach(event => {

            if(!event.summary) return;

            if(
                !event.summary.startsWith(vehicleCode)
            ){
                return;
            }


            if(event.status === "cancelled"){
                return;
            }


            const eventStart =
                new Date(
                    event.start.dateTime ||
                    event.start.date
                );

            const eventEnd =
                new Date(
                    event.end.dateTime ||
                    event.end.date
                );


            if(
                isNaN(eventStart.getTime()) ||
                isNaN(eventEnd.getTime())
            ){
                return;
            }


            // Find the actual overlap
            // between customer rental
            // and calendar reservation.

            const overlapStart =
                Math.max(
                    userStart.getTime(),
                    eventStart.getTime()
                );

            const overlapEnd =
                Math.min(
                    userEnd.getTime(),
                    eventEnd.getTime()
                );


            if(overlapEnd > overlapStart){

                conflictHours +=
                    (
                        overlapEnd -
                        overlapStart
                    ) /
                    (1000 * 60 * 60);

            }

        });


        return conflictHours;

    }


    // --------------------------------
    // CHECK SELECTED VEHICLE
    // --------------------------------

    const selectedCode =
        VEHICLE_CODES[selectedVehicle];

    const selectedAvailable =
        isVehicleAvailable(selectedCode);


    // --------------------------------
    // SELECTED VEHICLE IS BOOKED
    // CHECK LONG-RENTAL BYPASS
    // --------------------------------

    if(!selectedAvailable){

        const conflictHours =
            getConflictHours(selectedCode);


        if(
            maxConflictHours !== null &&
            conflictHours > 0 &&
            conflictHours <= maxConflictHours
        ){

            // Allow the customer to continue
            vehicleIsBooked = false;


            // Do NOT show available/unavailable
            if(notice){

                notice.style.display = "none";
                notice.innerHTML = "";

            }


            return;

        }

    }


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

            notice.style.background =
                "#e9ffe9";

            notice.style.color =
                "#008000";

            notice.innerHTML =
                "✅ " +
                (
                    selectedVehicle === "vios"
                        ? "Vios"
                        : "Xpander"
                ) +
                " is available for the selected date and time.";

        }

        return;

    }


    // --------------------------------
    // SELECTED UNAVAILABLE
    // OTHER AVAILABLE
    // --------------------------------

    if(
        !selectedAvailable &&
        otherAvailable
    ){

        vehicleIsBooked = true;


        if(notice){

            notice.style.display = "block";

            notice.style.background =
                "#fff4d6";

            notice.style.color =
                "#8a5a00";


            const otherName =
                otherVehicle === "vios"
                    ? "Vios"
                    : "Xpander";


            notice.innerHTML =
                "❌ " +
                (
                    selectedVehicle === "vios"
                        ? "Vios"
                        : "Xpander"
                ) +
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

        }


        const switchButton =
            document.getElementById(
                "switchVehicleButton"
            );


        if(switchButton){

            switchButton.onclick =
                function(){

                    document.getElementById(
                        "vehicle"
                    ).value =
                        otherVehicle;


                    vehicleIsBooked = false;


                    calculateBooking();


                    checkVehicleAvailability();

                };

        }


        return;

    }


    // --------------------------------
    // BOTH VEHICLES UNAVAILABLE
    // --------------------------------

    vehicleIsBooked = true;


    if(notice){

        notice.style.display = "block";

        notice.style.background =
            "#ffe5e5";

        notice.style.color =
            "#c40000";

        notice.innerHTML =
            "❌ Both Vios and Xpander are unavailable " +
            "for the selected date and time.<br><br>" +
            "Please choose another date or time.";

    }

}

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

       const limits =
        getDateLimits();

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;


    if(pickupDate > limits.max){

        alert(
            "Pickup date cannot be more than 2 years from today."
        );

        return false;

    }


    if(returnDate > limits.max){

        alert(
            "Return date cannot be more than 2 years from today."
        );

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
// DESTINATION MINIMUM RENTAL
// -------------------------

function updateDestinationOptions(){

    const provinceSelect =
        document.getElementById("province");

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;


    if(!provinceSelect){
        return;
    }


    // Calculate actual rental hours
    let totalHours = 0;

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

    }


    // Minimum hours per group
    const minimumHours = {

        B: 36,
        C: 72,
        D: 96

    };


    // Update each province option
    Array.from(
        provinceSelect.options
    ).forEach(option => {

        const province =
            option.value;


        // Keep placeholder enabled
        if(!province){
            option.disabled = false;
            return;
        }


        let requiredHours = 0;


        if(GROUP_B.includes(province)){

            requiredHours =
                minimumHours.B;

        }
        else if(GROUP_C.includes(province)){

            requiredHours =
                minimumHours.C;

        }
        else if(GROUP_D.includes(province)){

            requiredHours =
                minimumHours.D;

        }


        // Group A or no restriction
        if(requiredHours === 0){

            option.disabled = false;

        }
        else{

            option.disabled =
                totalHours < requiredHours;

        }

    });


    // If currently selected destination
    // is no longer allowed, clear it.
    const selectedProvince =
        provinceSelect.value;


    if(selectedProvince){

        const selectedOption =
            provinceSelect.options[
                provinceSelect.selectedIndex
            ];


        if(
            selectedOption &&
            selectedOption.disabled
        ){

            provinceSelect.value = "";

            // Recalculate preview
            calculateBooking();

        }

    }

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


// -------------------------------------
// APPLY 15-MINUTE GRACE RULE
// -------------------------------------
// 15 minutes or less = no additional hour
// More than 15 minutes = count next hour

let chargeableHours =
    Math.floor(totalHours);

let chargeableMinutes =
    Math.round(
        (totalHours - chargeableHours) * 60
    );

if(chargeableMinutes > 15){
    chargeableHours++;
}

 let excessHours =
    chargeableHours - (fullDays * 24);

// -------------------------------------
// RENTAL PRICING
// -------------------------------------

if(totalHours > 0){

    // ---------------------------------
    // UP TO 12 HOURS
    // ---------------------------------

    if(chargeableHours <= 12){

        rentalFee =
            vehicle === "vios"
                ? 1300
                : 1700;

    }


    // ---------------------------------
    // 12–24 HOURS
    // ---------------------------------

    else if(chargeableHours <= 24){

        const base12 =
            vehicle === "vios"
                ? 1300
                : 1700;

        const hourlyRate =
            vehicle === "vios"
                ? 200
                : 250;

        rentalFee =
            Math.min(
                base12 +
                (
                    (chargeableHours - 12) *
                    hourlyRate
                ),
                rate
            );

    }


    // ---------------------------------
    // MORE THAN 24 HOURS
    // ---------------------------------

    else{

        // Full 24-hour rental periods
        rentalFee =
            fullDays * rate;


        // ---------------------------------
        // EXCESS-HOUR RATE BY DESTINATION
        // ---------------------------------

        if(excessHours > 0){

            let excessHourlyRate =
                vehicle === "vios"
                    ? 200
                    : 250;

            let excessCap = 0;


            // -----------------------------
            // GROUP A
            // -----------------------------

            if(GROUP_A.includes(province)){

                excessCap =
                    vehicle === "vios"
                        ? 1000
                        : 1500;

            }


            // -----------------------------
            // GROUP B
            // -----------------------------

            else if(GROUP_B.includes(province)){

                excessCap =
                    vehicle === "vios"
                        ? 1500
                        : 2000;

            }


            // -----------------------------
            // GROUP C
            // -----------------------------

            else if(GROUP_C.includes(province)){

                excessCap =
                    vehicle === "vios"
                        ? 1700
                        : 2200;

            }


            // -----------------------------
            // GROUP D
            // -----------------------------

            else if(GROUP_D.includes(province)){

                excessCap =
                    vehicle === "vios"
                        ? 2200
                        : 2700;

            }


            // Calculate excess charge
            rentalFee +=
                Math.min(
                    excessHours *
                    excessHourlyRate,
                    excessCap
                );

        }

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

    if(!province){

        step1Preview.textContent =
            "₱0";

    }else{

        step1Preview.textContent =
            "₱" +
            rentalFee.toLocaleString();

    }

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

if(
    pickupDate &&
    returnDate &&
    pickupTime &&
    returnTime
){

    const durationStart =
        new Date(
            `${pickupDate}T${pickupTime}`
        );

    const durationEnd =
        new Date(
            `${returnDate}T${returnTime}`
        );

    const durationMilliseconds =
        durationEnd - durationStart;

    if(durationMilliseconds > 0){

        const durationTotalHours =
            durationMilliseconds /
            (1000 * 60 * 60);

        const displayDays =
            Math.floor(
                durationTotalHours / 24
            );

        const displayRemainingHours =
            Math.floor(
                durationTotalHours % 24
            );

        const parts = [];


        // DAYS
        if(displayDays > 0){

            parts.push(
                displayDays +
                (
                    displayDays === 1
                        ? " day"
                        : " days"
                )
            );

        }


        // HOURS
        if(displayRemainingHours > 0){

            parts.push(
                displayRemainingHours +
                (
                    displayRemainingHours === 1
                        ? " hour"
                        : " hours"
                )
            );

        }


        if(parts.length > 0){

            durationText =
                parts.join(" & ");

        } else {

            durationText =
                "Less than 1 hour";

        }

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
        durationText;
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
// DATE LIMITS
// -------------------------

function getDateLimits(){

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);

    maxDate.setFullYear(
        maxDate.getFullYear() + 2
    );

    function formatDate(date){

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

    return {

        min: formatDate(today),

        max: formatDate(maxDate)

    };

}


// -------------------------
// PICKUP DATE LIMITS
// -------------------------

function setPickupDateMin(){

    const pickupDate =
        document.getElementById("pickupDate");

    const limits =
        getDateLimits();

    pickupDate.min =
        limits.min;

    pickupDate.max =
        limits.max;

}


// -------------------------
// RETURN DATE LIMITS
// -------------------------

function updateReturnDateMin(){

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate");

    const limits =
        getDateLimits();


    // Always limit return date
    // to 2 years from today

    returnDate.max =
        limits.max;


    if(!pickupDate){

        returnDate.min =
            limits.min;

        return;

    }


    // Return date cannot be
    // earlier than pickup date

    returnDate.min =
        pickupDate;


    // Clear invalid return date

    if(
        returnDate.value &&
        (
            returnDate.value < pickupDate ||
            returnDate.value > limits.max
        )
    ){

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

  
    // Update destination availability
    updateDestinationOptions();

    // Update price
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

document.getElementById("bookMessenger").onclick = function(){

    // Meta Pixel: booking request / lead intent
    // Do not send customer name, phone, license, or other personal details.
    if(typeof fbq === "function"){
        fbq("track", "Lead");
    }


    // Update the latest booking calculation
    calculateBooking();


    // Safely get text from summary elements
    function getSummaryText(id){

        const element =
            document.getElementById(id);

        return element
            ? element.textContent
            : "₱0";

    }


    const vehicleSelect =
        document.getElementById("vehicle");

    const vehicle =
        VEHICLES[vehicleSelect.value].name;


    const message =
`Hello JBX Car Rental Services!

I would like to book a vehicle.

========================

Vehicle:
${vehicle}

Rental Duration:
${getSummaryText("sumDays")}

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
${document.getElementById("deliveryAddress")?.value || ""}

Vehicle Return:
${document.getElementById("pickupMethod").value}

Pickup City:
${document.getElementById("pickupCity").value}

Pickup Address:
${document.getElementById("pickupAddress")?.value || ""}

========================

Estimated Rental Fee:
${getSummaryText("sumRentalFee")}

Delivery Fee:
${getSummaryText("sumDelivery")}

Pickup Fee:
${getSummaryText("sumPickup")}

Car Wash Fee:
${getSummaryText("sumCarWash")}

Late Night Fee:
${getSummaryText("sumLateNight")}

TOTAL:
${getSummaryText("sumTotal")}

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
        "https://m.me/JBXCarRentalServices?text=" +
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

updateDestinationOptions();
calculateBooking();

(async () => {

    await getBookedDates();

    checkVehicleAvailability();

})();

// -------------------------
// MOBILE MENU
// -------------------------

const menuToggle =
    document.querySelector(".menu-toggle");

const nav =
    document.querySelector("nav");

if(menuToggle && nav){

    menuToggle.addEventListener("click", function(){

        nav.classList.toggle("active");

    });


    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", function(){

            nav.classList.remove("active");

        });

    });

}
