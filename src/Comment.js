import React from "react";

// I made this a class component since it has form elements
class Comment extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    this.state.comment = "";
    this.state.name = "";
    this.state.applicationId = props.applicationId;
    this.state.questionId = props.questionId;
    this.state.save = props.save;
  }
  // this just calls the save function is passed to it
  save = () => {
    this.state.save(
      this.state.applicationId,
      this.state.questionId,
      this.state.name,
      this.state.comment
    );
    this.setState({ comment: "", name: "" });
  };

  handleNameInput = event => {
    this.setState({ name: event.target.value });
  };

  handleCommentInput = event => {
    this.setState({ comment: event.target.value });
  };

  render() {
    return (
      <div>
        <p>Leave a comment: </p>
        <textarea
          value={this.state.comment}
          name="comment"
          onChange={this.handleCommentInput}
        />
        <div>
          Name:{" "}
          <input
            value={this.state.name}
            type="text"
            name="name"
            onChange={this.handleNameInput}
          />
        </div>
        <button onClick={this.save}>Submit</button>
      </div>
    );
  }
}

export default Comment;
