import React, { useEffect, useState } from "react";
const FilterStudents = ({ studentsToShow, setStudentsToShow }) => {
  const [allStudents, setAllStudents] = useState(studentsToShow);
  const [cities, setCities] = useState([]);
  const [filteredUrgencyLevel, setFilteredUrgencyLevel] = useState([]);
  const [selectedCity, setSelectedCity] = useState("no");

  useEffect(() => {
    setAllStudents(studentsToShow);
    const citiesSet = new Set(
      studentsToShow.map((student) => student.city_of_school)
    );
    setCities(Array.from(citiesSet));
    updateUrgencyOptions(studentsToShow);
  }, []);

  const updateUrgencyOptions = (students) => {
    const urgenciesSet = new Set(
      students.map((student) => student.urgency_level)
    );
    setFilteredUrgencyLevel(Array.from(urgenciesSet));
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    document.getElementById("urgencyFilterOptions").value = "no";

    if (city === "no") {
      setStudentsToShow(allStudents);
      updateUrgencyOptions(allStudents);
    } else {
      const newStudArr = allStudents.filter(
        (student) => student.city_of_school === city
      );
      setStudentsToShow(newStudArr);
      updateUrgencyOptions(newStudArr);
    }
  };

  const handleUrgencyChange = (urgency) => {
    const baseStudents =
      selectedCity === "no"
        ? allStudents
        : allStudents.filter(
            (student) => student.city_of_school === selectedCity
          );

    if (urgency === "no") {
      setStudentsToShow(baseStudents);
    } else {
      const newStudArr = baseStudents.filter(
        (student) => student.urgency_level === urgency
      );
      setStudentsToShow(newStudArr);
    }
  };

  return (
    <div>
      <select
        name="cityFilterOptions"
        id="cityFilterOptions"
        onChange={(e) => handleCityChange(e.target.value)}
      >
        <option value="no">-- סינון לפי עיר --</option>
        {cities.map((city, i) => (
          <option key={i} value={city}>
            {city}
          </option>
        ))}
      </select>

      <select
        name="urgencyFilterOptions"
        id="urgencyFilterOptions"
        onChange={(e) => handleUrgencyChange(e.target.value)}
      >
        <option value="no">-- סינון לפי רמת דחיפות --</option>
        {filteredUrgencyLevel.map((urgency, i) => (
          <option key={i} value={urgency}>
            {urgency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterStudents;
