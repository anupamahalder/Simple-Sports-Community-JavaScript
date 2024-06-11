const handlePersonProfile = (name) =>{
    fetch(`https:\\www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`)
    .then(res => res.json())
    .then(persons =>{
        persons = persons.player;
        const personListContainer = document.getElementById("sports-card-main-container");
        document.getElementById("sports-card-main-container").innerHTML = ""; 

        if(!persons){
            const div = document.createElement("div");
            div.classList = "not-found-container";
            div.innerHTML= `
            <p class="not-found">Matched with none of the player!!<p>
            <button onclick="handlePersonProfile('pta')" class="detail-btn btn-style">Go Back</button>
            `
            personListContainer.appendChild(div);
        }else
        persons.forEach(person =>{
            // create a div 
            const div = document.createElement("div");
            div.classList.add("person-card");
            div.innerHTML = `
            <div class="image-container">
            <img class="person-profile-img" src="${person.strThumb}" alt="">
            </div>
            <p><b>Name: </b>${person.strPlayer}</p>
            <p><b>Sport: </b>${person.strSport}</p>
            <p><b>Position: </b>${person.strPosition}</p>
            <p><b>Gender: </b>${person.strGender}</p>
            <p><b>Nationality: </b>${person.strNationality}</p>
            <button class="add-btn btn-style" onclick="handleAddGroup">Add To Group</button>
            <button class="detail-btn btn-style" onclick="handlePersonDetails">Details</button>
            `;
            // Add error handling for image
            const img = div.querySelector('.person-profile-img');
            img.onerror = () => {
                img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn57FZdEF9wfoDVcjIVV1mNxNUyFSJWDuL3Gli3ZXcExNqxgraCtdDOJz6pNA5bRIIzvs&usqp=CAU';
            };
            personListContainer.appendChild(div);
        })
    })
}
// call initial person profile load 
handlePersonProfile("pta");

// handle search button 
const handleSearch = ()=>{
    const inputValue = document.getElementById("search-input").value;
    if(!inputValue) return;
    console.log(inputValue);
    document.getElementById("search-input").value = "";
    handlePersonProfile(inputValue);
}