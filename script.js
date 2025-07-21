let questions = [];
let userAnswers = [];

window.onload = async function () {
  const response = await fetch('questions.json');
  const data = await response.json();
  questions = data.questions;
  document.getElementById("quizTitle").textContent = data.quizTitle;
  document.getElementById("questionEditor").value = JSON.stringify(data, null, 2);
  renderQuiz();
};

function renderQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p class="font-semibold">${index + 1}. ${q.question}</p>
      ${q.options.map(opt => `
        <label class="block">
          <input type="radio" name="q${index}" value="${opt}" class="mr-2">
          ${opt}
        </label>
      `).join("")}
    `;
    container.appendChild(div);
  });
}

function submitQuiz() {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Please enter your name");

  let score = 0;
  userAnswers = [];

  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const answer = selected ? selected.value : "Not Answered";
    if (answer === q.answer) score++;
    userAnswers.push({ Question: q.question, Selected: answer, Correct: q.answer });
  });

  document.getElementById("certContent").innerHTML =
    `<b>${name}</b> scored <b>${score}/${questions.length}</b> in "<b>${document.getElementById("quizTitle").textContent}</b>"`;

  document.getElementById("certificate").classList.remove("hidden");
}

function downloadCertificate() {
  html2pdf().from(document.getElementById("certificate")).save("certificate.pdf");
}

function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(userAnswers);
  XLSX.utils.book_append_sheet(wb, ws, "Answers");
  XLSX.writeFile(wb, "quiz_answers.xlsx");
}

function saveQuestions() {
  try {
    const json = JSON.parse(document.getElementById("questionEditor").value);
    localStorage.setItem("questionsBackup", JSON.stringify(json)); // Optional local backup
    questions = json.questions;
    document.getElementById("quizTitle").textContent = json.quizTitle;
    renderQuiz();
    alert("Questions updated successfully!");
  } catch (e) {
    alert("Invalid JSON: " + e.message);
  }
}
