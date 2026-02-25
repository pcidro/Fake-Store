import React, { useEffect, useState } from "react";
import "./App.css";

const App = () => {
  interface Rating {
    rate: number;
    count: number;
  }

  interface iProdutos {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: Rating;
  }

  const [produtos, setProdutos] = useState<iProdutos[] | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [inputProduct, setInputProduct] = useState("");
  const [prices, setPrices] = useState("");

  const produtosFiltrados = produtos?.filter((produto) => {
    const matchCategoria =
      categoriaSelecionada === "" || produto.category === categoriaSelecionada;

    const matchTexto =
      inputProduct === "" ||
      produto.title.toLowerCase().includes(inputProduct.trim().toLowerCase());
    return matchCategoria && matchTexto;
  });

  const produtosOrdenados = [...(produtosFiltrados || [])].sort((a, b) => {
    if (prices === "low") {
      return a.price - b.price;
    }

    if (prices === "high") {
      return b.price - a.price;
    }

    return 0;
  });

  useEffect(() => {
    async function getProducts() {
      const res = await fetch("https://fakestoreapi.com/products");
      const data = await res.json();
      setProdutos(data);
    }
    getProducts();
  }, []);

  if (!produtosFiltrados) return;
  return (
    <div className="container">
      <aside className="aside">
        <h3>Select your favorite category</h3>
        <div className="input-group">
          <label>All Products</label>
          <input
            type="radio"
            name="product"
            value=""
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="men's">Men's clothing</label>
          <input
            type="radio"
            name="product"
            id="men's"
            value="men's clothing"
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="men's">Jewelery</label>
          <input
            type="radio"
            name="product"
            id="jewelery"
            value="jewelery"
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="electronics">Electronics</label>
          <input
            type="radio"
            name="product"
            id="electronics"
            value="electronics"
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="women">Women's clothing</label>
          <input
            type="radio"
            value="women's clothing"
            name="product"
            id="women"
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
          />
        </div>
        <h3>Search for your favorite product</h3>
        <input
          type="text"
          placeholder="Search for products..."
          value={inputProduct}
          onChange={({ target }) => setInputProduct(target.value)}
        />
        <h3>Order by:</h3>
        <select id="order" onChange={({ target }) => setPrices(target.value)}>
          <option disabled value="">
            Select a option
          </option>
          <option value="low">Lowest price</option>
          <option value="high">Highest price</option>
        </select>
      </aside>
      <div className="container-geral">
        <ul className="products-container">
          {produtosOrdenados.map((produto) => (
            <li className="product" key={produto.id}>
              <h2>{produto.title}</h2>
              <p className="price">
                Price:
                {produto.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}{" "}
                - <span className="category">{produto.category}</span>
              </p>
              <p className="description">{produto.description}</p>
              <img src={produto.image} alt="" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
