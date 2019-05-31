import React from "react";
import ApplicantViewer from "./ApplicantViewer";
import axios from "axios";

class CandidateViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.selectedCandidate = null;
    this.state.data = {
      candidates: [],
      applications: [],
      questions: []
    };
  }

  // this function is actually passed down to the <Comment /> comment which calls it
  // i did this because I needed the entire payload to make the update (instead of per video)
  // since I basically have the structure as is and because the payload need to contain all videos
  // this was easier to do
  save = (applicationId, questionId, name, comment) => {
    let payload = this.getApplicationById(applicationId);
    let path = `http://localhost:3010/applications/${applicationId}`;
    // patch the comment in
    let newComment = { name, comment };
    // these will update the state however, since we are
    // not displaying the comments setState is not called to update the UI
    payload.videos.map(video => {
      if (video.questionId === questionId) {
        // I think it made sense to make comments and array, multiple
        // comments were left for the same video
        if (Array.isArray(video.comments)) {
          video.comments.push(newComment);
        } else {
          video.comments = [newComment];
        }
      }
      return video;
    });

    axios
      .put(path, payload, { headers: { "Content-Type": "application/json" } })
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };

  componentDidMount() {
    let base = "http://localhost:3010";
    // using the axios library to make API calls to the local server
    // this makes all three api calls at once, then spreads them as
    // arguments on the callback function
    axios
      .all([
        axios.get(`${base}/candidates`),
        axios.get(`${base}/applications`),
        axios.get(`${base}/questions`)
      ])
      .then(
        axios.spread((candidates, applications, questions) => {
          this.setState({
            data: {
              candidates: candidates.data,
              applications: applications.data,
              questions: questions.data
            }
          });
        })
      )
      .catch(err => {
        console.log(err);
      });
  }

  handleSelectedCandidate = event => {
    // convert string to number
    if (event.target.value !== "default") {
      let id = parseInt(event.target.value, 10);

      // find the selected person from the array of candidates
      // this map returns an array and there aren't duplicate candidates
      // i use .pop() to get the item out of the array
      let selectedPerson = this.state.data.candidates
        .filter(person => {
          if (person.id === id) {
            return person;
          }
          return false;
        })
        .pop();
      // i also take thie opportunity to create a simipler
      // data structure to pass down to child components, it contains
      // all the candidates information (i.e. question, videos)
      // i pass in the selected person's id in to getCandidateVideos
      // since state wouldn't be set yet
      this.setState({
        selectedCandidate: selectedPerson,
        candidateVideos: this.getCandidateVideos(selectedPerson.applicationId)
      });
    } else {
      this.setState({ selectedCandidate: null });
    }
  };

  isApplicant = () => {
    if (this.state.selectedCandidate) {
      return this.state.selectedCandidate.hasOwnProperty("applicationId");
    }
    return false;
  };

  // this function creates an easier to work with data structure for child
  // components
  getCandidateVideos = applicationId => {
    if (applicationId) {
      let application = this.state.data.applications
        .filter(application => {
          return application.id === applicationId;
        })
        .pop();

      let videoAndQuestions = application.videos.map(video => {
        let question = this.getQuestionById(video.questionId);
        return {
          applicationId: application.id,
          questionId: question.id,
          question: question.question,
          src: video.src,
          comments: video.comments
        };
      });
      return videoAndQuestions;
    } else {
      return null;
    }
  };

  getQuestionById = id => {
    return this.state.data.questions
      .filter(question => question.id === id)
      .pop();
  };

  getApplicationById = id => {
    return this.state.data.applications
      .filter(application => {
        return application.id === id;
      })
      .pop();
  };

  render() {
    // this would normally be much clearner, however I was running short on time
    let showDetails;
    if (this.isApplicant()) {
      // the if here ensures I don't need to had null checks within
      // the child components themselves, if I had more time I would have
      // liked to try writing tests for them
      showDetails = (
        <ApplicantViewer
          candidate={this.state.selectedCandidate}
          candidateVideos={this.state.candidateVideos}
          save={this.save}
        />
      );
    } else {
      showDetails = <h3>Not an applicant.</h3>;
    }

    let candidates;
    if (this.state.data.candidates.length) {
      candidates = this.state.data.candidates.map((person, index) => {
        return (
          <option key={index} value={person.id}>
            {person.name}
          </option>
        );
      });
    }

    return (
      <div>
        <select onChange={this.handleSelectedCandidate}>
          <option value="default">Select Candidate</option>
          {candidates}
        </select>
        <div>{showDetails}</div>
      </div>
    );
  }
}

export default CandidateViewer;
