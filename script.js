let gallery = [];
let currentImage = 0;

function openPopup(car){

    if(car=="vios"){

        gallery=[
            "Images/vios1.jpg",
            "Images/vios2.jpg",
            "Images/vios3.jpg",
            "Images/vios4.jpg",
            "Images/vios5.jpg",
            "Images/vios6.jpg",
            "Images/vios7.jpg"
        ];

    }

    if(car=="xpander"){

        gallery=[
            "Images/xpander-actual-1.jpg",
            "Images/xpander-actual-2.jpg",
            "Images/xpander-actual-3.jpg",
            "Images/xpander-actual-4.jpg",
            "Images/xpander-actual-5.jpg",
            "Images/xpander-actual-6.jpg"
        ];

    }

    currentImage=0;

    document.getElementById("popupImage").src=gallery[currentImage];

    createThumbnails();

    document.getElementById("carPopup").style.display="flex";

}


function createThumbnails(){

    let container=document.getElementById("galleryThumbnails");

    if(!container){

        container=document.createElement("div");

        container.id="galleryThumbnails";

        container.style.display="flex";
        container.style.justifyContent="center";
        container.style.alignItems="center";
        container.style.gap="8px";
        container.style.marginTop="15px";
        container.style.flexWrap="wrap";
        container.style.maxWidth="900px";
        container.style.marginLeft="auto";
        container.style.marginRight="auto";

        document.getElementById("popupImage").parentElement.appendChild(container);

    }

    container.innerHTML="";

    gallery.forEach((image,index)=>{

        let thumbnail=document.createElement("img");

        thumbnail.src=image;

        thumbnail.style.width="75px";
        thumbnail.style.height="55px";
        thumbnail.style.objectFit="cover";
        thumbnail.style.borderRadius="6px";
        thumbnail.style.cursor="pointer";
        thumbnail.style.border="2px solid transparent";
        thumbnail.style.transition="0.2s";

        if(index===currentImage){

            thumbnail.style.border="2px solid #ffffff";
            thumbnail.style.opacity="1";

        }else{

            thumbnail.style.opacity="0.6";

        }

        thumbnail.onclick=function(){

            currentImage=index;

            document.getElementById("popupImage").src=gallery[currentImage];

            createThumbnails();

        };

        thumbnail.onmouseover=function(){

            thumbnail.style.opacity="1";

        };

        thumbnail.onmouseout=function(){

            if(index!==currentImage){

                thumbnail.style.opacity="0.6";

            }

        };

        container.appendChild(thumbnail);

    });

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

    createThumbnails();

}


document.querySelector(".close").onclick=function(){

    document.getElementById("carPopup").style.display="none";

};


window.onclick=function(event){

    if(event.target==document.getElementById("carPopup")){

        document.getElementById("carPopup").style.display="none";

    }

};


const menuToggle = document.querySelector(".menu-toggle");

const nav = document.querySelector("nav");


menuToggle.onclick=function(){

    nav.classList.toggle("active");

};


const faqs=document.querySelectorAll(".faq-question");


faqs.forEach(question=>{

    question.addEventListener("click",()=>{

        const item=question.parentElement;

        item.classList.toggle("active");

    });

});

/* ================================
   CUSTOMER REVIEWS
================================ */

const REVIEW_API =
"https://script.google.com/macros/s/AKfycbz4rpaw0G6aH8BOJZJu0exNeam-Cm35XQ_71VFR_SQ4DJgnHdUTO-0lnd00mi1F6ezN/exec";


/* LOAD REVIEWS */

async function loadReviews(){

    try{

        const response = await fetch(REVIEW_API);

        const reviews = await response.json();

        displayReviews(reviews);

    }catch(error){

        console.error("Error loading reviews:", error);

    }

}


/* DISPLAY REVIEWS */

function displayReviews(reviews){

    const container =
        document.getElementById("reviewsContainer");

    if(!container) return;

    container.innerHTML = "";

    if(reviews.length === 0){

        container.innerHTML =
            "<p>No customer reviews yet.</p>";

        updateReviewSummary([]);

        return;

    }


    reviews.forEach(review => {

        const card = document.createElement("div");

        card.className = "review-card";


        const stars =
            "★".repeat(Number(review.rating)) +
            "☆".repeat(5 - Number(review.rating));


        const date = review.date
            ? new Date(review.date).toLocaleDateString()
            : "";


        card.innerHTML = `

            <div class="review-stars">
                ${stars}
            </div>

            <h4>${escapeHTML(review.name)}</h4>

            <p>${escapeHTML(review.review)}</p>

            <small>${date}</small>

        `;


        container.appendChild(card);

    });


    updateReviewSummary(reviews);

}


/* UPDATE RATING SUMMARY */

function updateReviewSummary(reviews){

    const ratingElement =
        document.getElementById("averageRating");

    const countElement =
        document.getElementById("reviewCount");


    if(!ratingElement || !countElement) return;


    if(reviews.length === 0){

        ratingElement.textContent = "5.0";

        countElement.textContent =
            "0 customer reviews";

        return;

    }


    let total = 0;

    reviews.forEach(review => {

        total += Number(review.rating);

    });


    const average =
        (total / reviews.length).toFixed(1);


    ratingElement.textContent = average;


    countElement.textContent =
        reviews.length +
        (reviews.length === 1
            ? " customer review"
            : " customer reviews");

}


/* SECURITY */

function escapeHTML(text){

    const div = document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;

}


/* LOAD WHEN PAGE OPENS */

document.addEventListener("DOMContentLoaded", () => {

    loadReviews();

});
