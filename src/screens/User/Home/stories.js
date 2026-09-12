import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Pressable, Animated, Dimensions, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UserContext } from '../../../context/UserContext';
import axios from 'axios';
import { baseUrl } from '../../../connections';

const { width, height } = Dimensions.get('window');

const sampleStories = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    viewed: false,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
    viewed: false,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    viewed: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    viewed: false,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    viewed: false,
  },
];

export default function StoriesScreen() {
  const [stories, setstories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animationRef = useRef(null);

  const { userDetails } = useContext(UserContext);

  const getListStories = useCallback(() => {

    axios.get(`${baseUrl}/popup/list?user_uuid=${userDetails?.uuid}`, {
      headers: {
        'x-auth-token': userDetails?.token,
      },
    })
      .then((res) => {
        const data = [];
        res?.data?.data?.map((item) => {
          data?.push(
            {
              id: item?.uuid,
              username: item?.name,
              avatar: item?.image,
              image: item?.image,
              viewed: item?.seen,
            }
          );
        });
        setstories(data);
      })
      .catch(err => {
        if (__DEV__) {
          console.log(err, 'errr');
        }
      });
  }, [userDetails?.token, userDetails?.uuid]);
  useEffect(() => {
    getListStories();
  }, [getListStories]);

  const startStoryAnimation = (index) => {
    if (index >= stories?.length || index < 0) {
      setIsPlaying(false);
      return;
    }

    setCurrentStoryIndex(index);
    progressAnim.setValue(0);
    fadeAnim.setValue(1);

    animationRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        startStoryAnimation(index + 1);
      }
    });
  };

  const handlePlayPress = () => {
    setIsPlaying(true);
    startStoryAnimation(0);
  };

  const handleClose = () => {
    setIsPlaying(false);
    if (animationRef.current) {
      animationRef.current.stop();
    }
    fadeAnim.setValue(0);
    progressAnim.setValue(0);
  };

  const handlePrevious = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    const newIndex = Math.max(0, currentStoryIndex - 1);
    startStoryAnimation(newIndex);
  };

  const handleNext = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    const newIndex = Math.min(stories.length - 1, currentStoryIndex + 1);
    startStoryAnimation(newIndex);
  };



  const renderStoryModal = () => {

    if (!isPlaying || currentStoryIndex >= stories.length) {return null;}

    const currentStory = stories[currentStoryIndex];



    return (
      <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>

        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.modalHeader}>
          <View style={styles.progressContainer}>
            {stories?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressBackground,
                  index === currentStoryIndex && styles.progressBackgroundActive,
                ]}
              >
                {index === currentStoryIndex && (
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </Pressable>

        {/* Navigation Buttons */}
        {/* <Pressable
          style={[styles.navButton, styles.prevButton]}
          onPress={handlePrevious}
          disabled={currentStoryIndex === 0}
        >
          <Text style={styles.navButtonText}>◀</Text>
        </Pressable>
        <Pressable
          style={[styles.navButton, styles.nextButton]}
          onPress={handleNext}
          disabled={currentStoryIndex === stories.length - 1}
        >
          <Text style={styles.navButtonText}>▶</Text>
        </Pressable> */}

        <View style={styles.content}>
          <Image source={{ uri: currentStory.image }} style={styles.image} />
        </View>
      </Animated.View>
    );
  };
 function StoryCircle({ avatar, username, viewed, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.storyContainer}>
        <View style={styles.avatarContainer}>
          <Image source={require('../../../assets/images/story.png')} style={styles.avatar}/>
        </View>
    </Pressable>
  );
}


  return (
    <View style={styles.container}>
      {/* !isPlaying && */}
      { stories?.length > 0 && (
        <Pressable  >
           <StoryCircle onPress={handlePlayPress}/>
        </Pressable>
        )}
      {renderStoryModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    zIndex:999,
  },
  playButton: {
    width: 200,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 0,
    shadowOpacity: 0,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  playText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalContainer: {
    position: 'absolute',
    top:-40,
    left: -204,
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.9)',

  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    position: 'absolute',
    top: 40,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  progressBackground: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBackgroundActive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',

     borderRadius: 12,
  },

  navButton: {
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    transform: [{ translateY: -25 }],
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  navButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  storyContainer: {
    alignItems: 'flex-end',
    marginLeft: '40%',
    width: 72,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
