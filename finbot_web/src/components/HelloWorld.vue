<template>
  <div class="container">
    <h1 class="title">群組記帳系統</h1>

    <div class="card">
      <router-link to="/participants" class="btn btn-primary" style="margin-bottom: 10px;">
        參與者設定
      </router-link>
      <router-link to="/accounting" class="btn btn-primary">
        記帳
      </router-link>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-bottom: 25px;
}

.card-title {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 20px;
  color: #3498db;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.icon {
  margin-right: 5px;
  font-weight: bold;
}

.table-container {
  overflow-x: auto;
}

.expense-table {
  width: 100%;
  border-collapse: collapse;
}

.expense-table th, .expense-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.expense-table th {
  background-color: #f8f9fa;
  color: #555;
}

.expense-table tr:hover {
  background-color: #f8f9fa;
}

.expense-table .amount {
  text-align: right;
  font-weight: bold;
}

.settlement-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.settlement-item {
  padding: 15px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.settlement-item .person {
  font-weight: bold;
  margin-bottom: 5px;
}

.settlement-item .amount {
  font-size: 1.4rem;
  font-weight: bold;
}

.settlement-item.receive {
  background-color: #e6f7ee;
  border-left: 4px solid #2ecc71;
}

.settlement-item.pay {
  background-color: #fdeaea;
  border-left: 4px solid #e74c3c;
}

.amount-label {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 2px;
}

.actions {
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }
  
  .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  
  .card {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .card-title {
    font-size: 1.2rem;
  }
  
  .settlement-list {
    grid-template-columns: 1fr;
  }
  
  .expense-table th, .expense-table td {
    padding: 8px;
    font-size: 14px;
  }
  
  .settlement-item .amount {
    font-size: 1.2rem;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>