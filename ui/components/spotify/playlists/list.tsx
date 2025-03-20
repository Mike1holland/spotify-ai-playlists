"use client";
import React from "react";
import Button, { ButtonClass, ButtonType } from "@/ui/components/global/button";

const PlaylistList = ({ playlists }: PlaylistListProps) => {
  const [currPlaylists, setPlaylists] = React.useState<Playlist[]>(playlists);
  const [playlistsLoaded, setPlaylistsLoaded] = React.useState<boolean>(false);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState<string | null>(
    null
  );

  const refreshPlaylists = async () => {
    try {
      const response = await fetch("/api/spotify/playlists?limit=50&offset=0");
      const data = await response.json();
      setPlaylists(data.items);
      setPlaylistsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylist(e.target.value);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {playlistsLoaded && currPlaylists.length === 0 && (
        <p className="text-2xl text-center">No playlists found</p>
      )}
      {!playlistsLoaded && (
        <p className="text-2xl text-center">
          Click "Refresh Playlists" to load your playlists
        </p>
      )}
      <select className="border-2 rounded-md p-4 w-full">
        {currPlaylists.map((playlist) => {
          const image =
            playlist.images?.find((image) => image.height === 60) ||
            playlist.images?.at(0);
          const isSelected = selectedPlaylist === playlist.id;
          return (
            <option selected={isSelected} key={playlist.id} value={playlist.id}>
              {image && (
                <span>
                  <img src={image.url} />
                </span>
              )}
              <span>{playlist.name}</span>
              <span>{playlist.external_urls.spotify}</span>
            </option>
          );
        })}
      </select>
      <Button
        buttonType={ButtonType.Button}
        onClick={refreshPlaylists}
        text="Refresh Playlists"
        buttonClass={ButtonClass.Secondary}
      />
    </div>
  );
};

export default PlaylistList;

interface PlaylistListProps {
  playlists: Playlist[];
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string; height?: number; width?: number }[];
  external_urls: { spotify: string };
}
