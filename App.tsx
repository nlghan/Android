import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [rs, setRs] = useState('0');
  const [weightError, setWeightError] = useState(false);
  const [heightError, setHeightError] = useState(false);
  const [weightFocus, setWeightFocus] = useState(false);
  const [heightFocus, setHeightFocus] = useState(false);

  const onCalculate = () => {
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);

    // Kiểm tra xem weight và height có chứa giá trị hợp lệ không
    if (isNaN(weightVal) || weightVal <= 0) {
      setWeightError(true);
      return;
    } else {
      setWeightError(false);
    }

    if (isNaN(heightVal) || heightVal <= 0) {
      setHeightError(true);
      return;
    } else {
      setHeightError(false);
    }

    // Tính chỉ số BMI
    const bmi = weightVal / Math.pow(heightVal / 100, 2);

    setRs(bmi.toFixed(2).toString());

    // Kiểm tra chỉ số BMI và hiển thị thông báo
    checkBMI(bmi);
  };

  const resetBMI = () => {
    setRs('0');
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const checkBMI = (bmi: number) => {
    let status = '';
    if (bmi < 18.5) {
      status = 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
      status = 'Normal weight';
    } else if (bmi >= 25 && bmi < 32) {
      status = 'Overweight';
    } else {
      status = 'Obesity';
    }
  
    Alert.alert('BMI Result', `Your BMI: ${bmi.toFixed(2)}\nStatus: ${status}`);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.text}>Weight (KG)</Text>
            <TextInput
              style={[
                styles.textInput,
                weightError && styles.inputError,
                weightFocus && styles.inputFocus,
              ]}
              placeholder='0'
              placeholderTextColor={'black'}
              keyboardType='decimal-pad'
              value={weight}
              onChangeText={text => {
                setWeight(text);
                resetBMI(); // Reset chỉ số BMI khi nhập mới cân nặng
                setWeightError(false); // Reset lỗi khi người dùng nhập
              }}
              onFocus={() => setWeightFocus(true)}
              onBlur={() => setWeightFocus(false)}
            />
            {weightError && <Text style={styles.errorText}>Please enter a valid weight.</Text>}
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.text}>Height (CM)</Text>
            <TextInput
              style={[
                styles.textInput,
                heightError && styles.inputError,
                heightFocus && styles.inputFocus,
              ]}
              placeholder='0'
              placeholderTextColor={'black'}
              keyboardType='decimal-pad'
              value={height}
              onChangeText={text => {
                setHeight(text);
                resetBMI(); // Reset chỉ số BMI khi nhập mới chiều cao
                setHeightError(false); // Reset lỗi khi người dùng nhập
              }}
              onFocus={() => setHeightFocus(true)}
              onBlur={() => setHeightFocus(false)}
            />
            {heightError && <Text style={styles.errorText}>Please enter a valid height.</Text>}
          </View>

          <View style={styles.sub}>
            <Text style={styles.text2}>BMI: {rs}</Text>
            <TouchableOpacity
              onPress={onCalculate}
              style={styles.btn}>
              <Text style={styles.text1}>Compute</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    height: 35,
    marginTop: 8,
  },
  text: {
    fontSize: 20
  },
  text1: {
    color: 'black',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 20,
  },
  text2: {
    fontSize: 20,
    
  },
  btn: {
    borderColor: 'black',
    backgroundColor: 'lightblue',
    borderWidth: 0.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    width: 120,
    height: 50,
    justifyContent: 'center',
    marginTop: 15,
  },
  sub: {
    marginTop: 15,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red', // Border màu đỏ khi có lỗi
  },
  inputFocus: {
    borderColor: '#3ba7cf', // Border màu xanh khi được focus
    
  },
  errorText: {
    color: 'red', // Màu chữ đỏ khi có lỗi
    fontSize: 12,
    marginTop: 5,
  },
});

export default App;
