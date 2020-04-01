// Your code starts here
$(document).ready(function() {
    var urlArray = window.location.pathname.split("/");
    var teamApiUrl = `/api/${urlArray[1]}/${urlArray[2]}`;
    var teamHomeUrl = `/teams/${urlArray[2]}`;
    var teamPokemonList = [];
    var anyPokemonChanges = false;
    var anyTeamChanges = false;

    $.ajax({
        method: "GET",
        url: teamApiUrl,
        success: function(data) {
            var teamId = `${data.id}`
            var teamName = `${data.name}`;
            var teamDescription = `${data.description}`;
            teamPokemonList = data.members;
            $(".js-hidden-team-id").attr("value",`${teamId}`);
            $(".js-back").attr("href",`/teams/${teamId}`);
            $(".js-team-name-input").attr("value",`${teamName}`);
            $(".js-team-description-input").text(`${teamDescription}`);

            $.ajax({
                method: "GET",
                url: "/api/pokemon",
                success: function(pokemonData) {
                    for (x = 0; x < teamPokemonList.length; x++) {
                        var pokemonId = teamPokemonList[x].pokemon_id;
                        var pokemonImageUrl = pokemonData[pokemonId-1].image_url;
                        var pokemonName = pokemonData[pokemonId-1].name;
                        var pokemonLevel = teamPokemonList[x].level;
                        var pokemonTypes = pokemonData[pokemonId-1].types;
                        var $pokemonRow = 
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

    $(".js-submit").click(assessChangesAndSubmit);

    function assessChangesAndSubmit() {
        var formDataAsArray = $("#js-team-edits").serializeArray();
        var dataToSend = {};
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
                url: teamApiUrl,
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify(dataToSend),
                success: function(data) {
                    window.location.pathname = teamHomeUrl;
                }
            });
        } else {
            window.location.pathname = teamHomeUrl;
        }
        return false;
    }

    function changeLevelIfUpdated(n) {
        var idForLevelUpdate = `${n.name}`.slice(5);
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
        var pokemon = $(this).attr("value");
        $(this).closest("tr").hide();
        for (i = 0; i < teamPokemonList.length; i++) {
            if (teamPokemonList[i]["pokemon_id"] == pokemon){
                teamPokemonList.splice(i, 1);
                anyPokemonChanges = true;
            }
        }
    }
});

