export default{
  props:['page'],
  // props:{
  //   page:{
  //     type: Object,
  //     default(){
  //       return{
          
  //       }
  //     }
  //   }
  // }
  template:`<nav aria-label="Page navigation example">
  <ul class="pagination shadow">
  <!--上頁 -->
  <!--:class="{'disabled' : page.current_page === 1}" -->
    <li class="page-item" :class="{'disabled' : !page.has_pre}">
      <a class="page-link" href="#" aria-label="Previous"
      @click="$emit('get-data', page.current_page -1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item"
    :class="{'active' : item === page.current_page}" v-for="item in page.total_pages" :key="item"><a class="page-link" href="#" @click="$emit('get-data',item)">{{ item }}</a></li>
    <!--下頁 -->
    <!--:class="{'disabled' : page.current_page === total_pages}" -->
    <li class="page-item" :class="{'disabled' : !page.has_next}">
      <a class="page-link" href="#" aria-label="Next"
      @click="$emit('get-data', page.current_page +1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`
}