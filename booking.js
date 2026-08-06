/* ==========================================
   JBX BOOKING SYSTEM
========================================== */

// ---------- STEP WIZARD ----------

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

document.getElementById("next1").onclick=function(){

    currentStep=2;
    showStep(currentStep);

};

document.getElementById("back1").onclick=function(){

    currentStep=1;
    showStep(currentStep);

};

document.getElementById("next2").onclick=function(){

    currentStep=3;
    showStep(currentStep);

    calculateBooking();

};

document.getElementById("back2").onclick=function(){

    currentStep=2;
    showStep(currentStep);

};

showStep(1);

// ---------- DELIVERY SECTION ----------

function toggleDeliverySection(){

    const method=document.getElementById("deliveryMethod").value;

    const section=document.getElementById("deliverySection");

    if(method==="delivery"){

        section.style.display="block";

    }else{

        section.style.display="none";

    }

}

document
.getElementById("deliveryMethod")
.addEventListener("change",toggleDeliverySection);

toggleDeliverySection();

// ---------- RENTAL DAYS ----------

function getRentalDays(){

    const pickup=document.getElementById("pickupDate").value;

    const ret=document.getElementById("returnDate").value;

    if(!pickup || !ret){

        return 0;

    }

    const start=new Date(pickup);

    const end=new Date(ret);

    let days=Math.ceil(

        (end-start)/(1000*60*60*24)

    );

    if(days<1){

        days=1;

    }

    return days;

}

// ---------- BOOKING CALCULATOR ----------

function calculateBooking(){

    const vehicle=
        document.getElementById("vehicle").value;

    const rentalType=
        document.getElementById("rentalType").value;

    const province=
        document.getElementById("province").value;

    const rate=
        getRentalRate(
            vehicle,
            rentalType,
            province
        );

    const days=getRentalDays();

    const rentalFee=rate*days;

    const deliveryFee=
        calculateDeliveryFee(

            document.getElementById("deliveryMethod").value,

            document.getElementById("deliveryCity").value

        );

    const pickupFee=
        calculatePickupFee(

            document.getElementById("pickupMethod").value,

            document.getElementById("pickupCity").value

        );

    const lateNightFee=

        calculateLateNightFee(

            document.getElementById("pickupTime").value

        );

    const total=

        rentalFee+

        deliveryFee+

        pickupFee+

        CONFIG.carWashFee+

        lateNightFee;

    // ---------- SUMMARY ----------

    document.getElementById("sumVehicle").textContent=

        VEHICLES[vehicle].name;

    document.getElementById("sumRental").textContent=

        rentalType==="half"

        ?

        "Half Day (12 Hours)"

        :

        "Regular (24 Hours)";

    document.getElementById("sumDestination").textContent=

        province || "-";

    document.getElementById("sumDays").textContent=

        days;

    document.getElementById("sumRentalFee").textContent=

        "₱"+rentalFee.toLocaleString();

    document.getElementById("sumDelivery").textContent=

        "₱"+deliveryFee.toLocaleString();

    document.getElementById("sumPickup").textContent=

        "₱"+pickupFee.toLocaleString();

    document.getElementById("sumCarWash").textContent=

        "₱"+CONFIG.carWashFee.toLocaleString();

    document.getElementById("sumLateNight").textContent=

        "₱"+lateNightFee.toLocaleString();

    document.getElementById("sumTotal").textContent=

        "₱"+total.toLocaleString();

}

// ---------- LIVE UPDATE ----------

const fields=[

"vehicle",
"rentalType",
"province",
"pickupDate",
"returnDate",
"pickupTime",
"deliveryMethod",
"deliveryCity",
"pickupMethod",
"pickupCity"

];

fields.forEach(id=>{

    const el=document.getElementById(id);

    if(el){

        el.addEventListener("change",calculateBooking);

    }

});

// ---------- MESSENGER BOOKING ----------

document.getElementById("bookMessenger").onclick=function(){

    calculateBooking();

    const message=

`Hello JBX Car Rental!

I'd like to book a vehicle.

Vehicle: ${VEHICLES[document.getElementById("vehicle").value].name}

Rental Type: ${document.getElementById("rentalType").value}

Pickup Date: ${document.getElementById("pickupDate").value}

Return Date: ${document.getElementById("returnDate").value}

Destination: ${document.getElementById("province").value}

Estimated Total: ${document.getElementById("sumTotal").textContent}

Name: ${document.getElementById("customerName").value}

Contact Number: ${document.getElementById("customerPhone").value}`;

    window.open(

"https://m.me/YOUR_FACEBOOK_PAGE_USERNAME?text="+

encodeURIComponent(message),

"_blank"

);

};

// ---------- INITIAL LOAD ----------

calculateBooking();
