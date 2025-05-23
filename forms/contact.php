<?php
// Proxy script to forward contact form submissions to Formspree
// Replace 'your-form-id' with your actual Formspree form ID
$formspree_endpoint = 'https://formspree.io/f/your-form-id';

$data = [
  'name'    => $_POST['name'] ?? '',
  'email'   => $_POST['email'] ?? '',
  'subject' => $_POST['subject'] ?? '',
  'message' => $_POST['message'] ?? ''
];

$ch = curl_init($formspree_endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
  echo 'OK';
} else {
  http_response_code($httpCode);
  echo 'Error';
}
?>
