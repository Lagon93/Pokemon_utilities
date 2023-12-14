// src/components/Pokedex.js
import React, { useState, useEffect } from 'react';
import './Pokedex.css';

const Pokedex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=5&offset=0`);
      const data = await response.json();

      const filteredSuggestions = data.results
        .filter((result) => result.name.includes(query.toLowerCase()))
        .map((result) => result.name);

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching Pokemon suggestions:', error);
    }
  };

  const fetchPokemonDetails = async (pokemonName) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      const data = await response.json();

      // Información adicional sobre el Pokémon
      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      setPokemonData({
        name: capitalizeFirstLetter(data.name),
        imageUrl: data.sprites.front_default,
        types: data.types.map((type) => ({
          name: type.type.name,
          imageUrl: `tipos/${type.type.name}.png`, // Ruta correcta para las imágenes de tipos
        })),
        weight: data.weight,
        height: data.height,
        generation: speciesData.generation.name,
        genderRatio: getGenderRatio(speciesData.gender_rate),
      });
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      setPokemonData(null);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getGenderRatio = (genderRate) => {
    // Lógica para convertir la tasa de género en una cadena legible
    // Puedes personalizar según sea necesario
    switch (genderRate) {
      case -1:
        return 'Desconocido';
      case 0:
        return 'Solo macho';
      case 1:
        return 'Mayoría macho';
      case 2:
        return 'Equitativo';
      case 3:
        return 'Mayoría hembra';
      case 4:
        return 'Solo hembra';
      default:
        return 'Desconocido';
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    fetchSuggestions(query);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    await fetchPokemonDetails(searchTerm);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    fetchPokemonDetails(suggestion);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar Pokémon"
          onClick={(e) => e.stopPropagation()}
        />
        <button type="submit" onClick={(e) => e.stopPropagation()}>Buscar</button>
      </form>
      {suggestions.length > 0 && (
        <div onClick={(e) => e.stopPropagation()}>
          <p>Sugerencias:</p>
          {suggestions.map((suggestion) => (
            <div key={suggestion} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
      {pokemonData && (
        <div onClick={(e) => e.stopPropagation()}>
          <h2>{pokemonData.name}</h2>
          <div>
            <img src={pokemonData.imageUrl} alt={pokemonData.name} style={{ width: '150px', marginRight: '20px' }} />
            <div>
              <strong>Tipos:</strong>
              {pokemonData.types.map((type) => (
                <img key={type.name} src={type.imageUrl} alt={type.name} style={{ width: '30px', marginRight: '5px' }} />
              ))}
            </div>
            <div>
              <strong>Peso:</strong> {pokemonData.weight}
            </div>
            <div>
              <strong>Altura:</strong> {pokemonData.height}
            </div>
            <div>
              <strong>Generación:</strong> {pokemonData.generation}
            </div>
            <div>
              <strong>Ratio de género:</strong> {pokemonData.genderRatio}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
