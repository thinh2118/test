let tempusername;
document.addEventListener("DOMContentLoaded", () => 
    {
        chrome.storage.local.get("tempusername", (result) => {
            tempusername = result.tempusername;
            document.getElementById('tempusername').textContent=tempusername;
        
          });
          document.getElementById('clickToResendEmailRegister').addEventListener("click",async()=>
            {
              const email = tempusername;
              const data = {
                username: email
            };
            await resendVerifyLink(data);
        
            })

    })

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
