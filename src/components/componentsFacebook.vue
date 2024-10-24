<template>
   <div class="fb-login-button fullwidth-child"
   :data-width="button_width"
   data-size="large" data-button-type="login_with"
   data-layout="rounded"
   data-auto-logout-link="false"
   data-use-continue-as="true"
   data-onlogin="checkLoginState"
   >
   </div>
</template>

<script>
export default {
  name: 'componentsFacebook',
  props: ['title', 'app_id', 'errors', 'version', 'redirect_to', 'verification', 'button_width'],
  data () {
    return {
      social_strategy: 'facebook',
      access_token: ''
    }
  },
  mounted () {
    this.includeFacebook()
    window.checkLoginState = this.checkLoginState
  },
  methods: {
    includeFacebook () {
      if (window.fbAsyncInit == null) {
        new Promise((resolve) => {
          window.fbAsyncInit = function () {
            resolve()
          }
          const doc = window.document
          const scriptId = 'facebook-script'
          const scriptTag = doc.createElement('script')
          scriptTag.id = scriptId
          scriptTag.setAttribute('src', 'https://connect.facebook.net/en_US/sdk.js')
          doc.head.appendChild(scriptTag)
        }).then(() => {
          this.initFacebook()
        })
      } else {
        this.initFacebook()
      }
    },
    initFacebook () {
      /* eslint-disable */
      FB.init({
    		appId: this.app_id,
    		cookie: true,
    		xfbml: true,
    		version: this.version
    	})
    },
    checkLoginState(){
    		FB.getLoginStatus( response => {
    			if (response.status === 'connected') {
    				this.access_token = response.authResponse.accessToken;
    				this.fetchInformation();
    			} else {
    				this.attempLogin();
    			}
    		});
    	},
     attempLogin(){
    		FB.login( response => {
          if (response.authResponse) {
            this.access_token = response.authResponse.accessToken;
            this.fetchInformation();
          } else {
              APIinterface.notify('negative', errors.user_cancelled, 'error_outline', this.$q)
          }
        }, {scope: 'public_profile,email'});
    	},
      fetchInformation(){
    		 FB.api('/me?fields=email,first_name,last_name', data => {
		  	 	 var social_params = {
		  	 	 	id : data.id,
		  	 	 	email_address : data.email,
		  	 	 	first_name : data.first_name,
		  	 	 	last_name : data.last_name,
		  	 	 	social_strategy : this.social_strategy,
            verification: this.verification,
		  	 	 	redirect_to : this.redirect_to,
		  	 	 	social_token : this.access_token
		  	 	 };
		  	 	 this.$emit('socialRegistration',social_params);
		  	 });
    	},
    // end methods
  }
}
</script>
