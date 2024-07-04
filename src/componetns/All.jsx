import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./All.css";

const All = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/comments");
        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCardClick = (index) => {
    if (index === selectedCardIndex) {
      setSelectedCardIndex(null);
      scrollIntoView(null);
    } else {
      setSelectedCardIndex(index);
      scrollIntoView(index);
    }
  };

  const scrollIntoView = (index) => {
    if (index !== null && cardsRef.current[index]) {
      cardsRef.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      document.querySelector(".cards").scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    document.querySelector(".cards").scrollIntoView({ behavior: "smooth" });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`All ${darkMode ? "dark-mode" : ""}`}>
      <div className="container">
        <div className="toggle-dark-mode">
          <button onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="cards">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {!loading &&
            !error &&
            filteredData.map((item, index) => (
              <div
                className={`card ${
                  index === selectedCardIndex ? "selected" : ""
                }`}
                key={index}
                ref={(element) => (cardsRef.current[index] = element)}
                onClick={() => handleCardClick(index)}
              >
                <div className="blue"></div>
                <p className={`white ${darkMode ? "dark-text" : ""}`}>
                  #ID: {item.id}
                </p>
                <h2 className={darkMode ? "dark-text" : ""}>{item.body}</h2>
                <div className="days">
                  <p className={darkMode ? "dark-text" : ""}>Floyd Miles</p>
                  <span className={darkMode ? "dark-text" : ""}>
                    3 Days Ago
                  </span>
                </div>
              </div>
            ))}
        </div>
        <div className="backtop">
          <button onClick={scrollToTop}>👆</button>
        </div>
      </div>
    </div>
  );
};

export default All;
