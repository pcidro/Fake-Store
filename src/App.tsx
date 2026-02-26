import React, { useEffect, useState } from "react";
import "./App.css";
import Cart from "./assets/cart.svg";

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
    quantidade?: number;
  }

  const [produtos, setProdutos] = useState<iProdutos[] | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [inputProduct, setInputProduct] = useState("");
  const [prices, setPrices] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<iProdutos[] | []>([]);

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

  const itensPorPagina = 10;
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = paginaAtual * itensPorPagina;
  const itensAtuais = produtosOrdenados.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(produtosOrdenados.length / itensPorPagina);

  function addtoCart(produtoClicado: iProdutos) {
    const inCart = itensAtuais.findIndex(
      (produto) => produto.id === produtoClicado.id,
    );
    if (!inCart) {
      setCarrinho([...carrinho, { ...produtoClicado, quantidade: 1 }]);
    } else {
      const newCarrinho = itensAtuais.map((item) => {
        if (item.id === produtoClicado.id) {
          return { ...item, quantidade: (item.quantidade || 0) + 1 };
        }
        return item;
      });
      setCarrinho(newCarrinho);
    }
  }

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.log(err);
        setError("Erro ao buscar produtos");
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  if (!produtosFiltrados) return;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
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
          {itensAtuais.map((produto) => (
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
              <img className="product-img" src={produto.image} alt="" />
              <button
                onClick={() => addtoCart(produto)}
                className="button-cart"
              >
                <img src={Cart} alt="add to cart" />
              </button>
            </li>
          ))}
        </ul>
        <div>
          <h3>Meu carrinho</h3>
          {carrinho.map((produto) => (
            <li>
              <h3>
                {produto.title} - Quantidade:{produto.quantidade}
              </h3>
              <p>Subtotal: {produto.price * (produto.quantidade || 0)}</p>
            </li>
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={() => setPaginaAtual((prev) => prev - 1)}
            disabled={paginaAtual === 1}
          >
            Previous
          </button>
          <span>
            Page {paginaAtual} of {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual((prev) => prev + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
