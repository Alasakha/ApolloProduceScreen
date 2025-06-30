<template>
  <div class="native-table">
    <div class="table-title">{{ tableTitle }}</div>
    <table>
      <thead>
        <tr>
          <th>{{ productLabel }}</th>
          <th>实际值</th>
          <th>参考值</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in tableData" :key="idx">
          <td>{{ row.name }}</td>
          <td>{{ row.real }}</td>
          <!-- //参考值 -->
          <td>{{ row.reference}}</td> 
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  tableData: Array,
  tableTitle: String,
  productLabel: String
});
</script>

<style scoped>
.native-table {
  background: rgba(0, 40, 80, 0.7);
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
}
.table-title {
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
  text-align: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}
th, td {
  border: 1px solid #53eafd;
  padding: 8px;
  text-align: center;
}
th {
  background: linear-gradient(to right, #611ed1, #0e5fff);
  color: #b8e6fe;
}
tr:nth-child(even) {
  background: rgba(37, 117, 252, 0.2);
}
</style>
