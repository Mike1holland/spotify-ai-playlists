"use client";
import React from "react";
import Button, { ButtonClass, ButtonType } from "@/ui/components/global/button";

const PlaylistList = ({ playlists }: PlaylistListProps) => {
  const [currPlaylists, setPlaylists] = React.useState<Playlist[]>(playlists);

  const refreshPlaylists = () => {
    fetch("/api/spotify/playlists")
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data);
      });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <select className="border-2 rounded-md p-4 w-full">
        {currPlaylists.map((playlist) => {
          const image =
            playlist.images.find((image) => image.height === 60) ||
            playlist.images.at(0);
          return (
            <option key={playlist.id} value={playlist.id}>
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
