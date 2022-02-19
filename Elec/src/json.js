"use strict";
//  Json scripts

var myInit = {
    methode: 'GET',
    headers: {
        'Content-Type': 'applictaion/json'
    },
    mode: 'cors',
    cache: 'default'
};

let myRequest = new Request("./src/pgw/data.json", myInit);

fetch(myRequest)
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){
        data.size = 20
        console.log(data);
        
        // Get project name
        // const name = document.getElementById("user").innerText = `USER: ${data.name}`.toUpperCase();
    });