import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  // A filter is often used to group data by a specific keyword. 
  const [filter, setFilter] = useState("");
  //Pagination reduces list of items displayed & increases app's performance
  const [paginate, setpaginate] = useState(8);

  useEffect(() => {
      //         const request_headers = new Headers();
      //         const api_key = null;
      //         request_headers.append("Authorization", `Bearer ${api_key}`);
      //         request_headers.append("Content-Type", "application/json");

      //         const request_options = {
      //             method: "GET",
      //             headers: request_headers
      //         };

      fetch(
          "https://raw.githubusercontent.com/iamspruce/search-filter-painate-reactjs/main/data/countries.json"
      )
          .then((res) => res.json())
          .then(
              (result) => {
                  setLoaded(true);
                  setItems(result);
              },
              (error) => {
                  setLoaded(true);
                  setError(error);
              }
          );
  }, []);

  const data = Object.values(items);

  // 3) data returned from API assigned to "search_parameters"
  const search_parameters = Object.keys(Object.assign({}, ...data));
  const filter_items = [...new Set(data.map((item) => item.region))];

  // 2) next, use that query to filter the data returned from the API.
  function search(items) {
      return items.filter((item) =>
         item.region.includes(filter) && search_parameters.some((parameter) =>
              item[parameter].toString().toLowerCase().includes(query)
          )
      );
  }

  // paginate function - updates State anytime function is called
  const load_more = (event) => {
    setpaginate((prevValue) => prevValue + 8);
  };

  if (error) {
      return <>{error.message}</>;
  } else if (!loaded) {
      return <>loading...</>;
  } else {
      return (
          <div className="wrapper">

            {/* Search component */}
              <div className="search-wrapper">
                  <label htmlFor="search-form">
                      <input
                          type="search"
                          name="search-form"
                          id="search-form"
                          className="search-input"
                          placeholder="Search for..."
                          onChange={(e) => setQuery(e.target.value)}
                          // 1) anytime the input field value changes, the value is set to "query" using the "useState" hook.
                          
                      />
                      <span className="sr-only">Search countries here</span>
                  </label>

                  <div className="select">
                    {/* The "Filter" method UI is here */}
                      <select
                          onChange={(e) => setFilter(e.target.value)}
                          className="custom-select"
                          aria-label="Filter Countries By Region"
                      >
                          <option value="">Filter By Region</option>
                          {filter_items.map((item) => (
                              <option value={item}>Filter By {item}</option>
                          ))}
                      </select>
                      <span className="focus"></span>
                  </div>
              </div>

              <ul className="card-grid">
                {/* 4) use new data returned from "search(data)" function to build the country list*/}
                  {search(data)
                  // "paginate" value updates the countries list 
                  .slice(0, paginate)
                  .map((item) => (
                      <li key={item.alpha3Code}>
                          <article className="card">
                              <div className="card-image">
                                  <img
                                      src={item.flag.large}
                                      alt={item.name}
                                  />
                              </div>
                              <div className="card-content">
                                  <h2 className="card-name">{item.name}</h2>
                                  <ol className="card-list">
                                      <li>
                                          population:{" "}
                                          <span>{item.population}</span>
                                      </li>
                                      <li>
                                          Region: <span>{item.region}</span>
                                      </li>
                                      <li>
                                          Capital: <span>{item.capital}</span>
                                      </li>
                                  </ol>
                              </div>
                          </article>
                      </li>
                  ))}
              </ul>
              <button onClick={load_more}>Load More</button>
          </div>
      );
  }
}

export default App;
