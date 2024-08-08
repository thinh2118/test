document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const errorDiv = document.getElementById("error");

  const passwordInput = document.getElementById('password');
  const cnfpassword = document.getElementById('cnfpassword');
        const passwordWarning = document.getElementById('passwordwarning');
        const passwordmatchwarning = document.getElementById('passwordmatchwarning');
        const username = document.getElementById('username');
        const emailvalidwarning = document.getElementById('emailvalidwarning');
        

        username.addEventListener('input', async function() 
        {
          let isValidemail = isValidEmail(username.value);
          if(isValidemail)
            {
              emailvalidwarning.textContent="";
            }else
          {
            emailvalidwarning.textContent="Please confirm that your email is correct";
            emailvalidwarning.classList.add('red');
            if(username.value.length==0)
              {
                emailvalidwarning.textContent="";
              }
          }
        })

        passwordInput.addEventListener('input', function() {
            if (this.value.length < 8) {
                passwordWarning.classList.remove('green');
                passwordWarning.classList.add('red');
                return;
            } else {
                passwordWarning.classList.remove('red');
                passwordWarning.classList.add('green');
            }
            if (cnfpassword.value!=this.value) {
              passwordmatchwarning.classList.remove('green');
              passwordmatchwarning.classList.add('red');
            } else {
              passwordmatchwarning.classList.remove('red');
              passwordmatchwarning.classList.add('green');
            }
        });
        cnfpassword.addEventListener('input', function() {
          if (passwordInput.value!=this.value) {
            passwordmatchwarning.textContent="Password do not matched!";
            passwordmatchwarning.classList.remove('green');
            passwordmatchwarning.classList.add('red');
           
          } else {
            if (passwordInput.value.length < 8) 
              {}else{
                passwordmatchwarning.textContent="Password matched!";
            passwordmatchwarning.classList.remove('red');
            passwordmatchwarning.classList.add('green');
              }
          }
      });
      function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    var email = "";
    var mobile = "";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const cnfpassword = document.getElementById("cnfpassword").value;
    const fullname = document.getElementById("fullname").value;
    const refercode = document.getElementById("refercode").value;
    if (password.length < 8) 
      {
        alert("Password must be at least 8 characters");
      return;
      }
    if (password === cnfpassword) {
    } else {
      alert("password and confirm password must be matched");
      return;
    }
    var dt = {};
    if (!isValidEmail(username.toLowerCase())) {
      alert("Please Enter valid email!!");
      return;
  }
    if (username.includes("@")) {
      email = username;
      mobile = "";
    } else {
      mobile = username;
      email = "";

    }

    dt = {
      firstname: fullname,
      lastname: fullname,
      email: email,
      mobile: mobile,
      password: password,
      country: "+91",
      referralCode: refercode,
    };

    try {
      const response = await fetch(
        "https://www.aeropres.in/chromeapi/dawn/v1/user/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dt),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // alert(
        //   "Registration Success!!, We have sent you a email to verify your Account. Please check your Spam or Junk folder."
        // );
        //window.location.href = "registersuccess.html";
        //     chrome.storage.local.set({ "username":email }, () => {

        //       });
          chrome.storage.local.set({ "tempusername": username }, () => {
            window.location.href = 'registersuccess.html';
          });
      } else {
        if(data.data!=undefined)
          {
            //errorDiv.textContent = error.dt.data.message;
            throw new Error(data.data.message || "An error occurred");
          }else 
          {
            throw new Error(data.message || "An error occurred");
          }

        
      }
    } catch (error) {
      errorDiv.textContent = error.message;
      if(error.message=="email already exists")
        {
          errorDiv.textContent = "Email Already Registered";
        }

    }
  });

  document.getElementById("refercode").addEventListener("input",async()=>
    {
      let referralCode = document.getElementById("refercode").value;
      if(referralCode.length==0)
        {
          document.getElementById("iscodeexist").textContent="";
          return;
        }
      await checkReferralCode(referralCode);
    })
});

async function checkReferralCode(referralCode) {
  try {
    const response = await fetch(`https://www.aeropres.in/api/atom/v1/userreferral/iscodeexist?referralCode=${referralCode}`);
    
    if (!response.ok) {
      throw new Error(response.message || `HTTP error! status: ${response.status}`);
    }
      document.getElementById("iscodeexist").textContent="";
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error.message);
    document.getElementById("iscodeexist").textContent="Referral code do not exist."
    document.getElementById("iscodeexist").classList.add('red');
    if(document.getElementById("refercode").value.length==0)
      {
        document.getElementById("iscodeexist").textContent="";
      }
  }
}
