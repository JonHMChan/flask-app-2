// Your code starts here

// Your code starts here
$(document).ready(function() {

    teamUrlArray = window.location.pathname.split("/");
    teamUrl = `/api/${teamUrlArray[1]}/${teamUrlArray[2]}`;
    pokemonToKeep = [];
    originalPokemonCount = 0;

    $.ajax({
        method: "GET",
        url: teamUrl,
        success: function(data) {
            teamName = `${data.name}`;
            teamDescription = `${data.description}`;

            $(".js-hidden-team-id").attr("value",`${data.id}`);
            $(".js-back").attr("href",`/teams/${data.id}`);
            $(".js-team-name-input").attr("value",`${teamName}`);
            $(".js-team-description-input").text(`${teamDescription}`);
            teamPokemonList = data.members;
            originalPokemonCount = teamPokemonList.length;
            for (i = 0; i < teamPokemonList.length; i++){
                pokemonToKeep.push(teamPokemonList[i]);
            }
            console.log(pokemonToKeep);
            $.ajax({
                method: "GET",
                url: "/api/pokemon",
                success: function(pokemonData) {

                    for (x = 0; x < teamPokemonList.length; x++) {
                        pokemonId = teamPokemonList[x].pokemon_id;
                        pokemonImageUrl = pokemonData[pokemonId-1].image_url;
                        pokemonName = pokemonData[pokemonId-1].name;
                        pokemonLevel = teamPokemonList[x].level;
                        pokemonTypes = pokemonData[pokemonId-1].types;
                        
                        
                        $pokemonRow = 
                        `<tr>
                            <td><img class="poke-image" src=${pokemonImageUrl}></td>
                            <td><a href="/pokemon/${pokemonId}">${pokemonName}</a></td>
                            <td>
                                <input type="number" name="level${pokemonId}" value="${pokemonLevel}" class="level-input" id="js-change-${pokemonId}" form="js-team-edits">
                            </td>
                            <td>${pokemonTypes}</td>
                            <td><button type="button" form="js-team-edits"  id="js-remove-${pokemonId}" value="${pokemonId}">Remove</button>
                            </td>
                        </tr>`;
                        
                        $(".js-teams-pokemon").append($pokemonRow);
                        $(`#js-remove-${pokemonId}`).click(removePokemonRow);
                        
                    }
                }
            })
            
        }
    });


    $(".js-submit").click(function(event) {

        interimData = $("#js-team-edits").serializeArray();
        var dataToSend = {};
        $.map(interimData, function(n) {
            if (`${n.name}`.includes("level")) {
                idToChange = `${n.name}`.slice(5);
                console.log(idToChange);
                for (i = 0; i < pokemonToKeep.length; i++) {
                    if (idToChange == pokemonToKeep[i]["pokemon_id"]) {
                        pokemonToKeep[i]["level"] = `${n.value}`;
                        continue;
                    }
                }
                
            }
            else{
                dataToSend[`${n.name}`] = `${n.value}`;
            }
        });


        dataToSend["members"] = pokemonToKeep;
        

        

        console.log(dataToSend);

        $.ajax({
            method: "PATCH",
            url: teamUrl,
            contentType:"application/json; charset=utf-8",
            data: JSON.stringify(dataToSend),
            success: function(data) {
                console.log("success");
                window.location.pathname = `/teams/${teamUrlArray[2]}`;
            }
        });

        return false;
    });


    function removePokemonRow() {
        pokemon = $(this).attr("value");
        $(this).closest("tr").hide();
        for (i = 0; i < pokemonToKeep.length; i++) {
            if (pokemonToKeep[i]["pokemon_id"] == pokemon){
                pokemonToKeep.splice(i, 1);
                console.log("did it");
            }
        }
        console.log(pokemonToKeep);
    }

});

