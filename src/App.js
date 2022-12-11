import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
import Highcharts from 'highcharts/';
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more' //module
import Button from 'react-bootstrap/Button';
HC_more(Highcharts) //init module


function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  // const REDIRECT_URI = "https://spotify-subgenre-thomasl0433.vercel.app"
  //const REDIRECT_URI = "http://localhost:3000";
  const REDIRECT_URI = process.env.ENV === "DEV" ? "http://localhost:3000" : "https://spotify-subgenre-thomasl0433.vercel.app";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [subgenreData, setSubgenreData] = useState([]);

  const options = {
    chart: {
      type: 'packedbubble',
      height: '100%'
    },
    title: {
      text: 'Top Listening Subgenres'
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.y}</sub>'
    },
    series: subgenreData,
    credits: {
      enabled: false
    },
    plotOptions: {
      packedbubble: {
        minSize: '30%',
        maxSize: '170%',
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, [])

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  }

  const searchArtists = async (e) => {
    e.preventDefault(); 
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })
    

    //console.log(data);
    setArtists(data.artists.items);
  }

  const renderArtists = () => {
    return artists.map(artist => {
      return <div key={artist.id}>
        {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No image</div>}
        {artist.name}
      </div>
    })
  }

  const populateSubgenreData = (dataList) => {
    const genreList = [];
    const counts = {};
    const outputList = [];

    // iterate through list of top artists
    for (let i = 0; i < dataList.length; i++) {
      // iterate through each genre per artist
      for (let j = 0; j < dataList[i].genres.length; j++) {
        genreList.push(dataList[i].genres[j]);
      }
    }

    for (const genre of genreList) {
      counts[genre] = counts[genre] ? counts[genre] + 1 : 1;
    }

    //console.log(output)
    for (const [key, value] of Object.entries(counts)) {
      outputList.push({
        name: key,
        data: [
          {
            name: key,
            value: value
          }
        ],
        showInLegend: false
      });
    }
    //setSubgenreData([{name: "test", data: [1,2,3]}])
    console.log(outputList)
    setSubgenreData(outputList)
  }

  const getTopArtists = async (e) => {
    e.preventDefault();
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    //console.log(data);
    setTopArtists(data.items);
    populateSubgenreData(data.items)
  }

  const renderTopArtists = () => {
    return topArtists.map(artist => {
      return <div key={artist.id}>
        {artist.name}
      </div>
    })
  }
  
  const loginString = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`

  return (
    <div className="container mx-auto rounded-xl p-8 flex items-center flex-col">
      <div className="">
        <h1 className="text-3xl font-bold text-center">Spotify Subgenre Visualization</h1>   
      </div>
      {!token ? 
        <a 
        href={loginString}
        className="bg-spotify-green rounded-sm p-2 text-gray-100 m-8">Login to Spotify</a>
          : <button onClick={logout}>Logout</button>
      }

      { token ? 
        <form onSubmit={getTopArtists}>
          <button type={"submit"}>Get top artists</button>
        </form>
        : ""
      }

        
      {token ? 
        <HighchartsReact highcharts={Highcharts} options={options} />
        : ""
      }
        
    </div>
  );

 
}

export default App;

/*

{/* {token ?
          <form onSubmit={searchArtists}>
            <input type="text" onChange={e => setSearchKey(e.target.value)}/>
            <button type={"submit"}>Search</button>
          </form>
          : <h2>Please login</h2>
        } *}

{/* {renderTopArtists()} /}
{/* {renderArtists()} /}

 // return (
  //   <div className="container mx-auto bg-gray-200 rounded-xl shadow border p-8 m-10">
  //     <p className="text-3xl text-gray-700 font-bold mb-5">
  //       Welcome!
  //     </p>
  //     <p className="text-gray-500 text-lg">
  //       React and tailwindcss in action!
  //     </p>
  //   </div>
  // )
*/