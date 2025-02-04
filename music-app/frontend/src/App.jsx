import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

function App() {
  const [synth, setSynth] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Initialiser le synthétiseur
    const newSynth = new Tone.Synth().toDestination();
    setSynth(newSynth);
  }, []);

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
      setNotes(prev => [...prev, note]);
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Music App</h1>
      
      {/* Instructions */}
      <div style={{ marginBottom: '20px' }}>
        <p>Utilisez les touches Q-S-D-F-G-H-J-K pour jouer des notes</p>
      </div>

      {/* Piano */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '20px' 
        }}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        {Object.entries(keyMap).map(([key, note]) => (
          <div
            key={key}
            style={pianoKey}
            onClick={() => {
              if (synth) {
                synth.triggerAttackRelease(note, '8n');
                setNotes(prev => [...prev, note]);
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
        minHeight: '50px'
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