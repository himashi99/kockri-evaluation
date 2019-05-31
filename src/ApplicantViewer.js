import React from "react";
import VideoComponent from "./VideoComponent";
import Comment from "./Comment";

function ApplicantViewer(props) {
  return (
    <div>
      <div>
        <h2>Name: {props.candidate.name}</h2>
        <h3>Id: {props.candidate.id}</h3>

        {props.candidateVideos.map((video, index) => (
          <div key={props.candidate.id + index}>
            <VideoComponent src={video.src} title={video.question} />
            <Comment
              applicationId={video.applicationId}
              questionId={video.questionId}
              save={props.save}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicantViewer;
