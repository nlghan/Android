import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, ScrollView } from 'react-native';

interface Lap {
  lapTime: string;
  elapsedTime: string;
}

const App = (): React.JSX.Element => {
  const [timeElapsed, setTimeElapsed] = useState("00:00:00");
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartPress = () => {
    if (running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setRunning(false);
      setStartTime(null);
      return;
    }

    setStartTime(new Date());
    intervalRef.current = setInterval(() => {
      if (startTime) {
        const elapsed = getElapsedTime(startTime);
        setTimeElapsed(elapsed);
        setRunning(true);
      }
    }, 30);
  };

  const handleLapPress = () => {
    if (!running) {
      return;
    }

    const lapTime = getElapsedTime(startTime!);
    const lap: Lap = {
      lapTime,
      elapsedTime: timeElapsed,
    };
    setLaps([...laps, lap]);
  };

  const handleResetPress = () => {
    setLaps([]);
  };

  const getElapsedTime = (startTime: Date) => {
    const currentTime = new Date();
    const elapsedTime = currentTime.getTime() - startTime.getTime();
    const hours = Math.floor(elapsedTime / (60 * 60 * 1000));
    const minutes = Math.floor((elapsedTime % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); // Lấy 2 chữ số cuối
    return `${padNumber(minutes)}:${padNumber(seconds)}:${padNumber(milliseconds, 2)}`;
  };

  const padNumber = (num: number, length = 2) => {
    return num.toString().padStart(length, '0');
  };

  const lapButton = () => {
    return (
      <TouchableHighlight
        style={[styles.btn, !running && laps.length === 0 && styles.disabledButton]}
        underlayColor="gray"
        onPress={handleLapPress}
        disabled={!running && laps.length === 0} // Disable khi chưa bắt đầu và chưa có lap
      >
        <Text style={styles.textBtn}>Lap</Text>
      </TouchableHighlight>
    );
  };

  const resetButton = () => {
    return (
      <TouchableHighlight
        style={[styles.btn, styles.resetButton]}
        underlayColor="gray"
        onPress={handleResetPress}
        disabled={laps.length === 0} // Disable khi không có lap để reset
      >
        <Text style={styles.textBtn}>Reset</Text>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>{timeElapsed}</Text>
      </View>
      <View style={styles.wrapBtn}>
        <TouchableHighlight
          style={styles.btn}
          underlayColor="gray"
          onPress={handleStartPress}
        >
          <Text style={styles.textBtn}>{running ? 'Stop' : 'Start'}</Text>
        </TouchableHighlight>
        {lapButton()}
        {resetButton()}
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {laps.map((lap, index) => (
          <View style={styles.lap} key={index}>
            <Text style={styles.textLap}>Lap #{index + 1}</Text>
            {/* <Text style={styles.textLap}>{lap.lapTime}</Text> */}
            <Text style={styles.textLap}>{lap.elapsedTime}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    margin:40,
  },
  header:{
    marginTop:100,
    marginBottom: 100,
    width:'100%',
    alignItems: 'center',
  },
  textHeader:{
    fontSize: 75,
    color: 'black',
  },
  wrapBtn:{
    flexDirection:'row',
    justifyContent: 'space-between',
    // backgroundColor:'blue',
    marginBottom:30,
    marginLeft:25,
    marginRight:25,
  },
  btn:{
    borderColor: 'black',
    borderRadius:50,
    borderWidth:2,
    height:85,
    width:85,
    justifyContent:'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: 'pink',
  },
  textBtn:{
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
  },
  lap:{
    backgroundColor: 'lightgray',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent:'space-around',
    height:70,
    alignItems: 'center'
  },
  textLap:{
    fontSize: 20,
    color: 'black',
  },
  disabledButton: {
    opacity: 0.5, // Opacity để làm mờ nút khi disabled
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
});

export default App;
