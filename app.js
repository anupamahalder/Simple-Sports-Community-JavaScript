const handlePersonProfile = (name) => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`)
        .then(res => res.json())
        .then(persons => {
            persons = persons.player;
            const personListContainer = document.getElementById("sports-card-main-container");
            document.getElementById("sports-card-main-container").innerHTML = ""; 

            if (!persons) {
                const div = document.createElement("div");
                div.classList = "not-found-container";
                div.innerHTML = `
                    <p class="not-found">Matched with none of the player!!<p>
                    <button onclick="handlePersonProfile('pta')" class="detail-btn btn-style">Go Back</button>
                `;
                personListContainer.appendChild(div);
            } else {
                persons.forEach(person => {
                    personListContainer.appendChild(handlePersonCard(person));
                });
            }
        });
};

const handlePersonCard = (person) => {
    const div = document.createElement("div");
    div.classList.add("person-card");
    div.innerHTML = `
        <div class="image-container">
            <img class="person-profile-img" src="${person.strThumb}" alt="">
        </div>
        <p><b>Name: </b>${person.strPlayer || "Unknown"}</p>
        <p><b>Sport: </b>${person.strSport || "Unknown"}</p>
        <p><b>Position: </b>${person.strPosition || "Unknown"}</p>
        <p><b>Gender: </b>${person.strGender || "Unknown"}</p>
        <p><b>Nationality: </b>${person.strNationality || "Unknown"}</p>
        <p><b>Social Links: 
        <a href="${person.strFacebook}" target="_blank" rel="noopener noreferrer">
        <img class="social-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAGE8ljXRyieCB8kw8Xirym_RYMXW2dkuwKg&s"></a>
        <a href="${person.strInstagram}" target="_blank" rel="noopener noreferrer">
        <img class="social-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9TiAas3wAW09cV4z1jQFYiBNLkJC_i7joTw&s"></a>
        <a href="${person.strTwitter}" target="_blank" rel="noopener noreferrer">
        <img class="social-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmJGaR_uW64_qK6pW7MwlHbDJc7rujJbbXPQ&s"></a>
        </b></p>
        <button class="add-btn btn-style" data-player-id="${person.idPlayer}" onclick="handleAddGroup(${person.idPlayer})">Add To Group</button>
        <button class="detail-btn btn-style" onclick="handlePersonDetails(${person.idPlayer})">Details</button>
    `;
    const img = div.querySelector('.person-profile-img');
    img.onerror = () => {
        img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn57FZdEF9wfoDVcjIVV1mNxNUyFSJWDuL3Gli3ZXcExNqxgraCtdDOJz6pNA5bRIIzvs&usqp=CAU';
    };
    return div;
};

// Initial person profile load
handlePersonProfile("pta");

const handleSearch = () => {
    const inputValue = document.getElementById("search-input").value;
    if (!inputValue) return;
    console.log(inputValue);
    document.getElementById("search-input").value = "";
    handlePersonProfile(inputValue);
};

const handleAddGroup = (id) => {
    console.log(id);
    // Check if the total count has reached the limit
    const memberCount = document.getElementById("member-count");
    if (parseInt(memberCount.innerText) >= 11) {
        alert("Cannot add more than 11 members to the group!");
        return;
    }

    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            const person = data.players[0];
            const groupListContainer = document.getElementById("sports-group-container");
            const memberCount = document.getElementById("member-count");

            const p = document.createElement("p");
            p.innerText = (parseInt(memberCount.innerText) + 1) + '. ' + person.strPlayer;
            groupListContainer.appendChild(p);

            document.getElementById("member-count").innerText = 1 + parseInt(memberCount.innerText);

            if (person.strGender === "Female") {
                const femaleCount = document.getElementById("female-count");
                document.getElementById("female-count").innerText = 1 + parseInt(femaleCount.innerText);
            }

            if (person.strGender === "Male") {
                const maleCount = document.getElementById("male-count");
                document.getElementById("male-count").innerText = 1 + parseInt(maleCount.innerText);
            }

            const personListContainer = document.getElementById("sports-card-main-container");
            const childrenArray = Array.from(personListContainer.children);

            const selectedPersonCard = childrenArray.find(child => {
                const addButton = child.querySelector('.add-btn');
                return addButton && addButton.dataset.playerId == id;
            });

            console.log("Selected Person Card:", selectedPersonCard);

            if (selectedPersonCard) {
                const addButton = selectedPersonCard.querySelector('.add-btn');
                addButton.innerText = "Already Added";
                addButton.disabled = true;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert("Failed to add to the group!");
        });
};

const handlePersonDetails = (id) => {
    console.log(id);
    fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            const person = data.players[0];
            const modal = document.createElement('div');
            modal.classList.add('modal', 'fade');
            modal.setAttribute('id', 'personModal');
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('aria-labelledby', 'personModalLabel');
            modal.setAttribute('aria-hidden', 'true');

            modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <p><b>Player Details</b></p>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-image detail-profile-image-container">
                                <img class="img-style2 detail-profile-image" src=${person.strThumb} alt=""/>
                            </div>
                            <div class="detail-info-container">
                            <p><b>Name: </b>${person.strPlayer || "Unknown"}</p>
                            <p><b>Sport: </b>${person.strSport || "Unknown"}</p>
                            <p><b>Position: </b>${person.strPosition || "Unknown"}</p>
                            <p><b>Gender: </b>${person.strGender || "Unknown"}</p>
                            <p><b>Nationality: </b>${person.strNationality || "Unknown"}</p>
                            <p><b>Date of Birth: </b>${person.dateBorn || "Unknown"}</p>
                            <p><b>Birth Location: </b>${person.strBirthLocation || "Unknown"}</p>
                            <p><b>Status: </b>${person.strStatus || "Unknown"}</p>
                            <p><b>Description: </b>${person.strDescriptionEN || "Unknown"}</p>
                            <p><b>Social Links: 
                            <a href="${person.strFacebook}" target="_blank" rel="noopener noreferrer">
                            <img class="social-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAGE8ljXRyieCB8kw8Xirym_RYMXW2dkuwKg&s"></a>
                            <a href="${person.strInstagram}" target="_blank" rel="noopener noreferrer">
                            <img class="social-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9TiAas3wAW09cV4z1jQFYiBNLkJC_i7joTw&s"></a>
                            <a href="${person.strTwitter}" target="_blank" rel="noopener noreferrer">
                            <img class="social-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmJGaR_uW64_qK6pW7MwlHbDJc7rujJbbXPQ&s"></a>
                            </b></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const img = modal.querySelector('.detail-profile-image');
            img.onerror = () => {
                img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn57FZdEF9wfoDVcjIVV1mNxNUyFSJWDuL3Gli3ZXcExNqxgraCtdDOJz6pNA5bRIIzvs&usqp=CAU';
            };
            document.body.appendChild(modal);
            const personModal = new bootstrap.Modal(modal);
            personModal.show();
            
        });
};
