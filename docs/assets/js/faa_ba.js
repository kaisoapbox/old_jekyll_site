const parent = document.getElementById("parent");

window.onload = async function () {
  const questions = await (await fetch("/assets/data/faa_ba.json")).json();

  function randomCompliment() {
    const compliments = [
      "Are you an NBCFAE member?",
      "You're good at this.",
      "Maybe you do have what it takes after all.",
      "Are you cheating?",
      "Lucky guess.",
      "You're practically tailor-made for the FAA.",
      "You're killing it.",
      "You're doing great.",
      "I guess you're ATC material then.",
      "Maybe you were an ATC in a past life.",
      "If you don't think about it too hard, this basically makes you Kennedy Steve.",
    ];
    const random = Math.floor(Math.random() * compliments.length);
    return compliments[random];
  }

  function randomAdmonishment() {
    const admonishments = [
      "You should've known.",
      "Are you just guessing?",
      "You'll get it next time.",
      "I'm not sure you're cut out for this.",
      "That's got to sting.",
      "Ouch.",
      "Try thinking harder before answering the next one.",
      "Are you sure you're trying?",
      "I don't think you're ATC material.",
      "Guess you're not what the FAA is looking for.",
      "Have you considered lying?",
      "Try lying next time.",
      "Next time, try selecting the correct answer.",
      "I recommend choosing the correct answer next time.",
      "That one was a doozy!",
      "Tricky one.",
      "Hope you kept the day job.",
    ];
    const random = Math.floor(Math.random() * admonishments.length);
    return admonishments[random];
  }
  class Quiz extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        index: 0,
        score: 0,
        maxScore: 0,
        statusText:
          "Do you have what it takes to pass the FAA Behavioural Assessment to become an ATC? You need 114 points to pass.",
      };
    }

    handleClick(option, allOptions) {
      console.log(option);
      console.log(allOptions);
      let nextStatus = "That question was worth no points, and didn't matter.";
      let bestWeight = 0;
      allOptions.forEach((_option, _index) => {
        if (_option["weight"] > bestWeight) {
          bestWeight = _option["weight"];
          nextStatus =
            bestWeight === option["weight"]
              ? `You picked the best option, worth ${
                  _option["weight"]
                } points! ${randomCompliment()}`
              : `The best option was '${String.fromCharCode(65 + _index)}. ${
                  _option["description"]
                }', worth ${_option["weight"]} points. ${randomAdmonishment()}`;
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
      if (this.state.index === questions.length) {
        return React.createElement(
          "div",
          null,
          `Congratulations, you got ${this.state.score} out of a possible ${this.state.maxScore}. Remember, you need 114 to become an ATC.`
        );
      }
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
