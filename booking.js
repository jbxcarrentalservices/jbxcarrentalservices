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

    console.log(rate);

}

document.getElementById("vehicle").onchange=calculateBooking;

document.getElementById("rentalType").onchange=calculateBooking;

document.getElementById("province").onchange=calculateBooking;
