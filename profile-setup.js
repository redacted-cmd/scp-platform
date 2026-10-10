
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("profileForm");
const usernameInput = document.getElementById("username");
const bioInput = document.getElementById("bio");
const submitBtn = document.getElementById("createProfileBtn");
const message = document.getElementById("message");
const accountInfo = document.getElementById("accountInfo");

let currentUser = null;
let profileExists = false;

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  form.hidden = true;
  submitBtn.disabled = true;
  profileExists = false;

  if (!user) {
    message.textContent = "Please sign in before creating a profile.";
    accountInfo.textContent = "";
    return;
  }

  accountInfo.textContent = "SIGNED IN AS: " + user.email;
  message.textContent = "CHECKING EXISTING PERSONNEL FILE...";

  try {
    const userRef = doc(db, "users", user.uid);
    const profileSnapshot = await getDoc(userRef);

    if (auth.currentUser?.uid !== user.uid) return;

    if (profileSnapshot.exists()) {
      profileExists = true;
      message.textContent =
        "A profile already exists for this account.";
      return;
    }

    form.hidden = false;
    submitBtn.disabled = false;
    message.textContent = "ACCESS CONFIRMED. CREATE YOUR PROFILE.";
  } catch (error) {
    message.textContent =
      "Could not check your profile. Please refresh and try again.";
    console.error(error);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = currentUser;

  if (!user || auth.currentUser?.uid !== user.uid || profileExists) {
    message.textContent = "Please sign in again and retry.";
    return;
  }

  const username = usernameInput.value.trim();
  const bio = bioInput.value.trim();

  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    message.textContent =
      "Username must use 3–20 lowercase letters, numbers or underscores.";
    return;
  }

  if (bio.length > 160) {
    message.textContent = "Your bio must be 160 characters or fewer.";
    return;
  }

  submitBtn.disabled = true;
  message.textContent = "SECURELY RESERVING USERNAME...";

  const userRef = doc(db, "users", user.uid);
  const usernameRef = doc(db, "usernames", username);

  try {
    await runTransaction(db, async (transaction) => {
      const existingUsername = await transaction.get(usernameRef);
      const existingProfile = await transaction.get(userRef);

      if (existingUsername.exists()) {
        throw new Error("USERNAME_TAKEN");
      }

      if (existingProfile.exists()) {
        throw new Error("PROFILE_EXISTS");
      }

      transaction.set(usernameRef, {
        uid: user.uid
      });

      transaction.set(userRef, {
        uid: user.uid,
        username,
        bio,
        createdAt: serverTimestamp()
      });
    });

    profileExists = true;
    form.hidden = true;
    message.textContent =
      "PERSONNEL FILE CREATED SUCCESSFULLY!";
    accountInfo.textContent =
      "YOUR USERNAME: @" + username;

  } catch (error) {
    console.error(error);

    if (error.message === "USERNAME_TAKEN") {
      message.textContent =
        "That username is already taken. Try another one.";
    } else if (error.message === "PROFILE_EXISTS") {
      profileExists = true;
      form.hidden = true;
      message.textContent =
        "A profile already exists for this account.";
    } else {
      message.textContent =
        "Could not create your profile. Check your connection and try again.";
    }
  } finally {
    submitBtn.disabled = false;
  }
});
