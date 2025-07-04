<template>
 <div class="modal-backdrop">
   <div class="modal">
     <h3>细分筛选条件</h3>
     <div class="modal-body">
       <div class="form-group">
         <label for="nameFilter">名称包含:</label>
         <input type="text" id="nameFilter" v-model="filters.name" placeholder="输入名称" />
       </div>
       <div class="form-group">
         <label for="idFilter">ID 等于:</label>
         <input type="number" id="idFilter" v-model="filters.id" placeholder="输入ID" />
       </div>
       </div>
     <div class="modal-footer">
       <button @click="$emit('close')" class="cancel-button">取消</button>
       <button @click="applyFilters" class="apply-button">应用</button>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 name: 'AdvancedSearchModal',
 data() {
   return {
     filters: {
       name: '',
       id: null
       // 其他筛选条件
     }
   };
 },
 methods: {
   applyFilters() {
     this.$emit('apply', this.filters);
   }
 }
};
</script>

<style scoped>
.modal-backdrop {
 position: fixed;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-color: rgba(0, 0, 0, 0.5);
 display: flex;
 justify-content: center;
 align-items: center;
 z-index: 1000;
}

.modal {
 background-color: #fff;
 border-radius: 8px;
 padding: 20px;
 width: 80%;
 max-width: 500px;
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal h3 {
 margin-top: 0;
 margin-bottom: 20px;
 color: #333;
 text-align: center;
}

.modal-body {
 margin-bottom: 20px;
}

.form-group {
 margin-bottom: 15px;
}

.form-group label {
 display: block;
 margin-bottom: 5px;
 font-weight: bold;
 color: #555;
}

.form-group input {
 width: 100%;
 padding: 10px;
 border: 1px solid #ccc;
 border-radius: 4px;
 font-size: 1em;
 box-sizing: border-box;
}

.modal-footer {
 display: flex;
 justify-content: flex-end;
 gap: 10px;
}

.cancel-button, .apply-button {
 padding: 10px 15px;
 border-radius: 5px;
 cursor: pointer;
 font-size: 1em;
}

.cancel-button {
 border: 1px solid #ccc;
 background-color: #f0f0f0;
 color: #333;
}

.apply-button {
 background-color: #007bff;
 color: white;
 border: none;
}
</style>