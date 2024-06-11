fetch("https:\\www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=pta")
.then(res => res.json())
.then(persons =>{
    persons = persons.player;
    console.log(persons);
    const personListContainer = document.getElementById("sports-card-main-container");
    document.getElementById("sports-card-main-container").innerHTML = ""; 
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
