  Vue.createApp({
    data(){
      return{
        url:'https://vue3-course-api.hexschool.io/',
        path: 'amber-hexschool',
        user:{
          username:'',
          password:''
        }
      }
    },
    methods: {
      login(){
        if (this.user.username == '' || this.user.password == '') {
          alert('請輸入帳號及密碼');
          return;
      }
      axios.post(`${this.url}admin/signin`,this.user) 
        .then(res =>{
          if(res.data.success){
            // const token= res.data.token;
            // const expired = res.data.expired;
            const {token,expired} = res.data;
            //console.log(token,expired); 
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
            window.location ='product.html';
          }else{ // 輸入資料錯誤報錯提醒
            alert(res.data.message);
            this.user.username = '';
            this.user.password = '';
          }
        }).catch(err =>{ // axios報錯
          console.log(err);
        })
      }
    },
    created(){

    }
  }).mount('#app')