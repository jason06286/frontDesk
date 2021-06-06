export default{
    props:['temp', 'cartData'],
    data() {
        return {
            myModal:'',
            addNum:1,
            url: 'https://vue3-course-api.hexschool.io/',
            path: 'jason06286',
            nowTemp:{
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
            isLoading:'',
        }
    },
    methods: {
        show(){
            this.addNum=1
            this.myModal.show()
        },
        addCart(e,num=this.addNum){
            this.isLoading=e.target.dataset.id
            let productId=e.target.dataset.id
            let productarray={}
            console.log(productId);
            console.log(productarray)
            this.cartData.carts.forEach((item,index) => {
                productarray[item.product.id]=index
            });
            if(this.cartData.carts){
                console.log(productarray[productId]);
                if(productarray[productId]!=undefined){
                    console.log(this.cartData.carts[productarray[productId]].id);
                    if(num<1)return alert('數量錯誤!')
                    axios({
                        method:'put',
                        url:`${this.url}api/${this.path}/cart/${this.cartData.carts[productarray[productId]].id}`,
                        data:{
                            data:{
                                product_id:this.cartData.carts[productarray[productId]].id,
                                qty:parseInt(num) +parseInt(this.cartData.carts[productarray[productId]].qty)
                            }
                        }
                    }).then((res) => {
                        if(res.data.success){
                            this.myModal.hide()
                            alert('加入購物車成功')
                            this.addNum=1
                            this.isLoading=''
                            this.$emit('getCartData')
                        }else{
                            alert(res.data.message)
                        }
                        console.log(res)
                    }).catch((err) => {
                        console.log(err);
                    });
                }else{
                    this.newCart(e,num)
                }
            }else{
                this.newCart(e,num)
            }
        },
        newCart(e,num=this.addNum){
            if(num<1)return alert('數量錯誤!')
            axios({
                method:'post',
                url:`${this.url}api/${this.path}/cart`,
                data:{
                    data:{
                        product_id:e.target.dataset.id,
                        qty:parseInt(num) 
                    }
                }
            }).then((res) => {
                if(res.data.success){
                    this.myModal.hide()
                    alert('加入購物車成功')
                    this.addNum=1
                    this.$emit('getCartData')
                }else{
                    alert(res.data.message)
                }
                console.log(res)
            }).catch((err) => {
                console.log(err);
            });
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
    watch:{
        temp(){
            this.nowTemp=this.temp
            console.log(this.nowTemp);
        }
    },
    mounted() {
        this.myModal=new bootstrap.Modal(this.$refs.moreModal)
        console.log('this.$refs :>> ', this.$refs);
    },
    template:`<div class="modal" tabindex="-1" ref="moreModal">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title">{{nowTemp.title}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <img :src="nowTemp.imageUrl"  class="w-100" alt="..."  style="height: 300px;" v-if="nowTemp.imageUrl">
            <img :src="nowTemp.imagesUrl[0]"  class="w-100" alt="" style="height: 300px;" v-else>
            <p class="my-3">description:{{nowTemp.description}}</p>
            <p  class="mb-3">content:{{nowTemp.content}}</p>
            <div class="d-flex justify-content-between">
                <small class="mb-2"><del>原價{{nowTemp.origin_price}}</del></small>
                <p class="mb-2">現在只要{{nowTemp.price}}</p>
            </div>
            </div>
            <div class="modal-footer">
                <div class="input-group mb-3">
                    <button class="btn btn-secondary" type="button" @click="addNum=addNum-1">-</button>
                    <input type="number" min="1" class="form-control"  aria-label="Recipient's username" aria-describedby="button-addon2" value="1" v-model="addNum" disabled>
                    <button class="btn btn-secondary" type="button" @click="addNum=addNum+1 ">+</button>
                    <button class="btn btn-primary" type="button":data-id="nowTemp.id" @click.prevent="addCart">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="nowTemp.id===isLoading"></span>
                        加入購物車
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>`
}