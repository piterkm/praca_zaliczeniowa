document.addEventListener("DOMContentLoaded", function(){
    console.log("działam");

    //TWORZENIE GRIDA (MASONRY)
    // var container = document.querySelector('#masonry');
    // var masonry = new Masonry(container, {
    //   columnWidth: 399,
    //   itemSelector: '.secondary-element'
    // });

    $('#masonry').masonry({
        itemSelector: '.secondary-element',
        columnWidth: 398,
    })
    console.log("tworzę grida o szerokości kolumny 380px");


});
