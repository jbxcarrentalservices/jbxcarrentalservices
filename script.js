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


/* CUSTOMER REVIEWS */
const demoReviews = [];

let selectedRating = 5;

function escapeReviewText(value){
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

function renderReviews(){
    const list = document.getElementById("reviewList");
    if(!list) return;

    if(demoReviews.length === 0){
        list.innerHTML = `<div class="review-empty"><i class="fa-regular fa-comment-dots"></i><br><strong>Be our first reviewer.</strong><br>Share your JBX rental experience using the button above.</div>`;
    } else {
    list.innerHTML = demoReviews.map(review => {
        const stars = "★".repeat(review.rating) + "☆".repeat(5-review.rating);
        return `
            <article class="review-card">
                <div class="review-card-top">
                    <div>
                        <div class="review-name">${escapeReviewText(review.name)}</div>
                        <span class="review-date">${escapeReviewText(review.date)}</span>
                    </div>
                    <div class="review-stars" aria-label="${review.rating} out of 5 stars">${stars}</div>
                </div>
                <p class="review-text">${escapeReviewText(review.text)}</p>
            </article>
        `;
    }).join("");
    }

    const count = demoReviews.length;
    const average = count ? (demoReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1) : "0.0";
    document.getElementById("reviewCount").textContent = count;
    document.getElementById("averageRating").textContent = average;
}

function openReviewForm(){
    const wrap = document.getElementById("reviewFormWrap");
    if(!wrap) return;
    wrap.classList.add("active");
    wrap.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setRating(5);
}

function closeReviewForm(){
    const wrap = document.getElementById("reviewFormWrap");
    if(!wrap) return;
    wrap.classList.remove("active");
    wrap.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function setRating(rating){
    selectedRating = rating;
    const hidden = document.getElementById("reviewRating");
    if(hidden) hidden.value = rating;

    document.querySelectorAll(".rating-picker button").forEach(button => {
        button.classList.toggle("selected", Number(button.dataset.rating) <= rating);
    });
}

document.querySelectorAll(".rating-picker button").forEach(button => {
    button.addEventListener("click", () => setRating(Number(button.dataset.rating)));
});

document.getElementById("reviewForm")?.addEventListener("submit", function(event){
    event.preventDefault();

    const message = document.getElementById("reviewFormMessage");
    message.textContent = "Thank you! The review form is working. We'll connect it to your approval system next.";

    this.reset();
    setRating(5);

    setTimeout(() => {
        closeReviewForm();
        message.textContent = "";
    }, 1800);
});

document.getElementById("reviewFormWrap")?.addEventListener("click", function(event){
    if(event.target === this){
        closeReviewForm();
    }
});

document.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
        closeReviewForm();
    }
});

renderReviews();
