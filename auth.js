
import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("toggleBtn");
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("message");
const accountInfo = document.getElementById("accountInfo");

let isRegistering =
  new URLSearchParams(window.location.search).get("mode") !== "login";

toggleBtn.addEventListener("click", () => {
  isRegistering = !isRegistering;

  submitBtn.textContent = isRegistering
    ? "CREATE ACCOUNT"
    : "SIGN IN";

  toggleBtn.textContent = isRegistering
    ? "ALREADY REGISTERED? SIGN IN"
    : "NEW PERSONNEL? CREATE ACCOUNT";

  passwordInput.autocomplete = isRegistering
    ? "new-password"
    : "current-password";

  message.textContent = "";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitBtn.disabled = true;
  message.textContent = "CONTACTING FOUNDATION DATABASE...";

  try {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (isRegistering) {
      await createUserWithEmailAndPassword(
        auth, email, password
      );

      message.textContent = "ACCOUNT CREATED SUCCESSFULLY.";
    } else {
      await signInWithEmailAndPassword(
        auth, email, password
      );

      message.textContent = "ACCESS GRANTED.";
    }
  } catch (error) {
    const messages = {
      "auth/email-already-in-use":
        "An account already exists with that email. Try signing in.",
      "auth/invalid-email":
        "Please enter a valid email address.",
      "auth/weak-password":
        "Choose a stronger password of at least 6 characters.",
      "auth/invalid-credential":
        "Email or password is incorrect.",
      "auth/too-many-requests":
        "Too many attempts. Please wait and try again.",
      "auth/network-request-failed":
        "Network error. Check your internet connection."
    };

    message.textContent =
      messages[error.code] ||
      "Something went wrong. Please try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    message.textContent = "SIGNED OUT SUCCESSFULLY.";
  } catch {
    message.textContent = "Could not sign out. Please try again.";
  }
});

onAuthStateChanged(auth, (user) => {
  logoutBtn.hidden = !user;
  form.hidden = !!user;
  toggleBtn.hidden = !!user;

  accountInfo.textContent = user
    ? "SIGNED IN AS: " + user.email
    : "NO ACTIVE PERSONNEL SESSION.";
});
