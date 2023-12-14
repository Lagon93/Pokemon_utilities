import React, { useState } from 'react';
import Pokedex from './components/Pokedex';
import TypesTable from './components/TypesTable';
import './App.css';

const utilities = [
  {
    title: 'Tabla de Tipos',
    description: 'Explore los diferentes tipos de Pokémon.',
    component: <TypesTable />,
    image: 'https://images.wikidexcdn.net/mwuploads/wikidex/3/3e/latest/20191204205954/Aut%C3%B3grafo_grupo.png',
  },
  {
    title: 'Pokédex',
    description: 'Encuentra información detallada sobre Pokémon.',
    component: <Pokedex />,
    image: 'https://images.wikidexcdn.net/mwuploads/wikidex/b/b1/latest/20091205105305/Memor%C3%ADn.png',
  },
];

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [openCards, setOpenCards] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCardClick = (index) => {
    if (openCards.includes(index)) {
      // Si la card ya está abierta, la cerramos
      setOpenCards(openCards.filter((openIndex) => openIndex !== index));
    } else {
      // Si la card está cerrada, la abrimos
      setOpenCards([...openCards, index]);
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className="navbar">
        <h1>Pokémon Utilities</h1>
        <div className="mode-toggle" onClick={toggleDarkMode}>
          <img
            className="mode-icon"
            src={darkMode ? '/Umbreon.png' : '/Espeon.png'}
            alt={darkMode ? 'Modo Oscuro' : 'Modo Claro'}
          />
        </div>
      </div>
      <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
        {utilities.map((utility, index) => (
          <div key={index} className={`card ${darkMode ? 'dark-card' : ''} ${openCards.includes(index) ? 'active' : ''}`} onClick={() => handleCardClick(index)}>
            <div className="card-content">
              <img src={utility.image} alt={utility.title} />
              <div className="card-text">
                <h5 className="card-title">{utility.title}</h5>
                <p>{utility.description}</p>
                {openCards.includes(index) && utility.component}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
