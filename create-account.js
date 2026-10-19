// Create Account Form ကို ရယူခြင်း
const createForm = document.getElementById("createAccountForm");

// အသုံးပြုသူထံ Message ပြသရန်
const message = document.getElementById("createMessage");

// Form Submit လုပ်သည့်အခါ အလုပ်လုပ်မည့် Event
createForm.addEventListener("submit", async function (e) {
    // ပုံမှန် Form Submit လုပ်ခြင်းကို တားဆီးခြင်း
    e.preventDefault();

    // Password နှင့် Confirm Password ကို ရယူခြင်း
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Password နှစ်ခု တူညီမှု ရှိမရှိ စစ်ဆေးခြင်း
    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    // HTML Form Validation စစ်ဆေးခြင်း
    if (!createForm.checkValidity()) {
        createForm.reportValidity();
        return;
    }

    // Submit Button ကို ရယူခြင်း
    const button = createForm.querySelector('button[type="submit"]');

    // Button ကို ယာယီပိတ်ပြီး Processing Message ပြသခြင်း
    button.disabled = true;
    message.textContent = "Creating your account...";

    try {
        // Form အချက်အလက်များကို register.php သို့ ပို့ခြင်း
        const response = await fetch("register.php", {
            method: "POST",
            body: new FormData(createForm),
            credentials: "same-origin"
        });

        // PHP မှ ပြန်ပို့လာသော Message ကို ရယူခြင်း
        const result = (await response.text()).trim();

        // Registration မအောင်မြင်ပါက Error ပြသခြင်း
        if (!response.ok) {
            message.textContent = result;
            return;
        }

        // Registration အောင်မြင်ပါက Login စာမျက်နှာသို့ ပြောင်းခြင်း
        if (result === "LOGIN_SUCCESS") {
            alert("Account created successfully!");
            window.location.href = "index.html";
        } else {
            message.textContent = result;
        }

    } catch (error) {
        // Server ချိတ်ဆက်မှု မအောင်မြင်ပါက Message ပြသခြင်း
        message.textContent =
            "Unable to connect to the server. Please try again.";

    } finally {
        // Submit Button ကို ပြန်ဖွင့်ခြင်း
        button.disabled = false;
    }
});