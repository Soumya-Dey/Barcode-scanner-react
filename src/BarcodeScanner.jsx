import { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';
import successBeep from './assets/success-beep.mp3';

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export const BarcodeScanner = () => {
  const [result, setResult] = useState('');
  const [playing, toggle] = useAudio(successBeep);

  const {
    ref,
    torch: { on, off, isOn, isAvailable },
  } = useZxing({
    onDecodeResult(result) {
      console.log(
        `Scanned ${result.getText()} at ${new Date(
          result.getTimestamp()
        ).toUTCString()}`
      );
      toggle();
      setResult(result.getText());
    },
  });

  return (
    <div className='container'>
      <h2>Barcode Scanner</h2>
      <div className='content'>
        <div className='video'>
          <video ref={ref} />
          {isAvailable && (
            <button onClick={() => (isOn ? off() : on())}>
              {isOn ? 'Turn off' : 'Turn on'} torch
            </button>
          )}
        </div>
        <table className='results'>
          <thead>
            <tr>
              <td>Result</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{result}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
