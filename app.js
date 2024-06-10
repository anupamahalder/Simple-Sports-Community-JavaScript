fetch("https:\\www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=pta")
.then(res => res.json())
.then(persons =>{
    console.log(persons);
    const personListContainer = document.getElementById("sports-card-main-container");
    
})