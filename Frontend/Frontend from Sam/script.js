// let toggle = document.querySelector('.toggle');
// let body = document.querySelector('.body');

// toggle.addEventListener('click', function() {
//     const tp =  body.classList.toggle("open");
//     console.log("ok");
// })

const ouvrir = document.querySelector('.ouvrir');
const fermer = document.querySelector('.fermer');
const navigation = document.querySelector('.navigation');
const body = document.body

ouvrir.addEventListener('click', function() {
    ouvrir.style.display = "none";
    fermer.style.display = "block";
    navigation.style.display = "block";
})

fermer.addEventListener('click', function() {
    ouvrir.style.display = "block";
    fermer.style.display = "none";
    navigation.style.display = "none";
})