let quizData = {};
let userAnswers = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      quizData = data;
      renderQuiz(data);
    });
});

function renderQuiz(data) {
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = `<h2>${data.quizTitle}</h2>`;
  data.questions.forEach((q, index) => {
    const optionsHTML = q.options.map(opt =>
      `<label><input type="radio" name="q${index}" value="${opt}"> ${opt}</label><br>`
    ).join('');
    quizContainer.innerHTML += `
      <div style="margin-bottom:20px;">
        <p><b>Q${index + 1}: ${q.question}</b></p>
        ${optionsHTML}
      </div>`;
  });
}

function submitQuiz() {
  userAnswers = [];
  let score = 0;

  quizData.questions.forEach((q, index) => {
    const selected = document.querySelector(`input[name=q${index}]:checked`);
    const ans = selected ? selected.value : "";
    userAnswers.push({ question: q.question, selected: ans, correct: q.answer });

    if (ans === q.answer) score++;
  });

  const name = prompt("Enter your name:");
  document.getElementById("score-display").innerHTML = `<h3>${name}, your score: ${score}/${quizData.questions.length}</h3>`;
  
  // Store for certificate
  document.getElementById("cert-name").textContent = name;
  document.getElementById("cert-score").textContent = `Score: ${score}/${quizData.questions.length}`;
  document.getElementById("cert-quiz-title").textContent = quizData.quizTitle;

  document.getElementById("download-btn").style.display = "inline-block";

  // Optionally show export
  exportToExcel();
}

function downloadCertificate() {
  document.getElementById("certificate").style.display = "block";
  html2pdf().from(document.getElementById("certificate")).save("certificate.pdf");
  document.getElementById("certificate").style.display = "none";
}

function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [
    ["Question", "Your Answer", "Correct Answer"]
  ];

  userAnswers.forEach(ans => {
    ws_data.push([ans.question, ans.selected, ans.correct]);
  });

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Quiz Answers");

  XLSX.writeFile(wb, "quiz_answers.xlsx");
}
