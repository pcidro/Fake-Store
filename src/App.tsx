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

  const produtosFiltrados = produtos?.filter((produto) => {
    const matchCategoria =
      categoriaSelecionada === "" || produto.category === categoriaSelecionada;

    const matchTexto =
      inputProduct === "" ||
      produto.title.toLowerCase().includes(inputProduct.trim().toLowerCase());

    return matchCategoria && matchTexto;
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
      </aside>
      <div className="container-geral">
        <ul className="products-container">
          {produtosFiltrados.map((produto) => (
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
