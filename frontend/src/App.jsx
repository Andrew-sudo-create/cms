import { useEffect,useState } from "react";
// import DataFetcher from "./components/DataFetcher";
import './App.scss'

function App() {
  const [fetchedData, setFetchedData] = useState([]);
  console.log(import.meta.env.VITE_API_URL)
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "api/data")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data.data); // Check what's inside data
        setFetchedData(data.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <div>
      <h1>My CMS Frontend</h1>
      {fetchedData && fetchedData.length > 0 ? (
      fetchedData.map((item) => <p key={item.id}>{item.title}</p>)
    ) : (
      <p>Loading or no data available...</p>
    )}
  
    </div>
  
    </>
  )
}

export default App
