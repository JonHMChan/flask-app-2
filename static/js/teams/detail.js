// Your code starts here
$(document).ready(function() {

    $.ajax({
        method: "GET",
        url: "../api/" + window.location.pathname,
        success: function(data) {
            var teamName = `<h1>${data.name}</h1>`;
            var teamDescription = `<p>${data.description}</p>`;
            var teamPokemonList = data.members;
            $(".js-header")
                .append(teamName)
                .append(teamDescription);

            $.ajax({
                method: "GET",
                url: "../api/pokemon",
                success: function(pokemonData) {
                    for (x = 0; x < teamPokemonList.length; x++) {
                        var currentPokemon = teamPokemonList[x].pokemon_id;
                        var $pokemonRow = 
                        `<tr>
                            <td><img class="poke-image" src=${pokemonData[currentPokemon-1].image_url}></td>
                            <td><a href="/pokemon/${currentPokemon}">${pokemonData[currentPokemon-1].name}</a></td>
                            <td>${teamPokemonList[x].level}</td>
                            <td>${pokemonData[currentPokemon-1].types}</td>
                        </tr>`;
                        $(".js-teams-pokemon").append($pokemonRow);
                    }
                }
            });
            
        }
    });

    $(".js-edit").attr("href", `${window.location.pathname}/edit`);
    $(".js-delete").click(deleteTeam);

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

