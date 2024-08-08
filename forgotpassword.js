document.addEventListener('DOMContentLoaded', () => {

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const errorDiv = document.getElementById('error');

    function isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
  }
    forgotPasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      if (!isValidEmail(email)) {
        alert("Please Enter valid email!!");
        return;
    }
      
      try {
        const response = await fetch('https://www.aeropres.in/chromeapi/dawn/v1/user/sendforgotpasswordlink', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"username":email})
        });
  
        const data = await response.json();
        //alert(JSON.stringify(data));
        if (response.ok) {
            alert("reset password link sent to email, please check inbox/spam");
            document.getElementById('email').value="";
        } else {
          throw new Error(data.message || 'An error occurred');
        }
      } catch (error) {
        errorDiv.textContent = error.message;
      }
    });
  });
  