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
