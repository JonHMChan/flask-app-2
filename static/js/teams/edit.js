// Your code starts here

// Your code starts here
$(document).ready(function() {

    teamUrlArray = window.location.pathname.split("/");

    $.ajax({
        method: "GET",
        url: `/api/${teamUrlArray[1]}/${teamUrlArray[2]}`,
        success: function(data) {
            teamName = `${data.name}`;
            teamDescription = `${data.description}`;

            $(".js-back").attr("href",`/teams/${data.id}`);
            $(".js-team-name-input").attr("value",`${teamName}`);
            $(".js-team-description-input").text(`${teamDescription}`);
            teamPokemonList = data.members;
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
                                <input type="number" name="Pokemon Level" value="${pokemonLevel}" class="level-input" form="team-edits">
                            </td>
                            <td>${pokemonTypes}</td>
                            <td><button type="button" form="team-edits" name="Remove Pokemon" value="${pokemonId}">Remove</td>
                        </tr>`;

                        $(".js-teams-pokemon").append($pokemonRow);
                    }
                }
            })
            
        }
    });

   // $(".js-edit").attr("href", `${window.location.pathname}/edit`);
    //$(".js-delete").click(deleteTeam);


    function deleteTeam() {
        $.ajax({
            method: "DELETE",
            url: "../api" + window.location.pathname,
            success: function(data) {
                window.location.pathname = "/";
            }
        })
    }

});

