const parent = document.getElementById("parent");

window.onload = async function () {
  const questions = await (await fetch("/assets/data/faa_ba.json")).json();
  class Quiz extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        index: 0,
        score: 0,
        maxScore: 0,
        statusText: "",
      };
    }

    handleClick(option, allOptions) {
      console.log(option);
      console.log(allOptions);
      let nextStatus = "This question was worth no points, and didn't matter.";
      let bestWeight = 0;
      allOptions.forEach((_option, _index) => {
        if (_option["weight"] > bestWeight) {
          bestWeight = _option["weight"];
          nextStatus =
            bestWeight === option["weight"]
              ? `You picked the best option, worth ${_option["weight"]} points!`
              : `The best option was '${String.fromCharCode(65 + _index)}. ${
                  _option["description"]
                }', worth ${_option["weight"]} points.`;
        }
      });
      this.setState((prevState) => ({
        score: prevState.score + option["weight"],
        maxScore: prevState.maxScore + bestWeight,
        index: prevState.index + 1,
        statusText: nextStatus,
      }));
    }

    render() {
      return React.createElement(
        "div",
        { id: "container" },
        React.createElement("p", null, this.state.statusText),
        React.createElement(
          "p",
          null,
          `Score: ${this.state.score}/${this.state.maxScore}`
        ),
        React.createElement(
          "h1",
          null,
          `${this.state.index + 1}. ${questions[this.state.index]["question"]}`
        ),
        ...questions[this.state.index]["options"].map(
          (option, index, allOptions) =>
            React.createElement(
              "wired-button",
              {
                onClick: () => {
                  this.handleClick(option, allOptions);
                },
              },
              `${String.fromCharCode(65 + index)}. ${option["description"]}`
            )
        )
      );
    }
  }
  const root = ReactDOM.createRoot(parent);
  root.render(React.createElement(Quiz));
};
