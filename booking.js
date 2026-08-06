const vehicleRates = {
    vios: 1800,
    xpander: 2500
};

const destinationFees = {
    "Metro Manila": 0,
    "Cavite": 300,
    "Laguna": 500,
    "Batangas": 800,
    "Quezon": 1000,
    "Bulacan": 500,
    "Pampanga": 700
};

const provinces = {

    "Metro Manila":[
        "Taguig",
        "Makati",
        "Parañaque",
        "Pasig",
        "Quezon City"
    ],

    "Cavite":[
        "Bacoor",
        "Imus",
        "Dasmariñas",
        "Tagaytay"
    ],

    "Laguna":[
        "Biñan",
        "Santa Rosa",
        "Calamba",
        "San Pablo"
    ],

    "Batangas":[
        "Lipa",
        "Batangas City",
        "Nasugbu",
        "Lemery"
    ],

    "Quezon":[
        "Lucena",
        "Sariaya",
        "Tayabas"
    ],

    "Bulacan":[
        "Malolos",
        "Meycauayan",
        "Baliuag"
    ],

    "Pampanga":[
        "San Fernando",
        "Angeles",
        "Mabalacat"
    ]

};

const vehicle = document.getElementById("vehicle");
const pickup = document.getElementById("pickupDate");
const returnDate = document.getElementById("returnDate");
const province = document.getElementById("province");
const city = document.getElementById("city");

vehicle.addEventListener("change", updateSummary);
pickup.addEventListener("change", updateSummary);
returnDate.addEventListener("change", updateSummary);
province.addEventListener("change", updateCities);

function updateCities(){

    city.innerHTML="";

    if(provinces[province.value]){

        provinces[province.value].forEach(place=>{

            let option=document.createElement("option");

            option.text=place;

            city.add(option);

        });

    }

    updateSummary();

}

function updateSummary(){

    document.getElementById("sumVehicle").innerHTML=
    vehicle.options[vehicle.selectedIndex].text;

    let rate=vehicleRates[vehicle.value];

    document.getElementById("sumRate").innerHTML=
    "₱"+rate.toLocaleString();

    let days=0;

    if(pickup.value && returnDate.value){

        const start=new Date(pickup.value);

        const end=new Date(returnDate.value);

        days=Math.ceil((end-start)/(1000*60*60*24));

        if(days<1){
            days=1;
        }

    }

    document.getElementById("sumDays").innerHTML=days;

    let destinationFee=
    destinationFees[province.value] || 0;

    document.getElementById("sumDestination").innerHTML=
    "₱"+destinationFee.toLocaleString();

    let total=(rate*days)+destinationFee;

    document.getElementById("sumTotal").innerHTML=
    "₱"+total.toLocaleString();

}

updateSummary();