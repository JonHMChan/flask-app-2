// Your code starts here
$(document).ready(function() {

    teamUrlArray = window.location.pathname.split("/");
    teamUrl = `/api/${teamUrlArray[1]}/${teamUrlArray[2]}`;
    teamPokemonList = [];
    anyPokemonChanges = false;
    anyTeamChanges = false;

    $.ajax({
        method: "GET",
        url: teamUrl,
        success: function(data) {
            teamId = `${data.id}`
            teamName = `${data.name}`;
            teamDescription = `${data.description}`;
            teamPokemonList = data.members;
            originalPokemonCount = teamPokemonList.length;

            $(".js-hidden-team-id").attr("value",`${teamId}`);
            $(".js-back").attr("href",`/teams/${teamId}`);
            $(".js-team-name-input").attr("value",`${teamName}`);
            $(".js-team-description-input").text(`${teamDescription}`);
            
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
                            <td><input type="number" name="level${pokemonId}" value="${pokemonLevel}" class="level-input" id="js-change-${pokemonId}" form="js-team-edits"></td>
                            <td>${pokemonTypes}</td>
                            <td><button type="button" form="js-team-edits"  id="js-remove-${pokemonId}" value="${pokemonId}">Remove</button></td>
                        </tr>`;
                        
                        $(".js-teams-pokemon").append($pokemonRow);
                        $(`#js-remove-${pokemonId}`).click(removePokemonRow);
                        
                    }
                }
            })
            
        }
    });
    $(".js-submit").click(function(event) {
        formDataAsArray = $("#js-team-edits").serializeArray();
        dataToSend = {};
        $.map(formDataAsArray, function(n) {
            if ((`${n.name}`).includes("level")) {
                changeLevelIfUpdated(n);
            }
            else {
                dataToSend[`${n.name}`] = `${n.value}`;
                anyTeamChanges = true;
            }
        });
        if (anyPokemonChanges) {
            dataToSend["members"] = teamPokemonList;
        }
        if (anyPokemonChanges || anyTeamChanges) {
            $.ajax({
                method: "PATCH",
                url: teamUrl,
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify(dataToSend),
                success: function(data) {
                    window.location.pathname = `/teams/${teamUrlArray[2]}`;
                }
            });
        } else {
            window.location.pathname = `/teams/${teamUrlArray[2]}`
        }
        
        return false;
    });
    function changeLevelIfUpdated(n) {
        idForLevelUpdate = `${n.name}`.slice(5);
        for (i = 0; i < teamPokemonList.length; i++) {
            if (idForLevelUpdate == teamPokemonList[i]["pokemon_id"]) {
                if (teamPokemonList[i]["level"] != `${n.value}`) {
                    teamPokemonList[i]["level"] = `${n.value}`;
                    anyPokemonChanges = true;
                    return true;
                }
            }
        }
    }
    function removePokemonRow() {
        pokemon = $(this).attr("value");
        $(this).closest("tr").hide();
        for (i = 0; i < teamPokemonList.length; i++) {
            if (teamPokemonList[i]["pokemon_id"] == pokemon){
                teamPokemonList.splice(i, 1);
                anyPokemonChanges = true;
            }
        }
    }
});

