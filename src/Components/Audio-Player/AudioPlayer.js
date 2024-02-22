import React, { useState, useEffect } from "react";
import "./AudioPlayer.css";

function AudioPlayer() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioRef, setAudioRef] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const lastPlayedTrackIndex = localStorage.getItem("lastPlayedTrackIndex");
    if (lastPlayedTrackIndex) {
      setCurrentTrackIndex(parseInt(lastPlayedTrackIndex, 10));
    }
  }, []);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const newFiles = Array.from(files);
    setPlaylist((prevPlaylist) => [...prevPlaylist, ...newFiles]);
  };

  const handlePlay = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef
          .play()
          .catch((error) => console.error("Playback error:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    console.log("Current track ended");
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  useEffect(() => {
    localStorage.setItem("lastPlayedTrackIndex", currentTrackIndex.toString());
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef && playlist.length > 0) {
      audioRef.src = URL.createObjectURL(playlist[currentTrackIndex]);
      audioRef.load();
      // Start playing automatically
      audioRef.play().catch((error) => console.error("Playback error:", error));
      setIsPlaying(true); // Update isPlaying state
    }
  }, [currentTrackIndex, audioRef]);

  return (
    <div className="AudioPlayer ">
      <div className="container">
        <div className="row">
          <div className="col-4"></div>
          <div className="col-2 input-audio">
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileChange}
              className="form-control form-control-lg"
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col">
            <div className="img"></div>
            <br />
            <audio
              ref={(element) => setAudioRef(element)}
              controls
              onEnded={handleEnded}
            />

            <br />
            <br />
            <button
              className="btn btn-lg btn-outline-info"
              onClick={handlePlay}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <br />
        <br />
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8 table-box">
            <table className="table table-dark table-hover">
              <tbody>
                {playlist.map((file, index) => (
                  <tr key={index}>
                    <td>{file.name} </td>
                    <td>
                      <button
                        onClick={() => [
                          setCurrentTrackIndex(index),
                          handlePlay(),
                        ]}
                        className="btn btn-outline-info song-btn">
                        {index === currentTrackIndex && isPlaying
                          ? "Pause"
                          : "Play"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
