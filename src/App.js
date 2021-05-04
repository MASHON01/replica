import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const handleNameChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleTagChange = (event) => {
    setSearchTag(event.target.value);
  };

  const handleAddTag = (event) => {
    let res = JSON.parse(localStorage.getItem("students"));
    const id = event.target.name;
    res[id].tag = event.target.value;
    setSearchResults(res);
    localStorage.setItem("students", JSON.stringify(res));
  };

  const [studentsData, setStudentsState] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [searchResults, setSearchResults] = useState(studentsData);
  const getStudentsData = () => {
    return fetch("https://api.hatchways.io/assessment/students").then((res) =>
      res.json()
    );
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("students"));
    if (!isFetching && !data) {
      getStudentsData().then((resp) => {
        const data = resp.students.map((v) => ({ ...v, tag: "" }));
        setStudentsState(data);
        setIsFetching(true);
        localStorage.setItem("students", JSON.stringify(data));
      });
    } else {
      setStudentsState(data);
      setIsFetching(true);
    }
  }, [isFetching]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("students"));

    if (isFetching && Array.isArray(data)) {
      const results = data.filter((student) => {
        if (searchTag && searchTerm) {
          return (
            student.firstName.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm) ||
            student.tag.toLowerCase().includes(searchTag)
          );
        } else if (!searchTag && searchTerm) {
          return (
            student.firstName.toLowerCase().includes(searchTerm) ||
            student.lastName.toLowerCase().includes(searchTerm)
          );
        } else if (searchTag && !searchTerm) {
          return student.tag.toLowerCase().includes(searchTag);
        } else {
          return true;
        }
      });
      setSearchResults(results);
    }
  }, [searchTerm, searchTag, isFetching]);

  const [readMore, setReadMore] = useState(false);
  const linkName = readMore ? <b>&#45;</b> : <b>&#43;</b>;

  return (
    <div className="App">
      {isFetching ? (
        <>
          <form class="search">
            <input
              class="searchTerm"
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleNameChange}
            />
          </form>
          <form class="search">
            <input
              class="searchTerm"
              type="text"
              placeholder="Search by tag"
              value={searchTag}
              onChange={handleTagChange}
            />
          </form>

          <div className="container">
            {searchResults.map((student, studentId) => {
              const grades = student.grades;
              let avgGrades = 0;
              if (Array.isArray(grades)) {
                const sumGrades = grades.reduce(
                  (a, b) => parseInt(a, 10) + parseInt(b, 10),
                  0
                );
                avgGrades = sumGrades / grades.length || 0;
              }
              return (
                <div className="row">
                  <div className="column left">
                    <img className="dp" src={student.pic} alt="Profile" />
                  </div>
                  <div className="column right">
                    <p className="names">
                      <b>
                        {student.firstName} {student.lastName}
                      </b>
                    </p>
                    <p>Email : {student.email}</p>
                    <p>Company : {student.company}</p>
                    <p>Skill : {student.skill}</p>
                    <p>Avarage : {avgGrades}%</p>
                    <p>{student.tag && <div>{student.tag}</div>}</p>

                    <input
                      className="newtag"
                      type="text"
                      id="tag"
                      name={studentId}
                      placeholder="Add tag"
                      onChange={handleAddTag}
                    />

                    <button
                      className="testbutton"
                      type="button"
                      onClick={() => {
                        setReadMore(!readMore);
                      }}
                    >
                      {" "}
                      {linkName}
                    </button>
                    {readMore &&
                      student.grades.map((grade, index) => (
                        <p>
                          Test{index + 1}   {grade} %
                        </p>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div>Loading.....</div>
      )}
    </div>
  );
}

export default App;
