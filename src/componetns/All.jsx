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
    setSelectedCardIndex(index);
    scrollIntoView(index);
  };

  const scrollIntoView = (index) => {
    if (cardsRef.current[index]) {
      cardsRef.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="All">
      <div className="container">
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
                <p className="white">#ID: {item.id}</p>
                <h2>{item.body}</h2>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default All;
