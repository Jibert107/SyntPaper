import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Vex from 'vexflow';

function App() {
  const [synth, setSynth] = useState(null);
  const [notes, setNotes] = useState([]);
  const [instrument, setInstrument] = useState('synth');
  const [staveNotes, setStaveNotes] = useState([]);
  const rendererRef = useRef(null);
  const contextRef = useRef(null);
  const staveRef = useRef(null);

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
    const newSynth = instruments[instrument]().toDestination();
    setSynth(newSynth);
    return () => {
      if (synth) synth.dispose();
    };
  }, [instrument]);

  useEffect(() => {
    // Initialisation de la partition
    const VF = Vex.Flow;
    const div = document.getElementById("music-sheet");
    div.innerHTML = ''; // Nettoyer le contenu précédent

    // Calculer la largeur en fonction de la fenêtre
    const width = Math.min(window.innerWidth - 60, 1200);
    
    rendererRef.current = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    rendererRef.current.resize(width, 150);
    
    contextRef.current = rendererRef.current.getContext();
    contextRef.current.setFont("Arial", 10);
    
    staveRef.current = new VF.Stave(10, 40, width - 20);
    staveRef.current
      .addClef("treble")
      .addTimeSignature("4/4")
      .setContext(contextRef.current)
      .draw();

    // Gestionnaire de redimensionnement
    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth - 60, 1200);
      rendererRef.current.resize(newWidth, 150);
      div.innerHTML = '';
      staveRef.current = new VF.Stave(10, 40, newWidth - 20);
      staveRef.current
        .addClef("treble")
        .addTimeSignature("4/4")
        .setContext(contextRef.current)
        .draw();
      drawAllNotes();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const drawAllNotes = () => {
    if (!contextRef.current || !staveRef.current || staveNotes.length === 0) return;

    const VF = Vex.Flow;
    contextRef.current.clear();
    staveRef.current.setContext(contextRef.current).draw();

    // Créer une voix avec le bon nombre de beats
    const voice = new VF.Voice({
      num_beats: staveNotes.length,
      beat_value: 4,
      resolution: VF.RESOLUTION
    });

    // Ajouter les notes à la voix
    voice.addTickables(staveNotes);

    // Créer et appliquer le formateur
    const formatter = new VF.Formatter();
    formatter
      .joinVoices([voice])
      .format([voice], staveRef.current.getWidth() - 100);

    // Dessiner la voix
    voice.draw(contextRef.current, staveRef.current);
  };

  useEffect(() => {
    drawAllNotes();
  }, [staveNotes]);

  const addNoteToStave = (noteName) => {
    const VF = Vex.Flow;
    // Convertir le format de note pour VexFlow (ex: C4 -> c/4)
    const [pitch, octave] = noteName.split('');
    const vexFlowNote = `${pitch.toLowerCase()}/${octave}`;
    
    const newNote = new VF.StaveNote({
      clef: "treble",
      keys: [vexFlowNote],
      duration: "q"
    });

    setStaveNotes(prev => {
      const newNotes = [...prev, newNote];
      // Garder seulement les 8 dernières notes pour une meilleure lisibilité
      if (newNotes.length > 8) {
        return newNotes.slice(-8);
      }
      return newNotes;
    });
  };

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

  const handleKeyDown = (event) => {
    const note = keyMap[event.key.toLowerCase()];
    if (note && synth) {
      synth.triggerAttackRelease(note, '8n');
      setNotes(prev => [...prev, `${instrumentNames[instrument]}: ${note}`]);
      addNoteToStave(note);
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
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: '20px' }}>
        <p>Utilisez les touches Q-S-D-F-G-H-J-K pour jouer des notes</p>
      </div>

      {/* Partition de musique */}
      <div id="music-sheet" style={{ 
        marginTop: '20px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}></div>

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
                addNoteToStave(note);
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

      {/* Historique des notes */}
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
