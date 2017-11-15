document.addEventListener("DOMContentLoaded", function(){
    // function dropMenu() {
    //     document.getElementById('dropdown-button').classList.toglle("show");
    // }
    //
    // window.click = function(event) {
    //     if (!event.target.matches("#dropdown-button")) {
    //         var dropdown = document.querySelectorAll(".dropdown-content");
    //         for (var i = 0; i < dropdown.length; i++) {
    //             var openDropdown = dropdown[i];
    //             if (openDropdown.classList.contains("show")) {
    //                 openDropdown.classList.remove("show");
    //             }
    //         }
    //     }
    // }

    //SKRYPT PRZYGOTOWANY NA ZAJECIACH Z ANIĄ
    var nav = document.querySelectorAll("nav > ul > li");

    for (var i = 0; i < nav.length; i++) {
        nav[i].addEventListener("mouseenter", function(event) {
            var element = event.target;
            var list = element.querySelector("ul");
            // list.style.display = "block";
            list.Classname = "";
        });

        nav[i].addEventListener("mouseleave", function() {
            var element = event.target;
            var list = element.querySelector("ul");
            // list.style.display = "none";
            list.Classname = "hidden";
        })
    }

    //TWORZENIE MODUŁÓW

    // var secondaryPreview = document.querySelector("section > .secondary-preview >")

});
