<?php

// Browser သို့ ပို့မည့် စာသား၏ Encoding ကို UTF-8 သတ်မှတ်ခြင်း
header("Content-Type: text/plain; charset=UTF-8");

// MySQL Database ချိတ်ဆက်ရန် သတ်မှတ်ချက်များ
$host = "127.0.0.1";      // MySQL Server လိပ်စာ
$dbname = "tripmate";     // Database အမည်
$username = "root";       // MySQL အသုံးပြုသူအမည်
$dbpassword = "root";     // MySQL Password

try {

    // MySQL Database သို့ ချိတ်ဆက်ခြင်း
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $dbpassword,
        [
            // Database Error ဖြစ်ပါက Exception ဖြင့် စစ်ဆေးရန်
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    // POST Method ဖြင့် ပေးပို့လာခြင်း ဟုတ်မဟုတ် စစ်ဆေးခြင်း
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        exit("Invalid request.");
    }

    // Form မှ ပေးပို့လာသော အချက်အလက်များကို ရယူခြင်း
    $name = trim($_POST["name"] ?? "");
    $birthday = $_POST["birthday"] ?? "";
    $gender = $_POST["gender"] ?? "";
    $email = trim($_POST["email"] ?? "");
    $phone = trim($_POST["phone"] ?? "");
    $password = $_POST["password"] ?? "";
    $confirmPassword = $_POST["confirmPassword"] ?? "";

    // လိုအပ်သော အချက်အလက်များ ပြည့်စုံမှု ရှိမရှိ စစ်ဆေးခြင်း
    if (
        $name === "" ||
        $birthday === "" ||
        $gender === "" ||
        $email === "" ||
        $phone === "" ||
        $password === "" ||
        $confirmPassword === ""
    ) {
        http_response_code(400);
        exit("Please fill in all fields.");
    }

    // Email လိပ်စာ မှန်ကန်မှု ရှိမရှိ စစ်ဆေးခြင်း
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        exit("Invalid email address.");
    }

    // Gender သည် သတ်မှတ်ထားသော တန်ဖိုးများထဲမှ ဖြစ်မဖြစ် စစ်ဆေးခြင်း
    if (!in_array($gender, ["female", "male", "other"], true)) {
        http_response_code(400);
        exit("Invalid gender.");
    }

    // Birthday Format မှန်ကန်မှုနှင့် အနာဂတ်ရက်စွဲ မဟုတ်ကြောင်း စစ်ဆေးခြင်း
    $date = DateTime::createFromFormat("!Y-m-d", $birthday);

    if (
        !$date ||
        $date->format("Y-m-d") !== $birthday ||
        $date > new DateTime("today")
    ) {
        http_response_code(400);
        exit("Invalid birthday.");
    }

    // Password အနည်းဆုံး 8 လုံး ရှိမရှိ စစ်ဆေးခြင်း
    if (strlen($password) < 8) {
        http_response_code(400);
        exit("Password must be at least 8 characters.");
    }

    // Password နှင့် Confirm Password တူညီမှု ရှိမရှိ စစ်ဆေးခြင်း
    if ($password !== $confirmPassword) {
        http_response_code(400);
        exit("Passwords do not match.");
    }

    // Email ကို Database ထဲတွင် မှတ်ပုံတင်ထားပြီးသားလား စစ်ဆေးခြင်း
    $checkSql = "SELECT id FROM users WHERE email = ? LIMIT 1";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$email]);

    // Email ရှိပြီးသားဆိုလျှင် Account အသစ် ထပ်မဖန်တီးခြင်း
    if ($checkStmt->fetch()) {
        http_response_code(409);
        exit("This email address is already registered.");
    }

    // Password ကို Hash ပြောင်းပြီး လုံခြုံစွာ သိမ်းဆည်းရန် ပြင်ဆင်ခြင်း
    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // users Table ထဲသို့ အချက်အလက်များ ထည့်သွင်းရန် SQL
    $sql = "INSERT INTO users
            (name, birthday, gender, email, phone, password)
            VALUES (?, ?, ?, ?, ?, ?)";

    // SQL Query ကို Prepare လုပ်ခြင်း
    $stmt = $pdo->prepare($sql);

    // Account အချက်အလက်များကို Database ထဲသို့ သိမ်းဆည်းခြင်း
    $stmt->execute([
        $name,
        $birthday,
        $gender,
        $email,
        $phone,
        $hashedPassword
    ]);

    // Account ဖန်တီးမှု အောင်မြင်ကြောင်း JavaScript သို့ ပြန်ပို့ခြင်း
    echo "LOGIN_SUCCESS";

} catch (PDOException $e) {

    // Error အသေးစိတ်ကို Server Log ထဲတွင် သိမ်းဆည်းခြင်း
    error_log($e->getMessage());

    // Email ထပ်နေသောကြောင့် Database က ပယ်ချခဲ့ပါက အကြောင်းကြားခြင်း
    if (
        isset($e->errorInfo[1]) &&
        (int)$e->errorInfo[1] === 1062
    ) {
        http_response_code(409);
        exit("This email address is already registered.");
    }

    // Database ချိတ်ဆက်မှု သို့မဟုတ် အခြား Database Error ဖြစ်ပါက
    http_response_code(500);
    exit("A database error occurred. Please check the server settings.");
}
?>