export function getPokemonId(url: string): number 
{
    return parseInt(url.split("/").at(-2)!, 10);
}

export function getPokemonArtwork(id: string | number): string 
{
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function formatPokemonWeight(weight?: number): string 
{
    if(!weight) return "";
    return (weight / 10).toString().replace('.', ',') + " kg";
}

export function formatPokemonHeight(height?: number): string 
{
    if(!height) return "";
    return (height / 10).toString().replace('.', ',') + " m";
}

export function formatStatName(name: string): string 
{
    return name.replaceAll("special", "S")
    .replaceAll("-", "")
    .replaceAll("attack", "Atk")
    .replaceAll("defense", "Def")
    .replaceAll("speed", "Spd")
    .toUpperCase();
}