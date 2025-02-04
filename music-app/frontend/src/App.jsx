import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

function App() {
  const [synth, setSynth] = useState(null);
  const [notes, setNotes] = useState([]);
  const [instrument, setInstrument] = useState('synth');

  // Définition des différents instruments
  const instruments = {
    synth: () => new Tone.Synth(),
    piano: () => new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }),
    am: () => new Tone.AMSynth(),
    fm: () => new Tone.FMSynth(),
    membrane: () => new Tone.MembraneSynth(),
  };

  // Noms d'affichage des instruments
  const instrumentNames = {
    synth: 'Synthétiseur',
    piano: 'Piano',
    am: 'AM Synth',
    fm: 'FM Synth',
    membrane: 'Percussion',
  };

  useEffect(() => {
    // Créer et connecter le nouvel instrument
    const newSynth = instruments[instrument]().toDestination();
    setSynth(newSynth);

    // Nettoyer l'ancien synthétiseur
    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, [instrument]); // Recréer le synthétiseur quand l'instrument change

  // Mapping des touches du clavier aux notes
  const keyMap = {
    'q': 'C4',
    's': 'D4',
    'd': 'E4',
    'f': 'F4',
    'g': 'G4',
    'h': 'A4',
    'j': 'B4',
    'k': 'C5'
  };

  // Gérer l'appui sur une touche
  const handleKeyDown = (event) => {
    const note = keyMap[event.key.toLowerCase()];
    if (note && synth) {
      synth.triggerAttackRelease(note, '8n');
      setNotes(prev => [...prev, `${instrumentNames[instrument]}: ${note}`]);
    }
  };

  // Style pour les touches du piano
  const pianoKey = {
    width: '50px',
    height: '150px',
    margin: '2px',
    backgroundColor: 'white',
    border: '1px solid black',
    cursor: 'pointer'
  };

  const selectStyle = {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Music App</h1>
      
      {/* Sélection d'instrument */}
      <div style={{ marginBottom: '20px' }}>
        <select 
          value={instrument} 
          onChange={(e) => setInstrument(e.target.value)}
          style={selectStyle}
        >
          {Object.entries(instrumentNames).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: '20px' }}>
        <p>Utilisez les touches Q-S-D-F-G-H-J-K pour jouer des notes</p>
      </div>

      {/* Piano */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px'
        }}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        {Object.entries(keyMap).map(([key, note]) => (
          <div
            key={key}
            style={{
              ...pianoKey,
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
            onClick={() => {
              if (synth) {
                synth.triggerAttackRelease(note, '8n');
                setNotes(prev => [...prev, `${instrumentNames[instrument]}: ${note}`]);
              }
            }}
          >
            <div style={{ textAlign: 'center', marginTop: '120px' }}>
              {key.toUpperCase()}
              <br />
              {note}
            </div>
          </div>
        ))}
      </div>

      {/* Affichage des notes jouées */}
      <div style={{ 
        marginTop: '20px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        minHeight: '50px',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <h3>Notes jouées :</h3>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {notes.map((note, index) => (
            <div
              key={index}
              style={{
                padding: '5px 10px',
                backgroundColor: '#e0e0e0',
                borderRadius: '3px'
              }}
            >
              {note}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App; 