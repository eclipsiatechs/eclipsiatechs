<?php
// contact-form.php - UPDATED WITH FORMSPREE INTEGRATION
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $project_type = strip_tags(trim($_POST["project_type"]));
    $message = trim($_POST["message"]);
    
    // Validation
    if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["message" => "Please complete the form and try again."]);
        exit;
    }
    
    // Method 1: Try Formspree first (RECOMMENDED)
    $formspree_url = "https://formspree.io/f/xvojnqgg"; // You need to create this at formspree.io
    
    $formspree_data = [
        'name' => $name,
        'email' => $email,
        'project_type' => $project_type,
        'message' => $message,
        '_subject' => "New Contact from $name - Eclipsia Techs"
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $formspree_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formspree_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-www-form-urlencoded'
    ]);
    
    $formspree_response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code === 200) {
        http_response_code(200);
        echo json_encode(["message" => "Thank You! Your message has been sent successfully."]);
    } else {
        // Fallback to PHP mail
        $recipient = "eclipsiatechs@gmail.com";
        $subject = "New Contact Form Message from $name";
        $email_content = "Name: $name\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Project Type: $project_type\n\n";
        $email_content .= "Message:\n$message\n";
        
        $email_headers = "From: $name <$email>";
        
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            http_response_code(200);
            echo json_encode(["message" => "Thank You! Your message has been sent successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Oops! Please email us directly at eclipsiatechs@gmail.com"]);
        }
    }
} else {
    http_response_code(403);
    echo json_encode(["message" => "There was a problem with your submission, please try again."]);
}
?>