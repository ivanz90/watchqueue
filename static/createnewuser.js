const forma = document.getElementById("signup-form");
forma.addEventListener("submit", registerUser);

async function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;
    const email = document.getElementById("email").value;

    let checkUsername = new RegExp(/^[a-zšđčćž0-9]+$/i);
    let checkEmail = new RegExp(/^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/i);
    let checkPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{9,}$/);

    if (!checkUsername.test(username)) {
        let errorUsername = document.createElement("div");
        errorUsername.innerHTML = "<span>Invalid username. Username can include letters and numbers only</span>";
        errorUsername.style.color = "red";
        document.getElementById("usernameDiv").appendChild(errorUsername);
    }
  else  if (!checkEmail.test(email)) {
        let errorEmail = document.createElement("div");
        errorEmail.innerHTML = "<span>Invalid email format</span>";
        errorEmail.style.color = "red";
        document.getElementById("emailDiv").appendChild(errorEmail);
    }
 else   if (!checkPassword.test(password)) {
        let errorPassword = document.createElement("div");
        errorPassword.innerHTML = "<span>Password should be at least 9 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special character.</span>";
        errorPassword.style.color = "red";
        document.getElementById("passwordDiv").appendChild(errorPassword);
    }
 else   if (password !== password2) {
        let errorPassword2 = document.createElement("div");
        errorPassword2.innerHTML = "<span>Please make sure to enter the same password in both fields.</span>";
        errorPassword2.style.color = "red";
        document.getElementById("passwordDiv2").appendChild(errorPassword2);
    } else {
        const result = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/JSON" },
            body: JSON.stringify({ username, password, email })
        }).then(response => response.json());
        if (result.status === "ok") {
            window.location.href = 'http://localhost:3000/index.html';
        } else {
            alert(result.error);
        }
    }
}
