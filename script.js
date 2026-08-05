function openPopup(image){

    document.getElementById("popupImage").src = image;

    document.getElementById("carPopup").style.display = "flex";

}

document.querySelector(".close").onclick=function(){

    document.getElementById("carPopup").style.display="none";

}

window.onclick=function(event){

    if(event.target==document.getElementById("carPopup")){

        document.getElementById("carPopup").style.display="none";

    }

}