import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

const YouTubePlayer = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(true);

  // Extract the video ID from the YouTube URL
  const getVideoIdFromUrl = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*v=([^&]+)/) ||
                         url.match(/(?:https?:\/\/)?youtu\.be\/([^?]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const videoId = getVideoIdFromUrl(videoUrl);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      alert("Video has finished playing!");
    }
  }, []);

  return (
    <View style={styles.container}>
      {videoId ? (
        <YoutubeIframe
          height={250}
          width={Dimensions.get("window").width - 20}
          videoId={videoId}
          play={playing}
          onChangeState={onStateChange}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid YouTube URL</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

export default YouTubePlayer;
