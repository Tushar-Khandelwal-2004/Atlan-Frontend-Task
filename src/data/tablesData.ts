export const tablesData: Record<string, {
    columns: string[];
    queries: Array<{
      id: string;
      name: string;
      query: string;
      results: any[];
    }>;
  }> = {
    "customers": {
      columns: ["id", "name", "email", "country", "created_at", "status"],
      queries: [
        {
          id: "customers_all",
          name: "All Customers",
          query: "SELECT * FROM customers;",
          results: [
            { id: 1, name: "John Doe", email: "john@example.com", country: "USA", created_at: "2023-01-15", status: "active" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", country: "Canada", created_at: "2023-02-20", status: "active" },
            { id: 3, name: "Robert Johnson", email: "robert@example.com", country: "UK", created_at: "2023-03-10", status: "inactive" },
            { id: 4, name: "Emily Davis", email: "emily@example.com", country: "Australia", created_at: "2023-04-05", status: "active" },
            { id: 5, name: "Michael Brown", email: "michael@example.com", country: "USA", created_at: "2023-05-12", status: "active" }
          ]
        },
        {
          id: "customers_active",
          name: "Active Customers",
          query: "SELECT * FROM customers WHERE status = 'active';",
          results: [
            { id: 1, name: "John Doe", email: "john@example.com", country: "USA", created_at: "2023-01-15", status: "active" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", country: "Canada", created_at: "2023-02-20", status: "active" },
            { id: 4, name: "Emily Davis", email: "emily@example.com", country: "Australia", created_at: "2023-04-05", status: "active" },
            { id: 5, name: "Michael Brown", email: "michael@example.com", country: "USA", created_at: "2023-05-12", status: "active" }
          ]
        },
        {
          id: "customers_by_country",
          name: "Customers by Country",
          query: "SELECT country, COUNT(*) as customer_count FROM customers GROUP BY country;",
          results: [
            { country: "USA", customer_count: 2 },
            { country: "Canada", customer_count: 1 },
            { country: "UK", customer_count: 1 },
            { country: "Australia", customer_count: 1 }
          ]
        }
      ]
    },
    "orders": {
      columns: ["id", "customer_id", "product_id", "quantity", "total_amount", "order_date", "status"],
      queries: [
        {
          id: "orders_all",
          name: "All Orders",
          query: "SELECT * FROM orders;",
          results: [
            { id: 101, customer_id: 1, product_id: 5, quantity: 2, total_amount: 159.98, order_date: "2023-06-10", status: "delivered" },
            { id: 102, customer_id: 2, product_id: 3, quantity: 1, total_amount: 49.99, order_date: "2023-06-12", status: "shipped" },
            { id: 103, customer_id: 3, product_id: 7, quantity: 3, total_amount: 89.97, order_date: "2023-06-15", status: "processing" },
            { id: 104, customer_id: 1, product_id: 2, quantity: 1, total_amount: 199.99, order_date: "2023-06-18", status: "delivered" },
            { id: 105, customer_id: 4, product_id: 9, quantity: 2, total_amount: 119.98, order_date: "2023-06-20", status: "shipped" }
          ]
        },
        {
          id: "orders_by_status",
          name: "Orders by Status",
          query: "SELECT status, COUNT(*) as order_count, SUM(total_amount) as total_sales FROM orders GROUP BY status;",
          results: [
            { status: "delivered", order_count: 2, total_sales: 359.97 },
            { status: "shipped", order_count: 2, total_sales: 169.97 },
            { status: "processing", order_count: 1, total_sales: 89.97 }
          ]
        },
        {
          id: "customer_orders",
          name: "Customer Orders",
          query: "SELECT c.name, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id;",
          results: [
            { name: "John Doe", order_count: 2, total_spent: 359.97 },
            { name: "Jane Smith", order_count: 1, total_spent: 49.99 },
            { name: "Robert Johnson", order_count: 1, total_spent: 89.97 },
            { name: "Emily Davis", order_count: 1, total_spent: 119.98 }
          ]
        }
      ]
    },
    "products": {
      columns: ["id", "name", "category", "price", "stock", "supplier_id"],
      queries: [
        {
          id: "products_all",
          name: "All Products",
          query: "SELECT * FROM products;",
          results: [
            { id: 1, name: "Laptop", category: "Electronics", price: 999.99, stock: 45, supplier_id: 5 },
            { id: 2, name: "Smartphone", category: "Electronics", price: 699.99, stock: 120, supplier_id: 5 },
            { id: 3, name: "Headphones", category: "Electronics", price: 149.99, stock: 75, supplier_id: 2 },
            { id: 4, name: "T-shirt", category: "Clothing", price: 19.99, stock: 200, supplier_id: 3 },
            { id: 5, name: "Jeans", category: "Clothing", price: 49.99, stock: 150, supplier_id: 3 }
          ]
        },
        {
          id: "products_by_category",
          name: "Products by Category",
          query: "SELECT category, COUNT(*) as product_count, AVG(price) as avg_price FROM products GROUP BY category;",
          results: [
            { category: "Electronics", product_count: 3, avg_price: 616.66 },
            { category: "Clothing", product_count: 2, avg_price: 34.99 }
          ]
        },
        {
          id: "low_stock_products",
          name: "Low Stock Products",
          query: "SELECT * FROM products WHERE stock < 50;",
          results: [
            { id: 1, name: "Laptop", category: "Electronics", price: 999.99, stock: 45, supplier_id: 5 }
          ]
        }
      ]
    },
    "employees": {
      columns: ["id", "first_name", "last_name", "department", "salary", "hire_date"],
      queries: [
        {
          id: "employees_all",
          name: "All Employees",
          query: "SELECT * FROM employees;",
          results: [
            { id: 1, first_name: "Alice", last_name: "Johnson", department: "Sales", salary: 65000, hire_date: "2022-03-15" },
            { id: 2, first_name: "Bob", last_name: "Smith", department: "Marketing", salary: 70000, hire_date: "2021-11-05" },
            { id: 3, first_name: "Charlie", last_name: "Davis", department: "Engineering", salary: 85000, hire_date: "2022-01-20" },
            { id: 4, first_name: "Diana", last_name: "Wilson", department: "HR", salary: 60000, hire_date: "2022-05-10" },
            { id: 5, first_name: "Edward", last_name: "Miller", department: "Engineering", salary: 90000, hire_date: "2021-08-22" }
          ]
        },
        {
          id: "employees_by_department",
          name: "Employees by Department",
          query: "SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary FROM employees GROUP BY department;",
          results: [
            { department: "Sales", employee_count: 1, avg_salary: 65000 },
            { department: "Marketing", employee_count: 1, avg_salary: 70000 },
            { department: "Engineering", employee_count: 2, avg_salary: 87500 },
            { department: "HR", employee_count: 1, avg_salary: 60000 }
          ]
        },
        {
          id: "high_salary_employees",
          name: "High Salary Employees",
          query: "SELECT * FROM employees WHERE salary > 75000;",
          results: [
            { id: 3, first_name: "Charlie", last_name: "Davis", department: "Engineering", salary: 85000, hire_date: "2022-01-20" },
            { id: 5, first_name: "Edward", last_name: "Miller", department: "Engineering", salary: 90000, hire_date: "2021-08-22" }
          ]
        }
      ]
    },
    "large_dataset": {
      columns: ["id", "name", "value", "created_at", "status"],
      queries: [
        {
          id: "large_dataset_all",
          name: "All Large Dataset Records",
          query: "SELECT * FROM large_dataset;",
          results: Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`,
            value: Math.floor(Math.random() * 10000) / 100,
            created_at: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)]
          }))
        },
        {
          id: "large_dataset_active",
          name: "Active Large Dataset Records",
          query: "SELECT * FROM large_dataset WHERE status = 'active';",
          results: Array.from({ length: 300 }, (_, i) => ({
            id: i + 1,
            name: `Active Item ${i + 1}`,
            value: Math.floor(Math.random() * 10000) / 100,
            created_at: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
            status: 'active'
          }))
        },
        {
          id: "large_dataset_summary",
          name: "Large Dataset Summary",
          query: "SELECT status, COUNT(*) as record_count, AVG(value) as avg_value FROM large_dataset GROUP BY status;",
          results: [
            { status: "active", record_count: 334, avg_value: 49.87 },
            { status: "pending", record_count: 333, avg_value: 51.23 },
            { status: "completed", record_count: 333, avg_value: 50.45 }
          ]
        }
      ]
    }
  };
  