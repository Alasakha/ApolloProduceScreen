/**
 * A utility function to transform warehouse data.
 * @param param1 - The input data object where keys are warehouse names and values are item arrays.
 * @returns An array of transformed data with warehouse, item name, and quantity.
 */
export function handleData<T>(param1: Record<string, T[]>): { warehouse: string; itemName: string; qty: number }[] {
  const allData = Object.entries(param1).flatMap(([warehouse, items]) => {
    return items.map(item => {
      // 确保从 item 中提取 item_name 和 qty
      const itemName = (item as any).item_name ?? 'Unknown Item';  // 默认值为 'Unknown Item'
      const qty = Number((item as any).qty) || 0;  // 默认值为 0（如果 qty 无效）
 // 保留一位小数
 const qtyWithDecimal = parseFloat(qty.toFixed(0)); // 保留一位小数
      // 返回处理后的数据
      return {
        warehouse, // 仓库名
        itemName,  // 物品名称
        qty:qtyWithDecimal       // 数量
      };
    });
  });

  return allData;  // 返回扁平化后的数据
}

/**
 * 按仓库名分组所有物料数据（不保留每项的仓库字段）
 * @param data 所有物料数据（每项包含 warehouse）
 * @returns { [仓库名]: 对应的简化数据数组 }
 */
export function groupByWarehouse(
    data: Array<{ warehouse: string; itemName: string; qty: number }>
  ) {
    return data.reduce((acc, item) => {
      const { warehouse, ...rest } = item;
      if (!acc[warehouse]) {
        acc[warehouse] = [];
      }
      acc[warehouse].push(rest); // 只保留 itemName 和 qty 等字段
      return acc;
    }, {} as Record<string, Omit<typeof data[number], 'warehouse'>[]>);
  }

  export function formatWarehouseData(
    list: Array<{ itemName: string; qty: number }>
  ): string[][] {
    return list.map((item) => [
      item.itemName, // 保持为字符串
      item.qty.toString(), // 将数字转换为字符串
      // 自定义内容
    ]);
  }