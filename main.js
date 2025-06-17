
const scores = {
  "Thinkific": 0, "Kajabi": 0, "LearnWorlds": 0, "Zenler": 0, "Mighty Networks": 0, "Circle": 0
};

const logic = {
  q1: {
    "Just getting started": {Thinkific:2,Kajabi:1,Zenler:2},
    "I've sold a course before": {LearnWorlds:2,Kajabi:2,Thinkific:1},
    "I run a growing online education business": {Kajabi:3,LearnWorlds:2,"Mighty Networks":1}
  },
  q2: {
    "Simple on-demand courses": {Thinkific:2,Zenler:2},
    "Live cohorts or bootcamps": {LearnWorlds:3,Kajabi:1},
    "Coaching or membership community": {Kajabi:2,"Mighty Networks":3,Circle:3},
    "A mix of all of the above": {Kajabi:3,LearnWorlds:2}
  },
  q3: {
    "$0–50": {Thinkific:2,Zenler:3},
    "$51–150": {LearnWorlds:2,Thinkific:1},
    "$151+": {Kajabi:3,"Mighty Networks":1}
  },
  q4: {
    "Not at all—keep it simple": {Thinkific:2,Kajabi:2},
    "I'm fine with a little setup": {Zenler:2,LearnWorlds:2},
    "I like to customize things deeply": {LearnWorlds:3,Circle:2}
  },
  q5: {
    "Launch quickly": {Thinkific:2,Zenler:2},
    "Look professional": {Kajabi:2,LearnWorlds:2},
    "Automate and scale": {Kajabi:3,LearnWorlds:2},
    "Build community engagement": {"Mighty Networks":3,Circle:3}
  }
};

window.addEventListener('load', function () {
  console.log("Script loaded and DOM ready.");
  const next = document.getElementById('next');
  const form = document.getElementById('quizForm');
  const emailDiv = document.getElementById('email-capture');

  if (!next || !form || !emailDiv) {
    console.error("One or more required elements not found.");
    return;
  }

  next.addEventListener('click', () => {
    Object.keys(scores).forEach(k => scores[k] = 0);
    for (let i = 1; i <= 5; i++) {
      const val = document.getElementById('q' + i).value;
      if (!val || !logic['q' + i][val]) return alert('Please complete all questions.');
      Object.entries(logic['q' + i][val]).forEach(([platform, pts]) => {
        scores[platform] += pts;
      });
    }
    emailDiv.style.display = 'block';
    next.style.display = 'none';
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    if (!email) return alert('Please enter a valid email.');

    const topPlatform = Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0];
    console.log('Sending to Zapier:', { email, name, topPlatform });

    fetch("https://hooks.zapier.com/hooks/catch/241573/uotck8x/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, topPlatform })
    })
    .then(res => {
      if (!res.ok) throw new Error("Webhook failed");
      window.location.href = "https://www.learningrevolution.net/thankyou/platform-quiz/";
    })
    .catch(err => {
      alert('There was an issue submitting your information. Please try again later.');
      console.error(err);
    });
  });
});
