import React from "react";

function VideoComponent(props) {
  return (
    <div>
      <h3>{props.title}</h3>
      <video controls width="500">
        <source src={props.src} type="video/mp4" />
      </video>
    </div>
  );
}

export default VideoComponent;
