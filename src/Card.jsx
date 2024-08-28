import React, { useEffect, useState } from "react";

const BASE_URL = "https://api.wordnik.com/v4/words.json/wordOfTheDay?date=";

function Card() {
  const [term, setTerm] = useState(null);

  // Function to generate a random date between January 16th, 2012 and the current date
  const getRandomDate = () => {
    const startDate = new Date(2012, 0, 16); // January 16th, 2012
    const endDate = new Date(); // Current date
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const randomDate = new Date(randomTime);

    return randomDate.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const storedWord = localStorage.getItem("wotd");
    const storedDate = localStorage.getItem("wotdDate");
    const randomDate = storedDate === today ? localStorage.getItem("randomDate") : getRandomDate();

    if (storedDate === today && storedWord) {
      // If the word was fetched today, use the stored word
      setTerm(JSON.parse(storedWord));
    } else {
      // Fetch a new word for the random date and store it with today's date
      const fetchData = async () => {
        const result = await fetch(
          `${BASE_URL}${randomDate}&api_key=6rheym0wg34thqdd2z3phv5src02fws3pbu2yztgpkfwq6k0q`
        );
        const jsonResult = await result.json();

        setTerm(jsonResult);
        localStorage.setItem("wotd", JSON.stringify(jsonResult));
        localStorage.setItem("wotdDate", today);
        localStorage.setItem("randomDate", randomDate); // Store the random date for today
      };
      fetchData();
    }
  }, []);

  if (!term) {
    return <p>Loading...</p>; // Display a loading message while fetching data
    // add a style to this
  }

  return (
    <div className="card">
      <h2 className="card-title">{term.word}</h2>
      {term.definitions && term.definitions.length > 0 ? (
        <>
          <p className="card-body"><strong>Word type:</strong> {term.definitions[0].partOfSpeech}</p>
          <p className="card-body">1. {term.definitions[0].text}</p>
          {term.definitions[1] && <p className="card-body">2. {term.definitions[1].text}</p>}
        </>
      ) : (
        <p className="card-body">No definitions available, please wait for another word!</p>
      )}
      {term.examples && term.examples.length > 0 && (
        <p className="example-sentence"> {term.examples[0].text} </p>
      )}
      <p className="etymology">
        <strong>Note:</strong> {term.note}
      </p>
    </div>
  );
}

export default Card;
