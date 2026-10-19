<?php
session_start();
header("Content-Type: text/plain; charset=UTF-8");

$host = "root";
$dbname = "tripmate";
$username = "root";
$dbpassword = "root";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $dbpassword,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        exit("Invalid request.");
    }

    $email = trim($_POST["email"] ?? "");
    $password = $_POST["password"] ?? "";

    if ($email === "" || $password === "") {
        http_response_code(400);
        exit("Please enter your email and password.");
    }

    // 登録済みのユーザーを検索
    $sql = "SELECT id, name, email, password
            FROM users
            WHERE email = ?
            LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // 未登録、またはパスワードが違う場合
    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        exit("Incorrect email or password.");
    }

    // ログイン成功
    session_regenerate_id(true);

    $_SESSION["user_id"] = $user["id"];
    $_SESSION["user_name"] = $user["name"];
    $_SESSION["user_email"] = $user["email"];

    echo "LOGIN_SUCCESS";

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit("Login failed. Please check the database connection.");
}
?>