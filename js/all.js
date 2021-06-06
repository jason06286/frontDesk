import moreModal from './moreModal.js'

    const app = Vue.createApp(
    {
        components: {
            moreModal
        },
        data() {
            return {
                // week02 start
                url: 'https://vue3-course-api.hexschool.io/',
                path: 'jason06286',
                productsData: [],
                cartData:[],
                temp:{
                    title: "", 
                    category: "",
                    origin_price:"",
                    price: "",
                    unit: "",
                    description: "",
                    content: "",
                    is_enabled: "",
                    imageUrl : "",
                    imagesUrl: [],
                },
            };
        },
        methods: {
            getData(){
                axios({
                    method:'get',
                    url:`${this.url}api/${this.path}/products/all`,
                }).then((res) => {
                    console.log(res)
                    this.productsData=res.data.products
                    console.log('this.productsData :>> ', this.productsData);
                }).catch((err) => {
                    console.log(err);
                });
            },
            showMoreModal(item){
                this.temp=item
                console.log(this.temp)
                this.$refs.moreModal.show()
            },
            addCart(e){
                this.addLoading()
                console.log(e)
                console.log(e.target.value);
                this.getCartList()
                this.$refs.moreModal.addCart(e,e.target.value)
            },
            getCartList(){
                axios({
                    method:'get',
                    url:`${this.url}api/${this.path}/cart`,
                }).then((res) => {
                    console.log(res)
                    this.addLoading()
                    this.cartData=res.data.data
                    console.log('this.cartData :>> ', this.cartData);
                }).catch((err) => {
                    console.log(err);
                });
            },
            allDelCart(){
                axios({
                    method:'delete',
                    url:`${this.url}api/${this.path}/carts`,
                }).then((res) => {
                    if(res.data.success){
                        this.getCartList()
                        alert('刪除成功!!')
                    }
                    console.log(res)
                }).catch((err) => {
                    console.log(err);
                });
            },
            delCart(id){
                axios({
                    method:'delete',
                    url:`${this.url}api/${this.path}/cart/${id}`,
                }).then((res) => {
                    if(res.data.success){
                        this.getCartList()
                        alert('刪除成功!!')
                    }
                    console.log(res)
                }).catch((err) => {
                    console.log(err);
                });
            },
            editCart(e){
                if(e.target.value<1)return alert('若要刪除請案刪除鈕!')
                axios({
                    method:'put',
                    url:`${this.url}api/${this.path}/cart/${e.target.dataset.id}`,
                    data:{
                        data:{
                            product_id:e.target.dataset.id,
                            qty:parseInt(e.target.value)
                        }
                    }
                }).then((res) => {
                    if(res.data.success){
                        alert('購物車更新成功')
                        this.getCartList()
                    }else{
                        alert(res.data.message)
                    }
                    console.log(res)
                }).catch((err) => {
                    console.log(err);
                });
            },
            format(num){
                return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            },
            addLoading() {
                const loader = this.$loading.show({
                    // Optional parameters
                    container: this.fullPage ? null : this.$refs.formContainer,
                    canCancel: true,
                    onCancel: this.onCancel,
                });
                // simulate AJAX
                setTimeout(() => {
                    loader.hide()
                }, 3000)
            },
            
        },
        mounted() {
            console.log(this.$refs);
            this.getData()
            this.getCartList()
        },
    },
);
app.use(VueLoading)
app.mount('#app');
