
let currentQuestions = [];

fetch("quiz.json")
  .then(response => response.json())
  .then(data => {
    currentQuestions = data.questions;
    loadQuiz(currentQuestions);
  });

function loadQuiz(questions) {
  const form = document.getElementById("quizForm");
  form.innerHTML = "";
  questions.forEach((q, idx) => {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = `${idx + 1}. ${q.question} (${q.points} Points)`;
    fieldset.appendChild(legend);

    q.options.forEach((opt, i) => {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `q${idx}`;
      radio.value = i;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(opt));
      fieldset.appendChild(label);
      fieldset.appendChild(document.createElement("br"));
    });

    form.appendChild(fieldset);
  });
}

function submitQuiz() {
  let score = 0;
  currentQuestions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="q${idx}"]:checked`);
    if (selected && parseInt(selected.value) === q.answer) {
      score += q.points;
    }
  });

  const user = prompt("Enter your name for the certificate:");
  if (user) {
    const certUrl = `certificate.html?name=${encodeURIComponent(user)}&score=${score}`;
    window.location.href = certUrl;
  }
}
