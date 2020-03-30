// Your code starts here
$(document).ready(function() {

    $.ajax({
        method: "GET",
        url: "../api/" + window.location.pathname,
        success: function(data) {
            teamName = `<h1>${data.name}</h1>`;
            teamDescription = `<p>${data.description}</p>`;
            $(".js-header")
                .append(teamName)
                .append(teamDescription);
            pokemonList = data.members;
            $.ajax({
                method: "GET",
                url: "../api/pokemon",
                success: function(pokemonData) {

                    for (x = 0; x < pokemonList.length; x++) {
                        currentPokemon = pokemonList[x].pokemon_id;
                        $pokemonRow = 
                        `<tr>
                            <td><img class="poke-image" src=${pokemonData[currentPokemon-1].image_url}></td>
                            <td><a href="/pokemon/${currentPokemon}">${pokemonData[currentPokemon-1].name}</a></td>
                            <td>${pokemonList[x].level}</td>
                            <td>${pokemonData[currentPokemon-1].types}</td>
                        </tr>`;
                        $(".js-teams-pokemon").append($pokemonRow);
                    }
                }
            })
            
        }
    });

    $(".js-edit").attr("href", `${window.location.pathname}/edit`);
    $(".js-delete").click(deleteTeam);


    function deleteTeam() {
        $.ajax({
            method: "DELETE",
            url: "../api" + window.location.pathname,
            success: function() {
                console.log("deletion success");
                window.location.pathname = "/";
            }
        })
    }

});

