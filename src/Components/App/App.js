import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import Preview from '../Preview/Preview';
import Playlists from  '../Playlists/Playlists';

// import Logout from '../Logout/Logout';



class App extends React.Component {
  constructor(props){
    super(props);
//set an initial states
    this.state = {
      searchResults: [],
      playlistName: 'playlist',
      playlistTracks: [],
      playlists: [],
      tracks: [],
    }
    //bind the methods that use state/setState to update the state
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.preview = this.preview.bind(this);
    this.loadPlaylist = this.loadPlaylist.bind(this);
  }

  //method for adding song from the search results to the user's playlist
addTrack(track) {
  let tracks = this.state.playlistTracks;
  let searchTracks = this.state.searchResults;
  //check to see if song is already in playlistTracks state with track's id property
  if(tracks.find(savedTrack => savedTrack.id === track.id)) {
    //if it is then end the method
    return;
  }
    //if new then push the new song to the array
    tracks.push(track);
    //grab the index of selected track
    let index = searchTracks.indexOf(track);
    //remove the added track from the search results
    searchTracks.splice(index, 1);
    //update the state of the search results
    this.setState({searchResults: searchTracks});
    //then set the state of the playlist to the tracks array of objects
    this.setState({playlistTracks: tracks});
    console.log(this.state.playlistTracks);
  }

  //method for removing song from user's playlist
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let searchTracks = this.state.searchResults;
    //look through the playlistTracks for see if the song has a matching id
    //if it matches the function !== is a false statement and it will be filtered out.
    searchTracks.unshift(track);
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
//set the value of playlistTracks to the new filtered array, tracks
console.log(tracks)
this.setState({searchResults: searchTracks});
  this.setState({playlistTracks : tracks});
  }


  //method that allows users to change the name of their playlist
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  //method for generating saving user's playlist to their Spotify account
  //and resets the state of playlistName and playlistTracks array
  savePlaylist(){
    //Spotify uses a property named uri to reference each song
    //loop through these uri values with .map and save them to a variable
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    //pass in the savePlaylist method from Spotify.js and use a promise
    //to update the state of PlaylistName and PlaylistTracks
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
    window.location.reload();
  }

  //method that updates searchResults with the user's search results from the Spotify API
  search(term){
    //pass in the search method from Spotify.js and use a promise
    Spotify.search(term).then(searchResults => {
      //to update the state of searchResults' to value result of the Spotify.search promise
      this.setState({searchResults: searchResults});
      console.log(this.state.searchResults);
      localStorage.setItem('term', term);
    });
  }

  //method that allows user to preview song
  preview(track){
    //grab the id of selected track
    let trackId = track.id;
    const previewDiv = document.querySelector('.preview');
    Spotify.previewTrack(trackId).then(previewUrl => {
      if(!previewUrl){
        previewDiv.innerHTML = '<p> No preview available for this track </p>';
      } else {
        previewDiv.innerHTML = `<object type="text/html" data="${previewUrl}" ></object>`;
      }
    });
  }

  //method that pulls up user playlists
  loadPlaylist(){
    const  playlistDiv = document.querySelector('.playlist');
    Spotify.getPlaylists().then(playlist => {
      
      const playlists = playlist[0];
      console.log(playlists, playlist[1]);
      const accessToken = Spotify.getAccessToken();
      const fetchPromises = playlist[1].map(function(href) {
        return fetch(href, {
          headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
 //use setTime to avoid render errors due to hrefs loading at different times
  })
  
  setTimeout(() => { 
    
    fetchPromises.forEach(fProm => {
           fProm
             .then(response => response.json())
             .then(jsonResponse => {
              let innerhtml = []
         const tracklist = jsonResponse.items.map(tracklist => {
                  return tracklist.track.name
                 })   

                // playlistDiv.innerHTML += '<h2>' +  playlists.shift() + '</h2>' +
                //  '<ul>' + tracklist.map(track => {
                //  return '<li>' + track + '</li>'
                //  }).join("") + '</ul>';
                 

                // save the playlist names and tracks to a variable and push them the tracks state
                innerhtml += '<h2>' +  playlists.shift() + '</h2>' +
                 '<ul>' + tracklist.map(track => {
                 return '<li>' + track + '</li>'
                 }).join("") + '</ul>';
                 this.state.tracks.push(innerhtml);
             })
         })
     }, 250);  
     console.log('getting the  state in App.js', this.state.tracks);
  })
}

  // forgetPlaylist(){
  //   Spotify.deletePlaylist();
  // }
 

  // //repopulate inputfield
  // componentDidMount() {
  //   const input = document.querySelector('input');
  //   let term = localStorage.getItem('term');
  //   if(!term === null){
  //     console.log(term);
  //     input.value = term;
  //     // localStorage.removeItem('term');
  //     return;
  //   } else
  //   return;
  // }


  render() {
  return (
<div>
<h1>Gr<span className="highlight">oo</span>ving</h1>
<Playlists loadPlaylists={this.loadPlaylist} playlists={this.state.playlists} tracks={this.state.tracks} />
    <div className="App">
      {/* Pass all the methods down through the components */}
      <SearchResults className="App-playlist" 
      searchResults={this.state.searchResults} 
      onAdd={this.addTrack}
      previewUrl={this.state.previewUrl} 
      preview={this.preview} 
      />
      <div className="midDiv">
      <SearchBar onSearch={this.search} searchTerm={this.state.searchTerm} />
      <Preview />
      
      </div>
      <Playlist className="App-playlist" playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} 
        onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} 
        onSave={this.savePlaylist}
        />
    
  </div>
</div>
    );
  }
}

export default App;
