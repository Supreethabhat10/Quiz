function generateCertificate() {
  const name = document.getElementById("participantName").value.trim();
  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  fetch("certificate-template.html")
    .then(response => response.text())
    .then(template => {
      const filledTemplate = template.replace("{{name}}", name);
      const container = document.getElementById("certificateArea");
      container.innerHTML = filledTemplate;
      container.style.display = "block";

      const opt = {
        margin: 0,
        filename: `Certificate_${name.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };

      html2pdf().set(opt).from(container).save();
    });
}
