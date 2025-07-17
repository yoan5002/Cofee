/*=============== SHOW HIDDEN - PASSWORD ===============*/
const showHiddenPass = (inputPass, inputIcon) =>{
   const input = document.getElementById(inputPass),
         iconEye = document.getElementById(inputIcon)
         
   iconEye.addEventListener('click', () =>{
       // Change password to text
       if(input.type === 'password'){
           // Switch to text
           input.type = 'text'

           // Add icon
           iconEye.classList.add('ri-eye-line')
           // Remove icon
           iconEye.classList.remove('ri-eye-off-line')
       }else{
           // Change to password
           input.type = 'password'

           // Remove icon
           iconEye.classList.remove('ri-eye-line')
           // Add icon
           iconEye.classList.add('ri-eye-off-line')
       }
   })
}

showHiddenPass('input-pass','input-icon')


document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('#loginBtn');
    const signupBtn = document.querySelector('#signup-btn');
    const loginForm = document.querySelector('.login__form');

    // Connexion (Login)
    if (loginBtn && loginForm) {
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = document.querySelector('#input-email').value;
            const password = document.querySelector('#input-pass').value;

            if (!email || !password) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();
                console.log("Résultat login:", result);

                // Accepte aussi le cas où OTP est requis (403)
                if (result.message?.toLowerCase().includes('otp') || result.error?.toLowerCase().includes('otp')) {
                    if (!document.querySelector('#otpInput')) {
                        const otpInput = document.createElement('input');
                        otpInput.type = 'text';
                        otpInput.id = 'otpInput';
                        otpInput.placeholder = 'Entrez le code OTP';
                        otpInput.className = 'login__input';
                        otpInput.style.marginTop = '1rem';

                        const otpBtn = document.createElement('button');
                        otpBtn.textContent = 'Vérifier OTP';
                        otpBtn.id = 'verifyOtpBtn';
                        otpBtn.className = 'login__button login__button-ghost';
                        otpBtn.style.marginTop = '1rem';

                        loginForm.appendChild(otpInput);
                        loginForm.appendChild(otpBtn);

                        otpBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            const otpCode = otpInput.value;

                            const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-otp', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ email, otp: otpCode })
                            });

                            const verifyResult = await verifyResponse.json();

                           if (verifyResponse.ok && verifyResult.success) {
                            localStorage.setItem('userEmail', email);
                            localStorage.setItem('userRole', verifyResult.user?.role || 'client');

                            if (verifyResult.user?.role === 'admin') {
                                window.location.href = '../3/admin-dashboard/index.html';
                            } else {
                                window.location.href = '../3/index.html';
                            }
                            } else {
                            alert('OTP incorrect ou expiré.');
                            }


                        });
                    }
                } else {
                    alert(result.error || result.message || 'Identifiants invalides.');
                }
            } catch (err) {
                console.error("Erreur côté client :", err);
                alert("Erreur de connexion au serveur.");
            }
        });
    }

    // Inscription (Sign Up)
    if (signupBtn && loginForm) {
        signupBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const email = document.querySelector('#input-email').value;
            const password = document.querySelector('#input-pass').value;

            if (!email || !password) {
                alert('Veuillez remplir tous les champs.');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                } else {
                    alert(result.error || 'Erreur lors de l’inscription.');
                }
            } catch (err) {
                console.error("Erreur réseau :", err);
                alert("Erreur de connexion au serveur.");
            }
        });
    }
});


