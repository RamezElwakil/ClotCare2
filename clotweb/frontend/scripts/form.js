document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("riskForm");
  const resultBox = document.getElementById("resultBox");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      resultBox.style.display = "block";
      resultBox.style.color = "#ccc";
      resultBox.innerHTML = "⏳ Predicting risk...";

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.error) {
        resultBox.innerHTML = `❌ ${result.error}`;
        resultBox.style.color = "crimson";
      } else {
        const riskColor =
          result.risk_level === "Severe Risk" ? "darkred" :
          result.risk_level === "High Risk" ? "orangered" :
          result.risk_level === "Medium Risk" ? "orange" : "limegreen";

        resultBox.innerHTML = `
          ✅ ${result.message}<br>
          <strong style="color:${riskColor}; font-size:1.2rem">${result.risk_level}</strong>
        `;
      }

    } catch (err) {
      console.error("❌ Error fetching result", err);
      resultBox.innerHTML = "❌ Server error. Try again.";
      resultBox.style.color = "red";
    }
  });
});
