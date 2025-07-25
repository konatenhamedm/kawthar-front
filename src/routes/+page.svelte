<script lang="ts">
    import Notification from "$components/_includes/Notification.svelte";
    import Spinner from "$components/_skeletons/Spinner.svelte";
    import { login } from "$lib/auth";
  
    let showNotification = false;
    let notificationMessage = "";
    let notificationType = "info";
  
    let username = "ko@gmail.com";
    let password = "password123";
    $: authenticating = false;
    let showPassword = false; // To toggle password visibility
    $: message = "";
    let error = "";
  
    let passwordWarning = "";
    let isPasswordValid = false;
  
  
  
    async function handleSubmit(event: any) {
      authenticating = true;
      event.preventDefault();
      try {
        const success = await login(username, password);

        console.log(success.data.token);
      
        if (success.data.token != null) {
          window.location.href = "/admin";
        } else {
          message = "Veuillez vérifier vos identifiants";
          authenticating = false;
          setTimeout(() => {
            message = ""; // Efface le message après 3 secondes
          }, 3000);
        }
        authenticating = false;
      } catch (error) {
        authenticating = false;
        message = "Une erreur est survenue";
      }
    }
  </script>

<main class="relative bg-top bg-no-repeat bg-[url('images/admin/admin-bg-light.png')] dark:bg-[url('images/admin/admin-bg-dark.png')] dark:bg-[#1e2836] bg-contain bg-normalBG">


    <!-- Main content container with responsive design -->
    <div class="h-[calc(var(--vh,1vh)_*_100)] w-full overflow-y-auto scrollbar">

       <!-- Login form container -->
       <div class="flex flex-col justify-center w-full max-w-[516px] px-[30px] mx-auto my-[150px]">
          <a href="index.html" class="text-center">
             <!-- Logo for the light theme -->
             <img src="/images/logos/logo.png" alt="image" class="inline dark:hidden">
             <!-- Logo for the dark theme -->
             <img src="/images/logos/logo.png" alt="image" class="hidden dark:inline">
          </a>

          <!-- Login form background -->
          <div class="rounded-6 mt-[25px] shadow-regular dark:shadow-xl bg-white dark:bg-[#111726]">
             <div class="p-[25px] text-center border-b border-regular dark:border-white/[.05] top">
                <!-- Heading for the login form -->
                <h2 class="text-18 font-semibold leading-[1] mb-0 text-dark dark:text-title-dark">Connectez-vous ici</h2>
             </div>

             <!-- Login form inputs and elements -->
             <div class="py-[30px] px-[40px]">
                <form id="admin-formxx" on:submit|preventDefault={handleSubmit}>

                   <!-- Email Address input -->
                   <div class="mb-6">
                      <label for="email-username" class="text-[14px] w-full leading-[1.4285714286] font-medium text-dark dark:text-gray-300 mb-[8px] capitalize inline-block">Pseudo</label>
                      <input bind:value={username} type="text" id="email-username" class="flex items-center shadow-none py-[10px] px-[20px] h-[48px] border-1 border-regular rounded-4 w-full text-[14px] font-normal leading-[1.5] placeholder:text-[#A0A0A0] focus:ring-primary focus:border-primary" placeholder="Entrez votre pseudo" autocomplete="off"  required>
                   </div>

                   <!-- Password input -->
                   <div class="mb-6">
                      <label for="password" class="text-[14px] w-full leading-[1.4285714286] font-medium text-dark dark:text-gray-300 mb-[8px] capitalize inline-block">
                         Mot de passe</label>
                      <div class="relative w-full">
                         <div class="absolute inset-y-0 end-0 flex items-center px-[15px]">
                            <input class="hidden js-password-toggle" id="toggle" type="checkbox">
                            <label class=" rounded cursor-pointer text-light text-[15px] js-password-label dark:text-subtitle-dark" for="toggle"><i class="uil uil-eye-slash"></i></label>
                         </div>
                         <input  bind:value={password} class="flex items-center shadow-none py-[10px] px-[20px] h-[48px] border-1 border-regular rounded-4 w-full text-[14px] font-normal leading-[1.5] placeholder:text-[#A0A0A0] focus:ring-primary focus:border-primary js-password" id="password" type="password"  autocomplete="off" placeholder="Entrez votre mot de passe">
                      </div>
                   </div>

                   <!-- Remember me and forgot password options -->
                   <div class="flex items-center sm:justify-between justify-center max-sm:flex-wrap capitalize mb-[19px] mt-[23px] gap-[15px]">
                      <div class="flex">
                        
                      </div>
                      <a class="text-13 text-[#00baff] hover:text-dark dark:hover:text-title-dark" href="reset.html">Mot de passe oublié?</a>
                   </div>

                   <!-- Submit button for the login form -->
                   <button type="submit" class="inline-flex items-center justify-center w-full h-[48px] text-14 rounded-6 font-medium bg-primary text-white cursor-pointer hover:bg-primary-hbr border-primary transition duration-300" value="submit">
                    
                     {#if authenticating}
                        <div class="w-full grid grid-cols-3">
                          <div>
                            <Spinner />
                          </div>
                          <div
                            class="flex flex-col col-span-1 justify-items-start"
                          >
                            Se connecter
                          </div>
                        </div>
                      {:else}
                        Se connecter
                      {/if}
                </button>
                </form>

                {#if !authenticating && message !== ''}
                <div
                  class="bg-red-100 border border-red-400 text-red-700 mt-2 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong class="font-bold">Oups erreur!</strong>
                  <span class="block sm:inline">{message}</span>
                </div>
              {/if}
            
             </div>

             <!-- Footer with signup link -->
            <!--  <div class="text-center p-[25px] rounded-b-6 bg-deepBG dark:bg-gray-600">
                <p class="text-[14px] font-medium text-body dark:text-title-dark inline-flex items-center gap-[6px] mb-0">
                    Vous n'avez pas de compte ?
                    S'inscrire <a class="transition duration-300 text-primary hover:text-dark dark:text-dark dark:hover:text-subtitle-dark" href="sign-up.html">Sign up</a>
                </p>
             </div> -->
          </div>
       </div>
    </div>

    <!-- End of the content block -->

 </main>