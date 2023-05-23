const forma = document.getElementById("login-form");
forma.addEventListener("submit", registerUser);
async function registerUser(e){
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const result = await fetch("/api/login",{
        method:"POST",
        headers:{ "Content-Type": "application/JSON"},
        body: JSON.stringify({username, password})
    }).then(response=>response.json());
    if(result.status === "ok"){
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        const token=result.token;
        window.location.href = `/homepage.html?token=${token}`;
    } else{
        alert(result.error)
    }
}