// document.getElementById("loginForm").addEventListener("submit", function(e) {
//   e.preventDefault();
//   const email = document.getElementById("loginEmail").value.trim();
//   const password = document.getElementById("loginPassword").value;
//   const message = document.getElementById("loginMessage");
//   if (!email || !password) return;
//   // Frontend demo only. Connect this to your friend's authentication API later.
//   localStorage.setItem("wanderly_user", JSON.stringify({ email }));
//   message.textContent = "Signing in...";
//   setTimeout(() => { window.location.href = "app.html"; }, 500);
// });

const loginForm = document.querySelector(".login-form")
    || document.querySelector("form");

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");
    const button = loginForm.querySelector('button[type="submit"]');

    message.textContent = "";

    if (!email || !password) {
        message.textContent = "Please enter your email and password.";
        return;
    }

    if (button) button.disabled = true;
    message.textContent = "Logging in...";

    try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const response = await fetch("login.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });

        const result = (await response.text()).trim();

        if (!response.ok || result !== "LOGIN_SUCCESS") {
            message.textContent =
                result || "Incorrect email or password.";
            return;
        }

        // ログイン成功後にDiscover画面へ
        window.location.href = "app.html";

    } catch (error) {
        message.textContent =
            "Unable to connect to the server. Please try again.";
    } finally {
        if (button) button.disabled = false;
    }
});
