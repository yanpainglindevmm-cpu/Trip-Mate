const forgotForm = document.getElementById("forgotPasswordForm");
const emailStep = document.getElementById("emailStep");
const codeStep = document.getElementById("codeStep");
const passwordStep = document.getElementById("passwordStep");
const message = document.getElementById("forgotMessage");

forgotForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value.trim();
  if (!email) return;
  // Demo only: real OTP/email must be handled by backend.
  emailStep.classList.add("hidden");
  codeStep.classList.remove("hidden");
  message.textContent = "Verification code requested. Connect your backend/email service here.";
});

document.getElementById("verifyCodeButton").addEventListener("click", function() {
  const code = document.getElementById("verificationCode").value.trim();
  if (!/^\d{6}$/.test(code)) {
    message.textContent = "Please enter a 6-digit verification code.";
    return;
  }
  codeStep.classList.add("hidden");
  passwordStep.classList.remove("hidden");
  message.textContent = "";
});

document.getElementById("resetPasswordButton").addEventListener("click", function() {
  const p1 = document.getElementById("newPassword").value;
  const p2 = document.getElementById("confirmNewPassword").value;
  if (p1.length < 8) { message.textContent = "Password must be at least 8 characters."; return; }
  if (p1 !== p2) { message.textContent = "Passwords do not match."; return; }
  message.textContent = "Password reset is ready. Connect your backend to save the new password.";
});