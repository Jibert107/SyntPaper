import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Vex from 'vexflow';

const App = () => {
  const vfRef = useRef(null);
  const notes = useRef([]);

  useEffect(() => {
    const synth = new Tone.Synth().toDestination();

    const handleKeyDown = (event) => {
      const note = getNoteFromKey(event.key);
      if (note) {
        synth.triggerAttackRelease(note, '8n');
        notes.current.push(note);
        drawNotes();
      }
    };

    const getNoteFromKey = (key) => {
      const keyMap = {
        'a': 'C4',
        'w': 'C#4',
        's': 'D4',
        'e': 'D#4',
        'd': 'E4',
        'f': 'F4',
        't': 'F#4',
        'g': 'G4',
        'y': 'G#4',
        'h': 'A4',
        'u': 'A#4',
        'j': 'B4',
        'k': 'C5',
      };
      return keyMap[key];
    };

    const drawNotes = () => {
      const VF = Vex.Flow;
      const div = vfRef.current;
      div.innerHTML = '';

      const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
      renderer.resize(500, 200);
      const context = renderer.getContext();
      const stave = new VF.Stave(10, 40, 400);
      stave.addClef('treble').setContext(context).draw();

      const vexNotes = notes.current.map(note => new VF.StaveNote({
        clef: 'treble',
        keys: [note],
        duration: 'q'
      }));

      const voice = new VF.Voice({ num_beats: vexNotes.length, beat_value: 4 });
      voice.addTickables(vexNotes);

      const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
      voice.draw(context, stave);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <h1>Music App</h1>
      <div ref={vfRef}></div>
    </div>
  );
};

export default App;
