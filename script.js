
function submitQuiz() {
  const name = document.getElementById("participantName").value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }

  let score = 0;
  if (document.querySelector('input[name="q1"]:checked')?.value === "correct") score += 1;
  if (document.querySelector('input[name="q2"]:checked')?.value === "correct") score += 1;

  document.getElementById("quiz").style.display = "none";
  document.getElementById("certificate").style.display = "block";

  document.getElementById("certName").textContent = name;
  document.getElementById("certScore").textContent = "Score: " + score + "/2";

  // Create a PDF using html2canvas + jsPDF
  html2canvas(document.getElementById("certificate")).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    const link = document.getElementById("downloadBtn");
    link.href = pdf.output('bloburl');
  });
}
