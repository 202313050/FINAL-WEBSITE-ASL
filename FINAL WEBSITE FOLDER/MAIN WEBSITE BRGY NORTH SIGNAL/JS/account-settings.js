const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');

// Validate current password (example check for '123')
if (!currentPassword.value.trim() || currentPassword.value !== '123') {
  document.getElementById('currentPasswordError').style.display = 'block';
  isValid = false;
} else {
  document.getElementById('currentPasswordError').style.display = 'none';
}

// Validate new password length
if (!newPassword.value.trim() || newPassword.value.length < 6) {
  document.getElementById('newPasswordError').style.display = 'block';
  isValid = false;
} else {
  document.getElementById('newPasswordError').style.display = 'none';
}

// Validate password match
if (newPassword.value !== confirmPassword.value) {
  document.getElementById('confirmPasswordError').style.display = 'block';
  isValid = false;
} else {
  document.getElementById('confirmPasswordError').style.display = 'none';
}
