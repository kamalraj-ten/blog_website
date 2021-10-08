function rdsignup()
{
   var Name=document.getElementById("signupname");
   var Username=document.getElementById("signupusername");
   var email=document.getElementById("signupmail");
   var pswd=document.getElementById("signuppswd");
   var cpswd=document.getElementById("signupcpswd");
   var gen=document.getElementById("signupgender");
   var country=document.getElementById("signupcntry");
   if(pswd!=cpswd)
   {
      error.innerHTML=<span>"Renter the password"</span>;
   }
   console.log(country);
}