import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.11/vue.esm-browser.js';
import pagination from './pagination.js';

const url = 'https://vue3-course-api.hexschool.io/';
const path = 'amber-hexschool';

let productModal = null; //定義接近全域變數->使任何元件可以使用
let delProductModal = null;

const app = createApp({
  data(){
    return{
      // url:'https://vue3-course-api.hexschool.io/',
      // path: 'amber-hexschool',
      products: [], //產品清單
      isNewProduct: false,//判斷新增/編輯狀態
      tempProduct: { //暫存資料結構
        imagesUrl: [],
      },
      pagination:{},
    }
},
methods: {
//取得產品
  getData(page =1){
    axios.get(`${url}api/${path}/admin/products?page=${page}`)
    .then(res =>{
      if(res.data.success){
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      } else {
        alert(res.data.message);
      }
    }).catch((err) => {
      console.log(err);
    });
  },
  //modal
  openModal(isNewProduct, item) { //isNewProduct分辨新增/編輯/刪除  item->v-for
    if(isNewProduct === 'new') {
      this.tempProduct = { //避免編輯後再按新增會留到同個暫存資料
        imagesUrl: [],
      };
      this.isNewProduct = true;
      productModal.show();
    } else if(isNewProduct === 'edit') {
      this.tempProduct = { ...item }; //淺層拷貝避免連棟改到原始資料
      this.isNewProduct = false;
      productModal.show();
    } else if(isNewProduct === 'delete') {
      this.tempProduct = { ...item };
      delProductModal.show();
    }
  },
  //新增/編輯產品
  updateProduct(tempProduct) {
     // 預設為新增
    let apiUrl = `${url}api/${path}/admin/product`;
    let httpMethod = 'post';
  
     // 根據 isNewProduct 來判斷要串接 post(新增)或是 put(編輯)API
    if(!this.isNewProduct) { 
      apiUrl = `${url}api/${path}/admin/product/${this.tempProduct.id}`;
      httpMethod = 'put'
    }
  
    axios[httpMethod](apiUrl,  { data: this.tempProduct })
      .then((response) => {
      if(response.data.success) {
        alert(response.data.message);
        productModal.hide();// 關掉 modal
        this.getData();//重新渲染資料畫面
      } else {
        alert(response.data.message);
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  //刪除單一產品
  deleteProduct() {
    axios.delete(`${url}api/${path}/admin/product/${this.tempProduct.id}`)
      .then((response) => {
      if (response.data.success) {
        alert(`已刪除「${this.tempProduct.title}」商品`);
        delProductModal.hide();
        this.getData();
      } else {
        alert(response.data.message);
      }
    }).catch((err) => {
      console.log(err);
    })
  },
},

components:{ //區域註冊
  pagination
},

mounted(){ //欲取得資料及動元素時使用mounted而非created
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (token === '') {
      alert('您尚未登入請重新登入。');
      window.location = 'login.html';
    }
      axios.defaults.headers.common.Authorization = token;
      
       this.getData();
      
      // Bootstrap Modal實體掛載
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false
      });
      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false
      });
},
});
//component全域元件放置在createApp後面mount之前
app.component('productModal',{
  props:['tempProduct' , 'isNewProduct'],
  template:` <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
  aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="isNewProduct">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="imageUrl">主要圖片</label>
              <input v-model="tempProduct.imageUrl" type="text" class="form-control" placeholder="請輸入圖片連結">
              <img class="img-fluid" :src="tempProduct.imageUrl">
            </div>
            <div class="mb-1">多圖新增</div>
            <!--判斷是否為陣列圖片-->
            <div v-if="Array.isArray(tempProduct.imagesUrl)">
              <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                <div class="form-group">
                  <label for="imageUrl">圖片網址</label>
                  <input v-model="tempProduct.imagesUrl[key]" type="text" class="form-control"
                    placeholder="請輸入圖片連結">
                </div>
                <img class="img-fluid" :src="image">
              </div>
              <!--刪除圖片不能在第0個-->
              <div
                v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                <button class="btn btn-outline-secondary btn-sm d-block w-100"
                  @click="tempProduct.imagesUrl.push('')">
                  新增圖片
                </button>
              </div>
              <div v-else>
                <!--pop將最後一個刪除-->
                <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                  刪除圖片
                </button>
              </div>
            </div>
            <div v-else>
              <button class="btn btn-outline-primary btn-sm d-block w-100"
                @click="createImages">
                新增圖片
              </button>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                  placeholder="請輸入分類">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" v-model.number="tempProduct.origin_price" type="number" min="0"
                  class="form-control" placeholder="請輸入原價">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" v-model.number="tempProduct.price" type="number" min="0" class="form-control"
                  placeholder="請輸入售價">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
                placeholder="請輸入產品描述">
            </textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
                placeholder="請輸入說明內容">
            </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                  :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('update-product',tempProduct)">
          確認
        </button>
      </div>
    </div>
  </div>
</div>
  `,
  methods:{
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  }
})

app.component('deleteProduct',{
  props: ['tempProduct'],
  template:`
  <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
    aria-labelledby="delProductModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body my-3">
          是否刪除
          <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="$emit('delete-product', tempProduct)">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>`
})

app.mount('#app');