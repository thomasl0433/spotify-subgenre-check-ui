import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';
import Highcharts from 'highcharts/';
import HighchartsReact from 'highcharts-react-official';
import HC_more from 'highcharts/highcharts-more' //module
import HeaderInfo from './components/headerInfo'
HC_more(Highcharts) //init module


function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_ENV === "DEV" ? "http://localhost:3000" : "https://spotify-subgenre-thomasl0433.vercel.app";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [expired, setExpired] = useState("");
  const [topArtists, setTopArtists] = useState([]);
  const [subgenreData, setSubgenreData] = useState([]);
  const [notAllowed, setNotAllowed] = useState("");
  const [largeGenres, setLargeGenres] = useState([]);
  // const [searchKey, setSearchKey] = useState("");
  // const [artists, setArtists] = useState([]);

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
    // cache token
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);

    // uncomment these out to test permission error messages
    // setNotAllowed("not_allowed")
    // setExpired("expired")
  }, [])

  useEffect(() => {
    // prevent api calls before logging in 
    if (token != null && token.length > 100) {
      // load HighChart once the token is modified and contains the relevant info
      getTopArtists(token)
    }
  }, [token])

  const logout = () => {
    setToken("");
    setExpired(null)
    setNotAllowed(null)
    window.localStorage.removeItem("token");
  }

  const populateSubgenreData = (dataList) => {
    const genreList = [];
    const counts = {};
    const outputList = [];
    //console.log(dataList)

    // iterate through list of top artists
    for (let i = 0; i < dataList.length; i++) {
      // iterate through each genre per artist
      for (let j = 0; j < dataList[i].genres.length; j++) {
        // genreList is a comprehensive list of all genres, includes duplicates
        genreList.push(dataList[i].genres[j]);
      }
    }

    // create counts obj that stores a key:val for each genre, i.e. {rap: 10, rock:3}
    for (const genre of genreList) {
      counts[genre] = counts[genre] ? counts[genre] + 1 : 1;
    }

    console.log(counts)

    // append {genre: count} object with below struture to outputList to feed into HighChart js
    // final result example = [{name: rap, data: [{name: rap, value: 4}], showInLegend: false}, 
    //                         {name: jazz, data: [{name: jazz, value: 8}], showInLegend: false}]
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
    //console.log(outputList)
    setSubgenreData(outputList)
  }

  const getTopArtists = async (input_token) => {
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${input_token}`
      }
    }).catch(function(error) {
      if (error.response.status === 401) {
        // expired token
        console.log("token has expired, logout and back in")
        setToken("")
        setExpired("expired")
      } else if (error.response.status === 403) {
        // forbidden access
        console.log("forbidden access, user needs to be whitelisted")
        setNotAllowed("not_on_list")
      }
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    })

    setTopArtists(data.items);
    populateSubgenreData(data.items)
  }

  const loginString = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`

  return (
    <div className="mx-auto rounded-xl p-8 flex items-center flex-col">
      <div className="">
        <h1 className="text-3xl font-bold text-center">Spotify Subgenre Visualization</h1>   
        <p>{process.env.ENV}</p>
      </div>

      { expired ?
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Session expired: </strong>
        <span className="block sm:inline">Please logout and try again.</span>
      </div> : ""
      }

      { notAllowed ?
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Account not approved: </strong>
        <span className="block sm:inline">Please reach out to Thomas to be added.</span>
      </div> : ""
      }

      {!token && !expired ? 
        <a 
        href={loginString}
        className="bg-spotify-green rounded-full p-3 text-gray-100 mt-8"
        >Login to Spotify</a>
          : <button className="bg-spotify-green rounded-full p-3 text-gray-100 mt-8 mb-8" onClick={logout}>Logout</button>
      }

      {token && !expired ? 
        <div id="highchart-wrapper" className="shadow border-4 border-gray-100 rounded-xl overflow-hidden mb-4">
          <HighchartsReact className="" highcharts={Highcharts} options={options} />
        </div>
        
        : ""
      }

      <HeaderInfo />
        
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

// const searchArtists = async (e) => {
  //   e.preventDefault(); 
  //   const {data} = await axios.get("https://api.spotify.com/v1/search", {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //     params: {
  //       q: searchKey,
  //       type: "artist"
  //     }
  //   })
    
  //   //console.log(data);
  //   setArtists(data.artists.items);
  // }

  // const renderArtists = () => {
  //   return artists.map(artist => {
  //     return <div key={artist.id}>
  //       {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No image</div>}
  //       {artist.name}
  //     </div>
  //   })
  // }

  // const renderTopArtists = () => {
  //   return topArtists.map(artist => {
  //     return <div key={artist.id}>
  //       {artist.name}
  //     </div>
  //   })
  // }