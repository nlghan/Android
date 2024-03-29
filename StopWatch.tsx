import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

function StopwatchApp() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startStopwatch = () => {
    if (running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setRunning(false);
      }
    } else {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        setTime(elapsedTime);
      }, 10);
      setRunning(true);
    }
  };

  const resetStopwatch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    setRunning(false);
    setHistory([]);
  };

  const recordTime = () => {
    const formattedTime = formatTime(time);
    setHistory([...history, formattedTime]);
  };

  const formatTime = (ms: number) => {
    const date = new Date(ms);
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getMilliseconds() / 10)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(time)}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, running ? styles.buttonStop : styles.buttonStart]}
          onPress={startStopwatch}
        >
          <Text style={styles.buttonText}>{running ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonReset]}
          onPress={resetStopwatch}
          disabled={!time && !running}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonRecord]}
          onPress={recordTime}
          disabled={!running}
        >
          <Text style={styles.buttonText}>Record</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>History:</Text>
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.historyItem}>{item}</Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonStart: {
    backgroundColor: 'green',
  },
  buttonStop: {
    backgroundColor: 'red',
  },
  buttonReset: {
    backgroundColor: 'blue',
  },
  buttonRecord: {
    backgroundColor: 'purple',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default StopwatchApp;
