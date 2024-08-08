document.addEventListener('DOMContentLoaded', () => {

    const signinForm = document.getElementById('signinForm');
    const errorDiv = document.getElementById('error');
   
    chrome.storage.local.set({ token: "" }, () => {
      
    });
    chrome.storage.local.set({ username: "" }, () => {
      
    });

    chrome.storage.local.set({ "referralCode": ""}, () => {});
    chrome.storage.local.set({"twitter_x_id_points":""}, () => {});
    chrome.storage.local.set({"discordid_points":""}, () => {});
    chrome.storage.local.set({"telegramid_points":""}, () => {});
  
    signinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetchWithRetry('https://www.aeropres.in/chromeapi/dawn/v1/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({"username":email,"password":password,logindata:{_v:"1.0.5",datetime:new Date()}})
        });
  
        const data = await response.json();
        //alert(JSON.stringify(data));
        if (response.ok) {
            chrome.storage.local.set({ "username":email }, () => {
               
              });
              chrome.storage.local.set({"wallet":data.data.wallet.wallet_address},()=>{});
              chrome.storage.local.set({ "referralCode": data.data.referralCode }, () => {});
              chrome.storage.local.set({ "firstname": data.data.firstname }, () => {});
              chrome.storage.local.set({ "password": password }, () => {});
              chrome.storage.local.set({ "twitter_x_id": data.data.twitter_x_id==undefined?"":data.data.twitter_x_id }, () => {});
              chrome.storage.local.set({ "discordid": data.data.discordid==undefined?"":data.data.discordid }, () => {});
              chrome.storage.local.set({ "telegramid": data.data.telegramid==undefined?"":data.data.telegramid }, () => {});


              chrome.storage.local.set({ token: data.data.token }, () => {
            window.location.href = 'dashboard.html';
          });
        } else {
          throw new Error(data.message || 'An error occurred');
        }
      } catch (error) {
        errorDiv.textContent = error.message;
        
        if(error.message=="Email not verified , Please check spam folder incase you did not get email")
          {
            document.getElementById('clickToResendEmail').style.display = 'inline';
          }else
          {
            document.getElementById('clickToResendEmail').style.display = 'none';
          }
   

      }
    });


    document.getElementById('clickToResendEmail').addEventListener("click",async()=>
      {
        const email = document.getElementById('email').value;
        const data = {
          username: email
      };
      await resendVerifyLink(data);
  
      })
  });
  async function resendVerifyLink(data) {
    const url = 'https://www.aeropres.in/chromeapi/dawn/v1/user/resendverifylink';


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Verification link resent successfully:', result);
        alert("Verification link resent successfully");
    } catch (error) {
        console.error('Error resending verification link:', error);
        alert('Error resending verification link:'+error);
    }
}


async function fetchWithRetry(url, options = {}) {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000; // 3 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);
      return response; // If successful, return the response
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        // This error typically indicates a network error (server down)
        if (attempt === MAX_RETRIES) {
          throw error; // If all retries failed, throw the last error
        }
        console.log(`Server seems to be down. Attempt ${attempt} failed. Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        // For other types of errors, throw immediately without retrying
        throw error;
      }
    }
  }
}




  