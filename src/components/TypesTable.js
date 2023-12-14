// src/components/TypesTable.js
import React, { useEffect, useState } from 'react';
import './TypesTable.css'; // Importar los estilos



const TypesTable = () => {
  const [typeData, setTypeData] = useState([]);
  const [damageRelations, setDamageRelations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type/');
        const data = await response.json();
        // Filtramos los tipos "unknown" y "shadow"
        const filteredTypes = data.results.filter((type) => type.name !== 'unknown' && type.name !== 'shadow');
        setTypeData(filteredTypes);
      } catch (error) {
        console.error('Error fetching type data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchDamageRelations = async (typeName) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
      const data = await response.json();
      return {
        type: typeName,
        noDamageTo: data.damage_relations.no_damage_to.map((damageType) => damageType.name),
        halfDamageTo: data.damage_relations.half_damage_to.map((damageType) => damageType.name),
        doubleDamageTo: data.damage_relations.double_damage_to.map((damageType) => damageType.name),
      };
    } catch (error) {
      console.error(`Error fetching damage relations for ${typeName}:`, error);
      return {
        type: typeName,
        noDamageTo: [],
        halfDamageTo: [],
        doubleDamageTo: [],
      };
    }
  };

  useEffect(() => {
    const fetchAllDamageRelations = async () => {
      const relations = await Promise.all(typeData.map((type) => fetchDamageRelations(type.name)));
      setDamageRelations(relations);
    };

    if (typeData.length > 0) {
      fetchAllDamageRelations();
    }
  }, [typeData]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <h3>Tabla de Tipos</h3>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Daño x0</th>
            <th>Daño x0.5</th>
            <th>Daño x2</th>
          </tr>
        </thead>
        <tbody>
          {damageRelations.map((relation) => (
            <tr key={relation.type}>
              <td>
                <img src={process.env.PUBLIC_URL + '/tipos/' + relation.type + '.png'} alt={relation.type} />
              </td>
              <td>
                {relation.noDamageTo.length > 0 ? (
                  relation.noDamageTo.map((type) => (
                    <img key={type} src={process.env.PUBLIC_URL + '/tipos/' + type + '.png'} alt={type} />
                  ))
                ) : (
                  '—'
                )}
              </td>
              <td>
                {relation.halfDamageTo.length > 0 ? (
                  relation.halfDamageTo.map((type) => (
                    <img key={type} src={process.env.PUBLIC_URL + '/tipos/' + type + '.png'} alt={type} />
                  ))
                ) : (
                  '—'
                )}
              </td>
              <td>
                {relation.doubleDamageTo.length > 0 ? (
                  relation.doubleDamageTo.map((type) => (
                    <img key={type} src={process.env.PUBLIC_URL + '/tipos/' + type + '.png'} alt={type} />
                  ))
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TypesTable;
