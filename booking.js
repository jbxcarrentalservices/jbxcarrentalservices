// Rates by vehicle and province group

const rateGroups = {

    groupA: [
        "Metro Manila","Batangas","Cavite","Rizal","Pampanga",
        "Bataan","Tarlac","Nueva Ecija","Bulacan",
        "Laguna","Zambales","Aurora"
    ],

    groupB: [
        "Pangasinan","Nueva Vizcaya","Quirino",
        "La Union","Benguet","Quezon","Camarines Norte"
    ],

    groupC: [
        "Ilocos Sur","Ifugao","Mountain Province",
        "Isabela","Abra","Kalinga","Camarines Sur"
    ],

    groupD: [
        "Ilocos Norte","Apayao","Cagayan",
        "Albay","Sorsogon"
    ]

};

const prices = {

    vios: {
        regular: {
            groupA:1800,
            groupB:2300,
            groupC:2500,
            groupD:3000
        },
        half:1300
    },

    xpander: {
        regular: {
            groupA:2500,
            groupB:3000,
            groupC:3200,
            groupD:3700
        },
        half:1700
    }

};

const halfDayAllowed = [
    "Metro Manila","Batangas","Cavite","Rizal",
    "Pampanga","Bataan","Tarlac",
    "Nueva Ecija","Bulacan","Laguna"
];

const vehicle = document.getElementById("vehicle");
const rentalType = document.getElementById("rentalType");
const pickup = document.getElementById("pickupDate");
const returnDate = document.getElementById("returnDate");
const province = document.getElementById("province");

vehicle.addEventListener("change", updateSummary);
rentalType.addEventListener("change", updateSummary);
pickup.addEventListener("change", updateSummary);
returnDate.addEventListener("change", updateSummary);
province.addEventListener("change", updateSummary);

function getProvinceGroup(place){

    for(const group in rateGroups){

        if(rateGroups[group].includes(place)){

            return group;

        }

    }

    return null;

}

function updateSummary(){

    const group = getProvinceGroup(province.value);

    let rate = 0;
    let days = 1;
    let warning = "";

    if(rentalType.value==="regular"){

        if(group){

            rate = prices[vehicle.value].regular[group];

        }

        if(pickup.value && returnDate.value){

            const start = new Date(pickup.value);

            const end = new Date(returnDate.value);

            days = Math.ceil((end-start)/(1000*60*60*24));

            if(days<1){

                days=1;

            }

        }

    }

    if(rentalType.value==="half"){

        days = 1;

        if(!halfDayAllowed.includes(province.value)){

            warning =
            "Half-day rentals are only available for selected nearby provinces.";

            rate = 0;

        }else{

            const selectedDate = new Date(pickup.value);

            if(pickup.value){

                const day = selectedDate.getDay();

                if(day===0 || day===6){

                    warning =
                    "Half-day rentals are only available on weekdays.";

                    rate = 0;

                }else{

                    rate = prices[vehicle.value].half;

                }

            }

        }

    }

    document.getElementById("sumVehicle").innerHTML =
        vehicle.options[vehicle.selectedIndex].text;

    document.getElementById("sumDays").innerHTML = days;

    document.getElementById("sumRate").innerHTML =
        "₱"+rate.toLocaleString();

    document.getElementById("sumDestination").innerHTML =
        province.value || "-";

    document.getElementById("sumTotal").innerHTML =
        "₱"+(rate*days).toLocaleString();

    document.getElementById("bookingWarning").innerHTML =
        warning;

}
updateSummary();
