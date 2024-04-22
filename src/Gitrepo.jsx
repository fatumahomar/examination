import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Search from "./pages/Search.jsx";

function Repository() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRepos = async () => {
      const perPage = 5; // Number of repositories per page

      try {
        const response = await fetch(
          `https://api.github.com/user/repos?page=${page}&per_page=${perPage}`
        );

        if (response.ok) {
          const data = await response.json();
          setRepos(data);
        } else {
          console.error("Failed to fetch repositories");
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    fetchRepos();
  }, [page]);

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  // Search code
  const [repos2, setRepos2] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRepos = async (query) => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.github.com/user/repos?q=${query}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRepos2(data);
    } catch (error) {
      console.error("Error searching repositories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="repo-box">
      <Outlet />
      <Search onSearchRepo={searchRepos} />
      <div className="repo-section">
        {repos.map((repo) => (
          <div className="repo-hold" key={repo.id}>
            <p>
              <b>
                project id:{" "}
                <Link to={`/repos/${repo.name}`}>{repo.name}</Link>
              </b>
            </p>
            <hr />
            <p>
              <b>project name:</b> {repo.name}
            </p>
            <p>{repo.description || "No description"}</p>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        ))}
      </div>
      <div className="button-box">
        <button onClick={prevPage} disabled={page === 1}>
          Previous Page
        </button>
        <button onClick={nextPage}>Next Page</button>
      </div>
      {loading && <p>Loading...</p>}
      <ul>
        {repos2.map((repos) => (
          <li key={repos.id}>
            <a
              href={repos.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repos.full_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Repository;