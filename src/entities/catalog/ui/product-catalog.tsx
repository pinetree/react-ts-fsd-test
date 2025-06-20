import { useState } from 'react'

function ProductCatalog({ products, categories, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const filteredProducts = products
    .filter(product => {
      if (selectedCategory === 'all') return true
      return product.category === selectedCategory
    })
    .filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'rating') return b.rating - a.rating
    })
  const handleAddToCart = product => {
    setCart([...cart, product])
    onAddToCart(product)
  }
  const handleCategoryChange = category => {
    setSelectedCategory(category)
  }
  const handleSortChange = sort => {
    setSortBy(sort)
  }
  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Поиск товаров..."
        />
        <select
          value={selectedCategory}
          onChange={e => handleCategoryChange(e.target.value)}
        >
          <option value="all">Все категории</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={e => handleSortChange(e.target.value)}>
          <option value="name">По названию</option>
          <option value="price">По цене</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>
      <div>
        {filteredProducts.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Цена: ${product.price}</p>
            <p>Рейтинг: {product.rating}/5</p>
            <button onClick={() => handleAddToCart(product)}>В корзину</button>
          </div>
        ))}
      </div>
      <div>Товаров в корзине: {cart.length}</div>
    </div>
  )
}
