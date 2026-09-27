import { useState, useEffect } from 'react'
import './App.css'

function ProductList({ products, category, onFavorite, favoriteProducts }) {
  return (
    <>
    <main className="container">

      <ul className="product-list">

        {products.map(product => {

          const alreadyFavorite = favoriteProducts.some(
            favorite => favorite.id === product.id
          )

          return (
            <li key={product.id} className='product-card'>

              <img src={product.thumbnail} alt={product.title}/>

              <div className='product-details'>

                <div className='product-title'>
                  <h3>{product.title}</h3>

                  <button className='fav-button' onClick={() => onFavorite(product)}>
                      {alreadyFavorite ? "❤️" : "🤍"}
                  </button>
                </div>
     
                <p className="product-price">{`$${product.price}`}</p>
                <p className="product-category">{product.category}</p>
                <p className="product-rating">{`⭐ ${product.rating}`}</p>

              </div>  
              

              
            </li>
          )
        })}
      </ul>
    </main>
      
    </>
  )
}
  

function App() {

  const [category, setCategory] = useState("All")
  const [favoriteProducts, setFavoriteProducts] = useState(
      JSON.parse(localStorage.getItem("favorites")) || []
  )

  useEffect(() => {
            localStorage.setItem("favorites", JSON.stringify(favoriteProducts))
          }, [favoriteProducts])

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchProduct, setSearchProduct] = useState("")

    useEffect(() => {

  async function fetchProducts() {
    try {
      const response = await fetch("https://dummyjson.com/products")
      const data = await response.json()
      setProducts(data.products)
      
    } catch (error) {
        setError("Failed to load products")
    } finally {
      setLoading(false)
    }
    
  }

  fetchProducts()

  }, [])

  

  

  const filteredProducts = products.filter(product =>
  (product.category === category || category === "All") &&
  product.title.toLowerCase().includes(searchProduct.toLowerCase())
  )

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const pageProducts = filteredProducts.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  useEffect(() => {
  setCurrentPage(1)
  }, [searchProduct, category])

      
       function onFavorite(product) {

          setFavoriteProducts(prev => {
            const newArray = [...prev]

            const index = newArray.findIndex(
              favorite => favorite.id === product.id
            )

            if (index === -1) {
              newArray.push(product)
            } else {
              newArray.splice(index, 1)
            }

            return newArray
          })
      }



  return (
    <main className="container">

      <h1>Product Explorer</h1>
      <p>Discover products you might like</p>

      <input
        className="search-input"
        type="text"
        placeholder="Search products..."
        onChange={(e) => setSearchProduct(e.target.value)}
      />

      <div className="category-buttons">
        <button onClick={() => setCategory("All")}>All</button>
        <button onClick={() => setCategory("beauty")}>Beauty</button>
        <button onClick={() => setCategory("fragrances")}>Fragrances</button>
        <button onClick={() => setCategory("groceries")}>Groceries</button>
      </div>

        {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p>No products found.</p>
      )}
      
      {!loading && !error && filteredProducts.length > 0 && (
        <ProductList 
        products={pageProducts}
        category={category}
        onFavorite={onFavorite}
        favoriteProducts={favoriteProducts}
        />
      )}

      <div className="pagination">
        <button disabled={currentPage === 1}
          onClick ={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1)
      
            }
          }}
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button disabled={currentPage === totalPages}
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1)
            }
          }}
        >
          Next
        </button>
      </div>
      
    </main>
  )
}

export default App;

