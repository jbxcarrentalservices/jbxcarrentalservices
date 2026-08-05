let gallery = [];
let currentImage = 0;

function openPopup(car){

    if(car=="vios"){

        gallery=[
            "Images/vios.png",
            "Images/vios-actual.jpg"
        ];

    }

    if(car=="xpander"){

        gallery=[
            "Images/xpander-gray.png",
            "Images/xpander-actual.jpg"
        ];

    }

    currentImage=0;

    document.getElementById("popupImage").src=gallery[currentImage];

    document.getElementById("carPopup").style.display="flex";

}

function changeImage(direction){

    currentImage+=direction;

    if(currentImage<0){
        currentImage=gallery.length-1;
    }

    if(currentImage>=gallery.length){
        currentImage=0;
    }

    document.getElementById("popupImage").src=gallery[currentImage];

}

document.querySelector(".close").onclick=function(){

    document.getElementById("carPopup").style.display="none";

}

window.onclick=function(event){

    if(event.target==document.getElementById("carPopup")){
        document.getElementById("carPopup").style.display="none";
    }

}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

menuToggle.onclick = function(){

    nav.classList.toggle("active");

}

const faqs = document.querySelectorAll(".faq-question");

faqs.forEach(question => {

    question.addEventListener("click", () => {

        const item = question.parentElement;

        item.classList.toggle("active");

    });

});
