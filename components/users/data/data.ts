// 📌 Mock user data (userSchema ile uyumlu)
export const users = {
  data: [
    {
      id: 'USER-001',
      email: 'admin@example.com',
      password: '********',
      role: 'ADMIN',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      id: 'USER-002',
      email: 'customer@example.com',
      password: '********',
      role: 'CUSTOMER',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
  ],
}

// 📌 Kullanıcı filtreleri
export const userFilters = {
  role: [
    { label: 'users.roles.admin', value: 'ADMIN' },
    { label: 'users.roles.customer', value: 'CUSTOMER' },
  ],
}

// 📌 Kolon etiketleri
export const columnLabels = [
  { label: 'users.columns.id', value: 'id' },
  { label: 'users.columns.email', value: 'email' },
  { label: 'users.columns.role', value: 'role' },
  { label: 'users.columns.createdAt', value: 'createdAt' },
  { label: 'users.columns.updatedAt', value: 'updatedAt' },
]

// 📌 Row actions için etiketler
export const labels = [
  { value: 'edit', label: 'Edit' },
  { value: 'delete', label: 'Delete' },
  { value: 'view', label: 'View' },
]
