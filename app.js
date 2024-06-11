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
        <p><b>Name: </b>${person.strPlayer}</p>
        <p><b>Sport: </b>${person.strSport}</p>
        <p><b>Position: </b>${person.strPosition}</p>
        <p><b>Gender: </b>${person.strGender}</p>
        <p><b>Nationality: </b>${person.strNationality}</p>
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
            createAlert("Failed to add to the group!", "danger");
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
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="modal-image">
                                <img class="img-style2" src=${person.strThumb} alt=""/>
                            </div>
                            <h5 class="modal-title" id="personModalLabel">${person.strPlayer}</h5>
                            <p>Sport: ${person.strSport}</p>
                            <p>Position: ${person.strPosition}</p>
                            <p>Gender: ${person.strGender}</p>
                            <p>Nationality: ${person.strNationality}</p>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            const personModal = new bootstrap.Modal(modal);
            personModal.show();
        });
};
