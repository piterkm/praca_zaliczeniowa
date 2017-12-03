document.addEventListener("DOMContentLoaded", function(){
    console.log("działam");

    //TWORZENIE GRIDA (MASONRY)
    $('#masonry').masonry({
        itemSelector: '.secondary-element',
        columnWidth: 398,
    })
    console.log("tworzę grida o szerokości kolumny 380px");

});
