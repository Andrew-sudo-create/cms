import { useEffect, useState } from 'react';
import './App.scss'

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')  // Note the relative path here
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);
 

  return (
    <>
      <div>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}
    </div>
  
    </>
  )
}

export default App
